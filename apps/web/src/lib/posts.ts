import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

export type Platform = "instagram" | "tiktok" | "twitter";

export interface CreatePostInput {
  userId: string;
  platforms: Platform[];
  caption: string;
  mediaFile?: File;
  scheduledAt: Date;
  status: "draft" | "scheduled";
}

export async function uploadMedia(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `media/${userId}/${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function createPost(input: CreatePostInput): Promise<string> {
  let mediaUrls: string[] = [];

  if (input.mediaFile) {
    const url = await uploadMedia(input.mediaFile, input.userId);
    mediaUrls = [url];
  }

  const doc = await addDoc(collection(db, "posts"), {
    userId: input.userId,
    platforms: input.platforms,
    caption: input.caption,
    mediaUrls,
    status: input.status,
    scheduledAt: Timestamp.fromDate(input.scheduledAt).toMillis(),
    createdAt: Date.now(),
  });

  return doc.id;
}
