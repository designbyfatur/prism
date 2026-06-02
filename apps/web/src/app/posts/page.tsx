import { Sidebar } from "@/components/layout/sidebar";
import { Plus } from "lucide-react";

export default function PostsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Posts</h1>
            <p className="text-gray-400 text-sm mt-1">Schedule and manage your content</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-prism-500 hover:bg-prism-600 text-sm font-medium transition-colors">
            <Plus size={16} />
            New Post
          </button>
        </div>

        {/* Empty state */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl min-h-[400px] flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
            <Plus size={20} className="text-gray-500" />
          </div>
          <p className="text-gray-400 font-medium">No posts yet</p>
          <p className="text-gray-600 text-sm">Create your first scheduled post</p>
          <button className="mt-2 px-4 py-2 rounded-lg bg-prism-500 hover:bg-prism-600 text-sm font-medium transition-colors">
            Create Post
          </button>
        </div>
      </main>
    </div>
  );
}
