import { Sidebar } from "@/components/layout/sidebar";
import { Instagram, Twitter } from "lucide-react";

const platforms = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "from-pink-500 to-orange-400" },
  { id: "tiktok", label: "TikTok", icon: () => <span className="text-sm font-bold">TK</span>, color: "from-gray-900 to-gray-700" },
  { id: "twitter", label: "Twitter / X", icon: Twitter, color: "from-sky-500 to-blue-600" },
];

export default function AccountsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Connected Accounts</h1>
          <p className="text-gray-400 text-sm mt-1">
            Connect your social media accounts. You'll login once — we save the session securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white`}>
                <p.icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold">{p.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Not connected</p>
              </div>
              <button className="mt-auto w-full py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors">
                Connect Account
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
