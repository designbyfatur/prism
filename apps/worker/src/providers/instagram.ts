import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Page, BrowserContext } from "playwright";
import { humanDelay, humanType, sleep, randomBetween } from "../lib/humanize";

chromium.use(StealthPlugin());

export interface SessionState {
  cookies: any[];
  origins: any[];
}

/** Open a visible browser for the user to login manually, then capture the session */
export async function captureSession(): Promise<SessionState> {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.instagram.com/accounts/login/");
  console.log("[instagram] Waiting for user to login...");

  // Wait until redirected away from login page
  await page.waitForURL((url) => !url.includes("/accounts/login"), {
    timeout: 120_000,
  });

  await humanDelay(2000, 4000);
  const state = await context.storageState();
  await browser.close();

  return state as SessionState;
}

/** Post an image/video to Instagram using a saved session */
export async function post(options: {
  session: SessionState;
  mediaPath: string;
  caption: string;
}): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: options.session as any });
  const page = await context.newPage();

  try {
    await page.goto("https://www.instagram.com/");
    await humanDelay(2000, 4000);

    // Click new post button
    await page.click("svg[aria-label='New post']", { timeout: 10_000 });
    await humanDelay(1000, 2000);

    // Upload file
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click("button:has-text('Select from computer')"),
    ]);
    await fileChooser.setFiles(options.mediaPath);
    await humanDelay(2000, 4000);

    // Next through crop screen
    await page.click("button:has-text('Next')");
    await humanDelay(1500, 3000);

    // Next through filter screen
    await page.click("button:has-text('Next')");
    await humanDelay(1500, 3000);

    // Type caption
    await humanType(page, "div[aria-label='Write a caption...']", options.caption);
    await humanDelay(1000, 2000);

    // Share
    await page.click("button:has-text('Share')");
    await humanDelay(3000, 6000);

    console.log("[instagram] Posted successfully");
  } finally {
    await browser.close();
  }
}

/** Scrape analytics from Instagram insights */
export async function scrapeAnalytics(session: SessionState): Promise<{
  followers: number;
  following: number;
  posts: number;
}> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: session as any });
  const page = await context.newPage();

  try {
    await page.goto("https://www.instagram.com/");
    await humanDelay(2000, 3000);

    // Navigate to profile
    await page.click("a[href*='/accounts/']");
    await humanDelay(1500, 2500);

    const followers = await extractCount(page, "followers");
    const following = await extractCount(page, "following");
    const posts = await extractCount(page, "posts");

    return { followers, following, posts };
  } finally {
    await browser.close();
  }
}

async function extractCount(page: Page, label: string): Promise<number> {
  try {
    const el = await page.$(`a[href*="${label}"] span, span:has-text("${label}")`);
    if (!el) return 0;
    const text = await el.textContent();
    return parseCount(text ?? "0");
  } catch {
    return 0;
  }
}

function parseCount(text: string): number {
  const clean = text.replace(/,/g, "").trim();
  if (clean.endsWith("K")) return Math.round(parseFloat(clean) * 1000);
  if (clean.endsWith("M")) return Math.round(parseFloat(clean) * 1_000_000);
  return parseInt(clean) || 0;
}
