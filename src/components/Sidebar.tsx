"use client";

import Link from "next/link";
import AICoachPanel from "@/components/AICoachPanel";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { label: "Dashboard", href: "/", icon: "📊" },
  { label: "Leaderboard", href: "/leaderboard", icon: "🏆" },
  { label: "Activities", href: "/activities", icon: "🚴" },
  { label: "Routes", href: "/routes", icon: "🗺️" },
  { label: "Stats", href: "/stats", icon: "📈" },
];

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-56 flex flex-col shrink-0 transition-colors duration-200">
      <div className="px-6 py-5 border-b transition-colors duration-200">
        <h1 className="text-lg font-bold tracking-tight">
          🚴 CycleDash
        </h1>
        <p className="text-xs mt-0.5">Personal Cycling Data</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <AICoachPanel />
      <div className="px-6 py-4 border-t text-xs">v0.1.0</div>
      <button
        onClick={toggleTheme}
        className="mx-3 mb-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </aside>
  );
}
