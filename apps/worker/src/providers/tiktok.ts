import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { humanDelay, humanType } from "../lib/humanize";
import type { SessionState } from "./instagram";

chromium.use(StealthPlugin());

export async function captureSession(): Promise<SessionState> {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.tiktok.com/login");
  console.log("[tiktok] Waiting for user to login...");

  await page.waitForURL((url) => url.includes("tiktok.com/foryou"), { timeout: 120_000 });
  await humanDelay(2000, 3000);

  const state = await context.storageState();
  await browser.close();
  return state as SessionState;
}

export async function post(options: {
  session: SessionState;
  videoPath: string;
  caption: string;
}): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: options.session as any });
  const page = await context.newPage();

  try {
    await page.goto("https://www.tiktok.com/upload");
    await humanDelay(3000, 5000);

    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click("input[type='file']"),
    ]);
    await fileChooser.setFiles(options.videoPath);
    await humanDelay(4000, 8000);

    // Type caption
    const captionBox = await page.$("div[contenteditable='true']");
    if (captionBox) {
      await captionBox.click();
      await humanDelay(500, 1000);
      await humanType(page, "div[contenteditable='true']", options.caption);
    }

    await humanDelay(1500, 3000);
    await page.click("button:has-text('Post')");
    await humanDelay(3000, 6000);
    console.log("[tiktok] Posted successfully");
  } finally {
    await browser.close();
  }
}

export async function scrapeAnalytics(session: SessionState): Promise<{
  followers: number;
  following: number;
  likes: number;
}> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: session as any });
  const page = await context.newPage();

  try {
    await page.goto("https://www.tiktok.com/foryou");
    await humanDelay(2000, 3000);

    await page.click("a[data-e2e='nav-profile']");
    await humanDelay(2000, 3000);

    const getText = async (selector: string) => {
      const el = await page.$(selector);
      return el ? parseCount(await el.textContent() ?? "0") : 0;
    };

    return {
      followers: await getText("strong[data-e2e='followers-count']"),
      following: await getText("strong[data-e2e='following-count']"),
      likes: await getText("strong[data-e2e='likes-count']"),
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
