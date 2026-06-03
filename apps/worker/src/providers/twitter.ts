import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { humanDelay, humanType } from "../lib/humanize";
import type { SessionState } from "./instagram";

chromium.use(StealthPlugin());

export async function captureSession(): Promise<SessionState> {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://x.com/i/flow/login");
  console.log("[twitter] Waiting for user to login (including 2FA/verification)...");

  // Wait until user exits the login flow — handles 2FA, email verification, etc.
  await page.waitForURL(
    (url) => {
      const u = url.toString();
      return u.includes("x.com") && !u.includes("/i/flow/");
    },
    { timeout: 240_000 }
  );

  // Navigate to home to ensure stable authenticated state before capturing
  await page.goto("https://x.com/home");
  await page.waitForLoadState("networkidle", { timeout: 30_000 });
  await humanDelay(2000, 3000);

  const state = await context.storageState();
  await browser.close();
  return state as SessionState;
}

export async function post(options: {
  session: SessionState;
  text: string;
  mediaPath?: string;
}): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: options.session as any });
  const page = await context.newPage();

  try {
    await page.goto("https://x.com/home");
    await humanDelay(2000, 4000);

    await humanType(page, "div[data-testid='tweetTextarea_0']", options.text);
    await humanDelay(800, 1500);

    if (options.mediaPath) {
      await page.locator("input[data-testid='fileInput']").setInputFiles(options.mediaPath);
      await humanDelay(2000, 4000);
    }

    await page.click("button[data-testid='tweetButtonInline']");
    await humanDelay(2000, 3000);
    console.log("[twitter] Posted successfully");
  } finally {
    await browser.close();
  }
}

export async function scrapeAnalytics(session: SessionState): Promise<{
  followers: number;
  following: number;
}> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: session as any });
  const page = await context.newPage();

  try {
    await page.goto("https://x.com/home");
    await humanDelay(1500, 2500);

    // Navigate to profile
    await page.click("a[data-testid='AppTabBar_Profile_Link']");
    await humanDelay(1500, 2500);

    const followersEl = await page.$("a[href$='/followers'] span");
    const followingEl = await page.$("a[href$='/following'] span");

    return {
      followers: parseCount(await followersEl?.textContent() ?? "0"),
      following: parseCount(await followingEl?.textContent() ?? "0"),
    };
  } finally {
    await browser.close();
  }
}

function parseCount(text: string): number {
  const clean = text.replace(/,/g, "").trim();
  if (clean.endsWith("K")) return Math.round(parseFloat(clean) * 1000);
  if (clean.endsWith("M")) return Math.round(parseFloat(clean) * 1_000_000);
  return parseInt(clean) || 0;
}
