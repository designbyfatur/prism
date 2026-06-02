import { encrypt } from "@prism/crypto";
import { saveAccount, getAccountsByUserId } from "@prism/db";
import * as instagram from "./providers/instagram";
import * as twitter from "./providers/twitter";
import * as tiktok from "./providers/tiktok";
import type { Platform } from "@prism/db";

const CAPTURE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes for user to login

async function captureSession(platform: Platform): Promise<string> {
  let session: any;

  if (platform === "instagram") {
    session = await Promise.race([
      instagram.captureSession(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Login timeout — 5 minutes exceeded")), CAPTURE_TIMEOUT_MS)
      ),
    ]);
  } else if (platform === "twitter") {
    session = await Promise.race([
      twitter.captureSession(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Login timeout — 5 minutes exceeded")), CAPTURE_TIMEOUT_MS)
      ),
    ]);
  } else if (platform === "tiktok") {
    session = await Promise.race([
      tiktok.captureSession(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Login timeout — 5 minutes exceeded")), CAPTURE_TIMEOUT_MS)
      ),
    ]);
  } else {
    throw new Error(`Unknown platform: ${platform}`);
  }

  return encrypt(JSON.stringify(session));
}

export function startCaptureServer(port = 3002) {
  const server = Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      };

      // CORS preflight
      if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
      }

      // Health check
      if (url.pathname === "/health") {
        return Response.json({ ok: true }, { headers });
      }

      // POST /capture/:platform
      if (req.method === "POST" && url.pathname.startsWith("/capture/")) {
        const platform = url.pathname.split("/")[2] as Platform;
        const body = await req.json().catch(() => ({}));
        const userId: string = body.userId ?? "anonymous";

        if (!["instagram", "twitter", "tiktok"].includes(platform)) {
          return Response.json({ error: "Unknown platform" }, { status: 400, headers });
        }

        console.log(`[capture-server] Starting ${platform} capture for user ${userId}`);

        try {
          const encryptedSession = await captureSession(platform);

          const accountId = await saveAccount({
            userId,
            platform,
            username: "connected",
            encryptedSession,
            createdAt: Date.now(),
          });

          console.log(`[capture-server] ✓ ${platform} session saved — account ${accountId}`);
          return Response.json({ ok: true, accountId }, { headers });
        } catch (err) {
          console.error(`[capture-server] ✗ ${platform} capture failed:`, err);
          return Response.json({ error: String(err) }, { status: 500, headers });
        }
      }

      return Response.json({ error: "Not found" }, { status: 404, headers });
    },
  });

  console.log(`[capture-server] Listening on http://localhost:${port}`);
  return server;
}
