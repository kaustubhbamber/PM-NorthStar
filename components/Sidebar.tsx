"use client";

import { Home, Library, BookMarked, Star, FlameIcon } from "lucide-react";

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  savedCount?: number;
  favouriteCount?: number;
}

const navItems = [
  { id: "home",    label: "Home",    icon: Home    },
  { id: "library", label: "Library", icon: Library },
];

export function Sidebar({ activeNav, onNavChange, savedCount = 0, favouriteCount = 0 }: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full w-56 flex-shrink-0 py-6 px-3"
      style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      {/* Logo */}
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--brand-primary), #8B0000)" }}
          >
            <Star size={16} className="text-white fill-white" />
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="font-display text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>North</span>
            <span className="font-display text-lg font-bold tracking-tight" style={{ color: "var(--brand-primary)" }}>Star</span>
          </div>
        </div>
        <p className="text-xs mt-1 px-0.5" style={{ color: "var(--text-muted)" }}>PM Resource Hub</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto scroll-container">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: "var(--text-faint)" }}>
          Navigate
        </p>

        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavChange(id)}
            className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${activeNav === id ? "active" : ""}`}
            style={{ color: activeNav === id ? "var(--brand-primary)" : "var(--text-muted)" }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}

        {/* Case Studies */}
        <button
          onClick={() => onNavChange("casestudies")}
          className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${activeNav === "casestudies" ? "active" : ""}`}
          style={{ color: activeNav === "casestudies" ? "var(--brand-primary)" : "var(--text-muted)" }}
        >
          <FlameIcon size={16} />
          Case Studies
          <span
            className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold"
            style={{ background: "var(--brand-soft)", color: "var(--brand-primary)" }}
          >
            50
          </span>
        </button>

        {/* Library */}
        <div className="pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: "var(--text-faint)" }}>
            Library
          </p>

          <button
            onClick={() => onNavChange("saved")}
            className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${activeNav === "saved" ? "active" : ""}`}
            style={{ color: activeNav === "saved" ? "var(--brand-primary)" : "var(--text-muted)" }}
          >
            <BookMarked size={16} />
            Saved for Later
            {savedCount > 0 && (
              <span
                className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: "var(--brand-soft)", color: "var(--brand-primary)" }}
              >
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavChange("favourites")}
            className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${activeNav === "favourites" ? "active" : ""}`}
            style={{ color: activeNav === "favourites" ? "var(--brand-primary)" : "var(--text-muted)" }}
          >
            <Star size={16} />
            Favourites
            {favouriteCount > 0 && (
              <span
                className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: "var(--brand-soft)", color: "var(--brand-primary)" }}
              >
                {favouriteCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
}
