import { startCaptureServer } from "./capture-server";
import { getDuePosts, updatePostStatus, getAccount, saveAnalyticsSnapshot } from "@prism/db";
import { decrypt } from "@prism/crypto";
import { isSafeHour, humanDelay, MIN_GAP_MS } from "./lib/humanize";
import * as instagram from "./providers/instagram";
import * as twitter from "./providers/twitter";
import * as tiktok from "./providers/tiktok";
import type { Platform } from "@prism/db";

const POLL_INTERVAL = parseInt(process.env.WORKER_POLL_INTERVAL_MS ?? "60000");

// Track last post time per account to enforce min gaps
const lastPostTime: Record<string, number> = {};

async function processPost(post: Awaited<ReturnType<typeof getDuePosts>>[number]) {
  console.log(`[worker] Processing post ${post.id}`);
  await updatePostStatus(post.id, "processing");

  for (const platform of post.platforms) {
    const account = await getAccount(`${post.userId}_${platform}`);
    if (!account) {
      console.warn(`[worker] No account found for ${platform}`);
      continue;
    }

    // Enforce min gap between posts
    const lastTime = lastPostTime[account.id] ?? 0;
    const gap = MIN_GAP_MS[platform] ?? 30_000;
    const elapsed = Date.now() - lastTime;
    if (elapsed < gap) {
      const wait = gap - elapsed;
      console.log(`[worker] Waiting ${Math.round(wait / 1000)}s before posting to ${platform}`);
      await humanDelay(wait, wait + 5000);
    }

    const session = JSON.parse(decrypt(account.encryptedSession));

    try {
      if (platform === "instagram") {
        await instagram.post({
          session,
          mediaPath: post.mediaUrls[0] ?? "",
          caption: post.caption,
        });
      } else if (platform === "twitter") {
        await twitter.post({
          session,
          text: post.caption,
          mediaPath: post.mediaUrls[0],
        });
      } else if (platform === "tiktok") {
        await tiktok.post({
          session,
          videoPath: post.mediaUrls[0] ?? "",
          caption: post.caption,
        });
      }

      lastPostTime[account.id] = Date.now();
      console.log(`[worker] ✓ Published to ${platform}`);
    } catch (err) {
      console.error(`[worker] ✗ Failed ${platform}:`, err);
      await updatePostStatus(post.id, "failed", { error: String(err) });
      return;
    }

    // Human-like gap between platforms
    await humanDelay(3000, 8000);
  }

  await updatePostStatus(post.id, "published", { publishedAt: Date.now() });
}

async function runAnalytics() {
  // Analytics scrape runs once every 6 hours
  console.log("[worker] Analytics scrape skipped (implement per account)");
}

async function tick() {
  if (!isSafeHour()) {
    console.log("[worker] Outside safe posting hours, skipping...");
    return;
  }

  const posts = await getDuePosts();
  console.log(`[worker] Found ${posts.length} due posts`);

  for (const post of posts) {
    await processPost(post);
  }
}

async function main() {
  console.log(`[worker] PRISM worker started — polling every ${POLL_INTERVAL / 1000}s`);

  // Capture server only runs locally (needs visible browser for user interaction)
  if (process.env.ENABLE_CAPTURE_SERVER !== "false") {
    startCaptureServer(3002);
  } else {
    console.log("[worker] Capture server disabled (cloud mode)");
  }

  await tick();
  setInterval(tick, POLL_INTERVAL);

  // Analytics every 6 hours
  setInterval(runAnalytics, 6 * 60 * 60 * 1000);
}

main().catch(console.error);
