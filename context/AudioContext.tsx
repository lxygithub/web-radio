"use client";

import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from "react";
import { addLocalHistory } from "@/lib/local-storage";

interface AudioState {
  currentStation: {
    name: string;
    url: string;
    favicon: string;
    stationuuid: string;
  } | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  signalStrength: number; // 0-4
}

interface AudioContextType extends AudioState {
  playStation: (station: { name: string; url: string; favicon: string; stationuuid: string }) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    currentStation: null,
    isPlaying: false,
    volume: 0.8,
    isMuted: false,
    signalStrength: 0,
  });

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.8;
    audioRef.current.preload = "none";

    const audio = audioRef.current;

    const handlePlaying = () => {
      setState((prev) => ({ ...prev, isPlaying: true, signalStrength: 4 }));
    };
    const handlePause = () => {
      setState((prev) => ({ ...prev, isPlaying: false, signalStrength: 0 }));
    };
    const handleWaiting = () => {
      setState((prev) => ({ ...prev, signalStrength: 2 }));
    };
    const handleError = () => {
      setState((prev) => ({ ...prev, isPlaying: false, signalStrength: 0 }));
    };

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const playStation = useCallback(
    (station: { name: string; url: string; favicon: string; stationuuid: string }) => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.src = station.url;
      audio.play().catch(() => {});
      setState((prev) => ({
        ...prev,
        currentStation: station,
        isPlaying: true,
        signalStrength: 3,
      }));

      // Record to play history
      addLocalHistory({
        stationuuid: station.stationuuid,
        name: station.name,
        url: station.url,
        favicon: station.favicon,
      });
    },
    []
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    setState((prev) => ({ ...prev, volume, isMuted: volume === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  return (
    <AudioContext.Provider
      value={{ ...state, playStation, togglePlay, setVolume, toggleMute }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
