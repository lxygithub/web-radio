"use client";

import { useAudio } from "@/context/AudioContext";
import { Clock, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

type SleepDuration = 15 | 30 | 45 | 60;

export function SleepTimerButton() {
  const { togglePlay } = useAudio();
  const [showMenu, setShowMenu] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [endAt, setEndAt] = useState<number | null>(null);

  const startTimer = useCallback(
    (minutes: SleepDuration) => {
      const target = Date.now() + minutes * 60 * 1000;
      setEndAt(target);
      setRemaining(minutes * 60);
      setShowMenu(false);
    },
    []
  );

  const cancelTimer = useCallback(() => {
    setEndAt(null);
    setRemaining(null);
    setShowMenu(false);
  }, []);

  // Countdown
  useEffect(() => {
    if (endAt === null) return;

    const tick = () => {
      const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      if (left <= 0) {
        togglePlay();
        cancelTimer();
        return;
      }
      setRemaining(left);
    };

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endAt, cancelTimer, togglePlay]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const durations: { label: string; value: SleepDuration }[] = [
    { label: "15 分钟", value: 15 },
    { label: "30 分钟", value: 30 },
    { label: "45 分钟", value: 45 },
    { label: "60 分钟", value: 60 },
  ];

  return (
    <div className="relative">
      {remaining !== null ? (
        <button
          onClick={cancelTimer}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-colors"
          title="Cancel sleep timer"
        >
          <Clock className="w-3 h-3" />
          <span>{formatTime(remaining)}</span>
          <X className="w-3 h-3 opacity-50" />
        </button>
      ) : (
        <>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-[var(--color-foreground-muted)] hover:text-white transition-colors rounded-full hover:bg-[var(--color-surface-hover)]"
            title="Sleep timer"
          >
            <Clock className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute bottom-full right-0 mb-2 p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl z-50 min-w-36">
                <p className="text-xs text-[var(--color-foreground-muted)] px-2 py-1 font-medium">
                  自动关闭
                </p>
                {durations.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => startTimer(d.value)}
                    className="w-full text-left px-3 py-1.5 text-sm text-white hover:bg-[var(--color-surface-hover)] rounded-md transition-colors"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
