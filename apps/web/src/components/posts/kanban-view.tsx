"use client";

import { Instagram, Twitter, Clock, CheckCircle2, FileEdit, XCircle } from "lucide-react";
import { clsx } from "clsx";

type PostStatus = "draft" | "scheduled" | "published" | "failed";

interface KanbanPost {
  id: string;
  caption: string;
  platform: "instagram" | "tiktok" | "twitter";
  scheduledAt: string;
  status: PostStatus;
}

const DUMMY_POSTS: KanbanPost[] = [
  { id: "1", caption: "Exciting news coming soon! Stay tuned for our big announcement 🎉", platform: "instagram", scheduledAt: "Jun 5, 10:00 AM", status: "scheduled" },
  { id: "2", caption: "Weekly productivity tip: Start your day by writing down 3 priorities...", platform: "twitter", scheduledAt: "Jun 7, 09:00 AM", status: "scheduled" },
  { id: "3", caption: "Behind the scenes of our creative process 🎬", platform: "tiktok", scheduledAt: "Jun 3, 06:00 PM", status: "published" },
  { id: "4", caption: "Draft post for product review campaign", platform: "instagram", scheduledAt: "—", status: "draft" },
  { id: "5", caption: "Thread: 10 things we learned building in public...", platform: "twitter", scheduledAt: "Jun 1, 11:00 AM", status: "failed" },
];

const COLUMNS: { id: PostStatus; label: string; icon: React.ComponentType<any>; color: string }[] = [
  { id: "draft", label: "Draft", icon: FileEdit, color: "text-gray-400" },
  { id: "scheduled", label: "Scheduled", icon: Clock, color: "text-blue-400" },
  { id: "published", label: "Published", icon: CheckCircle2, color: "text-green-400" },
  { id: "failed", label: "Failed", icon: XCircle, color: "text-red-400" },
];

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-pink-500/15 text-pink-400",
  tiktok: "bg-gray-700 text-gray-300",
  twitter: "bg-sky-500/15 text-sky-400",
};

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "Twitter",
};

function PostCard({ post }: { post: KanbanPost }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3.5 cursor-grab hover:border-gray-600 transition-colors">
      <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", PLATFORM_COLORS[post.platform])}>
        {PLATFORM_LABEL[post.platform]}
      </span>
      <p className="text-sm text-gray-200 mt-2.5 leading-snug line-clamp-2">{post.caption}</p>
      {post.scheduledAt !== "—" && (
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <Clock size={11} />
          {post.scheduledAt}
        </p>
      )}
    </div>
  );
}

export function KanbanView() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const posts = DUMMY_POSTS.filter((p) => p.status === col.id);
        return (
          <div key={col.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <col.icon size={15} className={col.color} />
              <span className="text-sm font-medium text-gray-300">{col.label}</span>
              <span className="ml-auto text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                {posts.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {posts.length === 0 && (
                <p className="text-xs text-gray-700 text-center py-6">No posts</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
