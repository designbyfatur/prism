import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "utf-8").subarray(0, 32);

export function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf-8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(payload: string): string {
  const [ivHex, encryptedHex] = payload.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf-8");
}
