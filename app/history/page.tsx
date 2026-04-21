"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, Radio, Trash2 } from "lucide-react";
import { getLocalHistory, clearLocalHistory } from "@/lib/local-storage";
import { useAudio } from "@/context/AudioContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface LocalHist {
  stationuuid: string;
  name: string;
  url: string;
  favicon: string;
  playedAt: number;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const { playStation } = useAudio();
  const { t, locale } = useLanguage();
  const [history, setHistory] = useState<LocalHist[]>([]);

  const loadHistory = useCallback(() => {
    setHistory(getLocalHistory());
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handlePlay = (item: LocalHist) => {
    playStation({
      name: item.name,
      url: item.url,
      favicon: item.favicon,
      stationuuid: item.stationuuid,
    });
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}${t("minutesAgo")}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}${t("hoursAgo")}`;
    const days = Math.floor(hours / 24);
    return `${days}${t("daysAgo")}`;
  };

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("historyTitle")}</h1>
          <p className="text-[var(--color-foreground-muted)] mt-1">{t("historySubtitle")}</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => { clearLocalHistory(); loadHistory(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-foreground-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t("clear")}
          </button>
        )}
      </header>

      {history.length === 0 ? (
        <div className="p-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
          <Clock className="w-10 h-10 text-[var(--color-foreground-muted)] mx-auto mb-3" />
          <p className="text-[var(--color-foreground-muted)] text-sm">{t("noHistory")}</p>
          {!user && (
            <p className="mt-2 text-sm">
              <Link href="/login" className="text-[var(--color-primary)] hover:underline">{t("signIn")}</Link>{" "}
              {t("syncHistoryDevices")}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={`${item.stationuuid}-${item.playedAt}`}
              className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 cursor-pointer transition-all group"
              onClick={() => handlePlay(item)}
            >
              {item.favicon ? (
                <img src={item.favicon} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-[var(--color-background)]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[var(--color-background)] flex items-center justify-center">
                  <Radio className="w-4 h-4 text-[var(--color-foreground-muted)]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-[var(--color-primary)] transition-colors">{item.name}</h3>
                <span className="text-xs text-[var(--color-foreground-muted)]">{formatTime(item.playedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
