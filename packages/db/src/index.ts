import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import type { Post, SocialAccount, AnalyticsSnapshot, PostStatus } from "./types";

export * from "./types";

function getDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
    });
  }
  return getFirestore();
}

// Posts
export async function getDuePosts(): Promise<Post[]> {
  const db = getDb();
  const now = Date.now();
  const snap = await db
    .collection("posts")
    .where("status", "==", "scheduled")
    .where("scheduledAt", "<=", now)
    .limit(20)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
}

export async function updatePostStatus(
  postId: string,
  status: PostStatus,
  extra?: Partial<Post>
): Promise<void> {
  const db = getDb();
  await db.collection("posts").doc(postId).update({ status, ...extra });
}

// Social Accounts
export async function getAccount(accountId: string): Promise<SocialAccount | null> {
  const db = getDb();
  const doc = await db.collection("social_accounts").doc(accountId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as SocialAccount;
}

export async function getAccountsByUserId(userId: string): Promise<SocialAccount[]> {
  const db = getDb();
  const snap = await db.collection("social_accounts").where("userId", "==", userId).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SocialAccount));
}

export async function saveAccount(data: Omit<SocialAccount, "id">): Promise<string> {
  const db = getDb();
  const ref = await db.collection("social_accounts").add(data);
  return ref.id;
}

export async function updateAccountSession(
  accountId: string,
  encryptedSession: string
): Promise<void> {
  const db = getDb();
  await db.collection("social_accounts").doc(accountId).update({ encryptedSession });
}

// Analytics
export async function saveAnalyticsSnapshot(
  data: Omit<AnalyticsSnapshot, "id">
): Promise<void> {
  const db = getDb();
  await db.collection("analytics_snapshots").add(data);
}
