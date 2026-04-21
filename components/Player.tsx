"use client";

import { useAudio } from "@/context/AudioContext";
import { useLanguage } from "@/context/LanguageContext";
import AudioVisualizer from "./AudioVisualizer";
import { SleepTimerButton } from "./SleepTimer";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import { isLocalFavorite, addLocalFavorite, removeLocalFavorite } from "@/lib/local-storage";

export default function Player() {
  const { currentStation, isPlaying, volume, isMuted, signalStrength, togglePlay, setVolume, toggleMute } =
    useAudio();
  const { t } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (currentStation) {
      setIsFavorite(isLocalFavorite(currentStation.stationuuid));
    }
  }, [currentStation?.stationuuid]);

  if (!currentStation) {
    return (
      <div className="fixed bottom-0 left-0 right-0 lg:left-60 h-20 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center px-4 z-30">
        <p className="text-[var(--color-foreground-muted)] text-sm">
          {t("selectStation")}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-60 h-20 bg-[var(--color-surface)]/95 backdrop-blur-sm border-t border-[var(--color-border)] flex items-center px-4 z-30">
      {/* Station info */}
      <div className="flex items-center gap-3 w-48 lg:w-72">
        {currentStation.favicon && (
          <img
            src={currentStation.favicon}
            alt={currentStation.name}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg object-cover bg-[var(--color-background)]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="min-w-0">
          <p className="text-xs lg:text-sm font-semibold text-white truncate">
            {currentStation.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <SignalIndicator strength={signalStrength} />
            <span className="text-[10px] lg:text-xs text-[var(--color-foreground-muted)]">
              {isPlaying ? t("live") : t("paused")}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            if (isFavorite) {
              removeLocalFavorite(currentStation.stationuuid);
            } else {
              addLocalFavorite(currentStation as any);
            }
            setIsFavorite(!isFavorite);
          }}
          className={`ml-1 transition-colors ${
            isFavorite
              ? "text-[var(--color-star)]"
              : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]"
          }`}
        >
          <Star className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex-1 flex items-center justify-center gap-2 lg:gap-4">
        <button
          className="hidden sm:block p-2 text-[var(--color-foreground-muted)] hover:text-white transition-colors rounded-full hover:bg-[var(--color-surface-hover)]"
          title={t("previous")}
        >
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={togglePlay}
          className="p-2.5 lg:p-3 bg-[var(--color-primary)] text-[var(--color-background)] rounded-full hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg shadow-[var(--color-primary-glow)]"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
        <button
          className="hidden sm:block p-2 text-[var(--color-foreground-muted)] hover:text-white transition-colors rounded-full hover:bg-[var(--color-surface-hover)]"
          title={t("next")}
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Right side: Visualizer + Sleep timer + Volume */}
      <div className="flex items-center gap-1.5 lg:gap-2 w-36 lg:w-48 justify-end">
        {/* Mini visualizer */}
        <AudioVisualizer
          isPlaying={isPlaying}
          barCount={8}
          className="hidden md:block w-12 lg:w-16 h-6 lg:h-8 opacity-60"
        />

        {/* Sleep timer */}
        <SleepTimerButton />

        {/* Mute */}
        <button
          onClick={toggleMute}
          className="hidden sm:block p-1 text-[var(--color-foreground-muted)] hover:text-white transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-14 lg:w-20 h-1 accent-[var(--color-primary)]"
        />
      </div>
    </div>
  );
}

function SignalIndicator({ strength }: { strength: number }) {
  return (
    <div className="flex items-end gap-[2px] h-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-[3px] rounded-sm ${
            i <= strength ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
          } ${strength > 0 ? "signal-bar" : ""}`}
          style={{ height: `${3 + i * 2}px` }}
        />
      ))}
    </div>
  );
}
