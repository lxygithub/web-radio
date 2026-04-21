"use client";

import { useAudio } from "@/context/AudioContext";
import { useLanguage } from "@/context/LanguageContext";
import { X, Play, Globe, Radio, Tag, Activity, Wifi, Music2 } from "lucide-react";
import { useEffect, useCallback } from "react";
import type { Station } from "@/types/station";

interface StationDetailProps {
  station: Station | null;
  onClose: () => void;
}

export default function StationDetail({ station, onClose }: StationDetailProps) {
  const { playStation, currentStation } = useAudio();
  const { t } = useLanguage();
  const isPlaying = currentStation?.stationuuid === station?.stationuuid;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (station) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [station]);

  if (!station) return null;

  const tags = station.tags
    ? station.tags.split(",").filter(Boolean).map((t) => t.trim())
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl shadow-[var(--color-primary-glow)]/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[var(--color-background)] flex items-center justify-center overflow-hidden flex-shrink-0">
              {station.favicon ? (
                <img
                  src={station.favicon}
                  alt={station.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <Radio className="w-6 h-6 text-[var(--color-foreground-muted)]" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white truncate">{station.name}</h2>
              {station.countrycode && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  {station.countrycode}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-foreground-muted)] hover:text-white hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {station.language && (
              <InfoItem icon={Globe} label={t("language")} value={station.language} />
            )}
            {station.bitrate > 0 && (
              <InfoItem icon={Activity} label={t("bitrate")} value={`${station.bitrate} kbps`} />
            )}
            {station.codec && station.codec !== "unknown" && (
              <InfoItem icon={Wifi} label={t("codec")} value={station.codec} />
            )}
            {station.country && (
              <InfoItem icon={Globe} label={t("country")} value={station.country} />
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-sm text-[var(--color-foreground-muted)] mb-2">
                <Tag className="w-3.5 h-3.5" />
                <span>{t("tags")}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-background)] text-[var(--color-foreground-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Website */}
          {station.homepage && (
            <div className="flex items-center gap-1.5 text-sm">
              <Globe className="w-3.5 h-3.5 text-[var(--color-foreground-muted)]" />
              <a
                href={station.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline truncate"
              >
                {station.homepage.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}

          {/* Votes */}
          <div className="flex items-center gap-1.5 text-sm text-[var(--color-foreground-muted)]">
            <Music2 className="w-3.5 h-3.5" />
            <span>{station.votes} {t("votes")} · {station.clickcount} {t("clicks")}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--color-border)]">
          <button
            onClick={() => {
              playStation({
                name: station.name,
                url: station.url_resolved || station.url,
                favicon: station.favicon,
                stationuuid: station.stationuuid,
              });
              onClose();
            }}
            disabled={isPlaying}
            className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-background)] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            {isPlaying ? t("live") : t("playNow")}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--color-background)]">
      <Icon className="w-3.5 h-3.5 text-[var(--color-foreground-muted)] flex-shrink-0" />
      <div className="min-w-0">
        <div className="text-[10px] text-[var(--color-foreground-muted)] uppercase tracking-wide">{label}</div>
        <div className="text-sm text-white truncate">{value}</div>
      </div>
    </div>
  );
}
