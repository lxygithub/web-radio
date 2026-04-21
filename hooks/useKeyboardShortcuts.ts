"use client";

import { useAudio } from "@/context/AudioContext";
import { useEffect, useRef } from "react";
import type { Station } from "@/types/station";

/**
 * Global keyboard shortcuts:
 * - Space: toggle play/pause
 * - ArrowRight: play next station in list
 * - ArrowLeft: play previous station in list
 * - ArrowUp: increase volume
 * - ArrowDown: decrease volume
 * - M: toggle mute
 */
export function useKeyboardShortcuts(stations: Station[]) {
  const { togglePlay, setVolume, toggleMute, currentStation, playStation, volume } = useAudio();
  const stationsRef = useRef(stations);
  stationsRef.current = stations;
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight": {
          e.preventDefault();
          const list = stationsRef.current;
          if (list.length === 0 || !currentStation) return;
          const idx = list.findIndex((s) => s.stationuuid === currentStation.stationuuid);
          const next = list[(idx + 1) % list.length];
          if (next) {
            playStation({
              name: next.name,
              url: next.url_resolved || next.url,
              favicon: next.favicon,
              stationuuid: next.stationuuid,
            });
          }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          const list = stationsRef.current;
          if (list.length === 0 || !currentStation) return;
          const idx = list.findIndex((s) => s.stationuuid === currentStation.stationuuid);
          const prev = list[(idx - 1 + list.length) % list.length];
          if (prev) {
            playStation({
              name: prev.name,
              url: prev.url_resolved || prev.url,
              favicon: prev.favicon,
              stationuuid: prev.stationuuid,
            });
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setVolume(Math.min(1, volumeRef.current + 0.05));
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          setVolume(Math.max(0, volumeRef.current - 0.05));
          break;
        }
        case "m":
        case "M": {
          e.preventDefault();
          toggleMute();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, toggleMute, currentStation, playStation, setVolume]);
}
