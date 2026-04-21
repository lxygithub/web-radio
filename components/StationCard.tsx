"use client";

import { useAudio } from "@/context/AudioContext";
import { useLanguage } from "@/context/LanguageContext";
import { Play, Globe, Star, Info } from "lucide-react";
import { useState, useCallback } from "react";
import { isLocalFavorite, addLocalFavorite, removeLocalFavorite } from "@/lib/local-storage";
import type { Station } from "@/types/station";

export default function StationCard({ station, onViewDetail }: { station: Station; onViewDetail?: (station: Station) => void }) {
  const { playStation, currentStation } = useAudio();
  const { t } = useLanguage();
  const [favOverride, setFavOverride] = useState(() => isLocalFavorite(station.stationuuid));
  const isCurrentlyPlaying = currentStation?.stationuuid === station.stationuuid;

  const handlePlay = () => {
    playStation({
      name: station.name,
      url: station.url_resolved || station.url,
      favicon: station.favicon,
      stationuuid: station.stationuuid,
    });
  };

  const toggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (favOverride) {
      removeLocalFavorite(station.stationuuid);
    } else {
      addLocalFavorite(station);
    }
    setFavOverride(prev => !prev);
  }, [favOverride, station]);

  return (
    <div
      className={`group p-4 rounded-lg bg-[var(--color-surface)] border transition-all cursor-pointer ${
        isCurrentlyPlaying
          ? "border-[var(--color-primary)]/60 shadow-lg shadow-[var(--color-primary-glow)]"
          : "border-[var(--color-border)] hover:border-[var(--color-primary)]/30"
      }`}
      onClick={handlePlay}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-[var(--color-background)] flex items-center justify-center overflow-hidden flex-shrink-0">
          {station.favicon ? (
            <img src={station.favicon} alt={station.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <Globe className="w-5 h-5 text-[var(--color-foreground-muted)]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-[var(--color-primary)] transition-colors">{station.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {station.countrycode && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">{station.countrycode}</span>
            )}
            {station.language && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-surface-hover)] text-[var(--color-foreground-muted)]">{station.language}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {onViewDetail && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(station);
              }}
              className={`p-1 transition-colors text-[var(--color-foreground-muted)] opacity-0 group-hover:opacity-100 hover:text-white`}
            >
              <Info className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={toggleFavorite}
            className={`p-1 transition-colors ${favOverride ? "text-[var(--color-star)]" : "text-[var(--color-foreground-muted)] opacity-0 group-hover:opacity-100"}`}
          >
            <Star className="w-4 h-4" fill={favOverride ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {station.tags && (
        <div className="flex flex-wrap gap-1 mb-3">
          {station.tags.split(",").slice(0, 3).filter(Boolean).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-background)] text-[var(--color-foreground-muted)]">{tag.trim()}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--color-foreground-muted)]">
          {station.bitrate > 0 ? `${station.bitrate}kbps` : ""}
          {station.codec && station.codec !== "unknown" && ` · ${station.codec}`}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-[var(--color-foreground-muted)]">{station.votes} {t("votes")}</span>
          <Play className={`w-4 h-4 transition-colors ${isCurrentlyPlaying ? "text-[var(--color-primary)]" : "text-[var(--color-foreground-muted)] group-hover:text-[var(--color-primary)]"}`} />
        </div>
      </div>
    </div>
  );
}
