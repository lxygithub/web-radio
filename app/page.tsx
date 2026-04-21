"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import StationList from "@/components/StationList";
import StationDetail from "@/components/StationDetail";
import CategoryNav from "@/components/CategoryNav";
import { useLanguage } from "@/context/LanguageContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { getStationsByVotes, getStationsByClicks } from "@/lib/radio-browser";
import type { Station } from "@/types/station";

export default function Home() {
  const { t } = useLanguage();
  const [stations, setStations] = useState<Station[]>([]);
  const [trending, setTrending] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [error, setError] = useState("");
  const [detailStation, setDetailStation] = useState<Station | null>(null);

  const fetchPopular = useCallback(() => {
    setLoading(true);
    setError("");
    getStationsByVotes(100)
      .then((data) => setStations(data))
      .catch((e) => {
        console.error("Failed to fetch stations:", e);
        setError("Failed to load stations. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPopular();
  }, [fetchPopular]);

  useEffect(() => {
    getStationsByClicks(20)
      .then((data) => setTrending(data))
      .catch((e) => console.error("Failed to fetch trending:", e))
      .finally(() => setLoadingTrending(false));
  }, []);

  const handleViewDetail = useCallback((station: Station) => {
    setDetailStation(station);
  }, []);

  useKeyboardShortcuts(stations);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">{t("discover")}</h1>
        <p className="text-[var(--color-foreground-muted)] mt-1">
          {t("discoverSubtitle")}
        </p>
        <p className="text-xs text-[var(--color-foreground-muted)] mt-1 opacity-60">
          {t("shortcutsHint")}
        </p>
      </header>

      <CategoryNav />

      {/* Popular Stations */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">{t("popularStations")}</h2>
          {error && (
            <button
              onClick={fetchPopular}
              className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <StationList stations={stations} onViewDetail={handleViewDetail} />
        )}
      </section>

      {/* Trending Stations */}
      {trending.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-white mb-4">Trending Now</h2>
          {loadingTrending ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[var(--color-primary)] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {trending.map((station) => (
                <TrendingCard
                  key={station.stationuuid}
                  station={station}
                  onClick={() => handleViewDetail(station)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <StationDetail station={detailStation} onClose={() => setDetailStation(null)} />
    </div>
  );
}

function TrendingCard({ station, onClick }: { station: Station; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-all text-left"
    >
      <div className="w-10 h-10 rounded-md bg-[var(--color-background)] flex items-center justify-center overflow-hidden mb-2">
        {station.favicon ? (
          <img src={station.favicon} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : null}
      </div>
      <p className="text-xs font-medium text-white truncate group-hover:text-[var(--color-primary)] transition-colors">{station.name}</p>
      <p className="text-[10px] text-[var(--color-foreground-muted)] mt-0.5">{station.votes} votes</p>
    </button>
  );
}
