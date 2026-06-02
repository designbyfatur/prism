"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { KanbanView } from "@/components/posts/kanban-view";
import { CreatePostModal } from "@/components/posts/create-post-modal";
import { Plus, CalendarDays, Columns3, List } from "lucide-react";
import { clsx } from "clsx";

const CalendarView = dynamic(
  () => import("@/components/posts/calendar-view").then((m) => m.CalendarView),
  { ssr: false, loading: () => <div className="bg-gray-900 border border-gray-800 rounded-xl min-h-[500px] animate-pulse" /> }
);

type View = "calendar" | "kanban" | "list";

const VIEWS: { id: View; label: string; icon: React.ComponentType<any> }[] = [
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "kanban", label: "Kanban", icon: Columns3 },
  { id: "list", label: "List", icon: List },
];

export default function PostsPage() {
  const [view, setView] = useState<View>("calendar");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Posts</h1>
            <p className="text-gray-400 text-sm mt-1">Schedule and manage your content</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-prism-500 hover:bg-prism-600 text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Post
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 w-fit mb-6">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                view === id
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Views */}
        {view === "calendar" && <CalendarView />}
        {view === "kanban" && <KanbanView />}
        {view === "list" && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl min-h-[400px] flex items-center justify-center">
            <p className="text-gray-600 text-sm">List view coming soon</p>
          </div>
        )}
      </main>

      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onCreated={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
