import { Sidebar } from "@/components/layout/sidebar";
import { TrendingUp, Users, Heart, Eye } from "lucide-react";

const metrics = [
  { label: "Total Followers", value: "—", icon: Users },
  { label: "Total Likes", value: "—", icon: Heart },
  { label: "Total Views", value: "—", icon: Eye },
  { label: "Avg. Engagement", value: "—", icon: TrendingUp },
];

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">
            Data scraped directly from your accounts — no API keys needed.
          </p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 uppercase tracking-wide">{m.label}</span>
                <m.icon size={15} className="text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-500">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Connect accounts to start tracking analytics</p>
            <a href="/accounts" className="text-prism-400 text-sm mt-2 inline-block hover:underline">
              Connect accounts →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
