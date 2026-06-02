import { Sidebar } from "@/components/layout/sidebar";
import { CalendarDays, TrendingUp, Send, Users } from "lucide-react";

const stats = [
  { label: "Scheduled Posts", value: "12", icon: CalendarDays, color: "text-blue-400" },
  { label: "Published This Week", value: "28", icon: Send, color: "text-green-400" },
  { label: "Total Followers", value: "14.2K", icon: Users, color: "text-purple-400" },
  { label: "Avg. Engagement", value: "4.8%", icon: TrendingUp, color: "text-orange-400" },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Overview of your social media performance</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {s.label}
                </span>
                <s.icon size={16} className={s.color} />
              </div>
              <p className="text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Placeholder for calendar / recent posts */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6 min-h-[320px] flex items-center justify-center">
            <p className="text-gray-600 text-sm">Content calendar coming soon</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold mb-4">Recent Posts</h2>
            <p className="text-gray-600 text-sm">No posts yet</p>
          </div>
        </div>
      </main>
    </div>
  );
}
