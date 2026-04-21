"use client";

import { Menu } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)] flex items-center justify-between px-4 z-30">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-[var(--color-foreground-muted)] hover:text-white hover:bg-[var(--color-surface-hover)] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-[var(--color-foreground-muted)] hover:text-white hover:bg-[var(--color-surface-hover)] transition-colors"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </div>
  );
}
