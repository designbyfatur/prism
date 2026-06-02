/** Returns a random integer between min and max (inclusive) */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Human-like delay */
export async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Random delay between min and max ms */
export async function humanDelay(minMs = 1500, maxMs = 4000): Promise<void> {
  await sleep(randomBetween(minMs, maxMs));
}

/** Type text character by character with random delays */
export async function humanType(
  page: import("playwright").Page,
  selector: string,
  text: string
): Promise<void> {
  await page.click(selector);
  for (const char of text) {
    await page.keyboard.type(char);
    await sleep(randomBetween(50, 180));
  }
}

/** Safe time window check — avoid posting between 1-6 AM local */
export function isSafeHour(): boolean {
  const hour = new Date().getHours();
  return hour < 1 || hour >= 6;
}

/** Per-platform daily post limits */
export const DAILY_LIMITS: Record<string, number> = {
  instagram: 8,
  tiktok: 5,
  twitter: 15,
};

/** Min gap between posts per platform (ms) */
export const MIN_GAP_MS: Record<string, number> = {
  instagram: 30 * 60 * 1000,
  tiktok: 45 * 60 * 1000,
  twitter: 15 * 60 * 1000,
};
