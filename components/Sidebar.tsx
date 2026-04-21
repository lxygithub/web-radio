"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Star,
  Clock,
  Radio,
  User,
  LogOut,
  LogIn,
  Languages,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { locale, t, toggleLocale } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { href: "/", label: t("discover"), icon: Home },
    { href: "/search", label: t("search"), icon: Search },
    { href: "/favorites", label: t("favorites"), icon: Star },
    { href: "/history", label: t("history"), icon: Clock },
  ];

  const handleNav = () => {
    if (onClose) onClose();
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 bottom-20 w-60 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col z-20
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Close button (mobile only) */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg text-[var(--color-foreground-muted)] hover:text-white hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Logo */}
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/" onClick={handleNav} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-primary-glow)] group-hover:shadow-xl group-hover:shadow-[var(--color-primary-glow)] transition-shadow">
            <Radio className="w-5 h-5 text-[var(--color-background)]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            {t("webRadio")}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleNav}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Controls: Language + Theme */}
      <div className="px-3 pb-2 space-y-1">
        <button
          onClick={toggleLocale}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          <Languages className="w-4 h-4" />
          <span>{locale === "en" ? "English" : "中文"}</span>
          <span className="ml-auto text-xs opacity-50">
            {locale === "en" ? "→ 中文" : "→ EN"}
          </span>
        </button>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{isDark ? "浅色模式" : "Dark Mode"}</span>
        </button>
      </div>

      {/* User section */}
      <div className="p-3 border-t border-[var(--color-border)]">
        {user ? (
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              </div>
              <span className="text-sm font-medium text-white">{user.username}</span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-[var(--color-foreground-muted)] hover:text-white hover:bg-[var(--color-surface-hover)] transition-colors"
              title={t("signOut")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={handleNav}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors text-sm font-medium"
          >
            <LogIn className="w-4 h-4" />
            {t("signIn")}
          </Link>
        )}
      </div>
    </aside>
  );
}
