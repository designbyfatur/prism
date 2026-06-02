"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Instagram, Twitter, CheckCircle2, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { clsx } from "clsx";

type Platform = "instagram" | "tiktok" | "twitter";
type Status = "idle" | "waiting" | "success" | "error";

interface AccountState {
  status: Status;
  error?: string;
}

const PLATFORMS: {
  id: Platform;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
}[] = [
  {
    id: "instagram",
    label: "Instagram",
    description: "Post photos, videos, reels, and stories",
    icon: Instagram,
    gradient: "from-pink-500 to-orange-400",
  },
  {
    id: "tiktok",
    label: "TikTok",
    description: "Upload short-form videos",
    icon: () => <span className="text-sm font-bold tracking-tight">TK</span>,
    gradient: "from-gray-800 to-gray-600",
  },
  {
    id: "twitter",
    label: "Twitter / X",
    description: "Post tweets and threads with media",
    icon: Twitter,
    gradient: "from-sky-500 to-blue-600",
  },
];

const DEMO_USER_ID = "demo-user-001";

export default function AccountsPage() {
  const [states, setStates] = useState<Record<Platform, AccountState>>({
    instagram: { status: "idle" },
    tiktok: { status: "idle" },
    twitter: { status: "idle" },
  });

  const connect = async (platform: Platform) => {
    setStates((prev) => ({ ...prev, [platform]: { status: "waiting" } }));

    try {
      const res = await fetch("/api/accounts/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, userId: DEMO_USER_ID }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to connect");

      setStates((prev) => ({ ...prev, [platform]: { status: "success" } }));
    } catch (err) {
      setStates((prev) => ({
        ...prev,
        [platform]: { status: "error", error: String(err) },
      }));
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Connected Accounts</h1>
          <p className="text-gray-400 text-sm mt-1">
            Connect your accounts — you&apos;ll login once in a browser window. Session is saved securely.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-prism-500/10 border border-prism-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <ExternalLink size={16} className="text-prism-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-prism-300 font-medium">How it works</p>
            <p className="text-xs text-gray-400 mt-0.5">
              When you click Connect, a browser window will open on your screen. Login normally — we capture the session and encrypt it. You won&apos;t need to login again.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLATFORMS.map((p) => {
            const state = states[p.id];
            const isWaiting = state.status === "waiting";
            const isSuccess = state.status === "success";
            const isError = state.status === "error";

            return (
              <div
                key={p.id}
                className={clsx(
                  "bg-gray-900 border rounded-xl p-6 flex flex-col gap-4 transition-colors",
                  isSuccess ? "border-green-500/30" : "border-gray-800"
                )}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white`}>
                  <p.icon size={20} />
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{p.label}</h3>
                    {isSuccess && <CheckCircle2 size={14} className="text-green-400" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>
                </div>

                {/* Status */}
                {isWaiting && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-medium">
                      <Loader2 size={13} className="animate-spin" />
                      Browser opening...
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Login in the browser window, then come back here.</p>
                  </div>
                )}

                {isError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-400 text-xs font-medium">
                      <AlertCircle size={13} />
                      Connection failed
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{state.error}</p>
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={() => connect(p.id)}
                  disabled={isWaiting || isSuccess}
                  className={clsx(
                    "mt-auto w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors",
                    isSuccess
                      ? "bg-green-500/15 text-green-400 cursor-default"
                      : isWaiting
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  )}
                >
                  {isSuccess ? "Connected" : isWaiting ? "Waiting for login..." : isError ? "Retry" : "Connect Account"}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
