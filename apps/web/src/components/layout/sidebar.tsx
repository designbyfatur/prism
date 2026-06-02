"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Users,
  Settings,
  Zap,
} from "lucide-react";
import { clsx } from "clsx";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/posts", label: "Posts", icon: CalendarDays },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/accounts", label: "Accounts", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[var(--sidebar-width)] bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-prism-500 flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight">Prism</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-prism-500/15 text-prism-400"
                  : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">PRISM v0.1.0</p>
      </div>
    </aside>
  );
}
