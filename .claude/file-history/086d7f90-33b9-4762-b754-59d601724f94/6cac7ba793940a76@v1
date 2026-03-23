import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/", icon: "📊" },
  { label: "Activities", href: "/activities", icon: "🚴" },
  { label: "Routes", href: "/routes", icon: "🗺️" },
  { label: "Stats", href: "/stats", icon: "📈" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-gray-800">
        <h1 className="text-lg font-bold tracking-tight text-white">
          🚴 CycleDash
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Personal Cycling Data</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gray-800 text-xs text-gray-500">
        v0.1.0
      </div>
    </aside>
  );
}
