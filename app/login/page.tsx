"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.ok) {
      router.push("/");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
            <LogIn className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-xl font-bold text-white">{t("signIn")}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">{t("username")}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-white placeholder:text-[var(--color-foreground-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              placeholder={t("enterUsername")}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">{t("password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-white placeholder:text-[var(--color-foreground-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              placeholder={t("enterPassword")}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-background)] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
          >
            {loading ? `${t("signIn")}...` : t("signIn")}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--color-foreground-muted)]">
          {t("dontHaveAccount")}{" "}
          <a href="/register" className="text-[var(--color-primary)] hover:underline">{t("signUp")}</a>
        </p>
      </div>
    </div>
  );
}
