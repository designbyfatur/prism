export type Platform = "instagram" | "tiktok" | "twitter";

export type PostStatus = "draft" | "scheduled" | "processing" | "published" | "failed";

export interface SocialAccount {
  id: string;
  userId: string;
  platform: Platform;
  username: string;
  avatarUrl?: string;
  encryptedSession: string;
  sessionExpiresAt?: number;
  createdAt: number;
}

export interface Post {
  id: string;
  userId: string;
  platforms: Platform[];
  caption: string;
  mediaUrls: string[];
  status: PostStatus;
  scheduledAt: number;
  publishedAt?: number;
  error?: string;
  createdAt: number;
}

export interface PostResult {
  postId: string;
  platform: Platform;
  status: "published" | "failed";
  error?: string;
  publishedAt: number;
}

export interface AnalyticsSnapshot {
  id: string;
  accountId: string;
  platform: Platform;
  followers: number;
  following?: number;
  posts?: number;
  avgLikes?: number;
  avgComments?: number;
  avgViews?: number;
  capturedAt: number;
}
