"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Radio } from "lucide-react";
import { getLocalFavorites, removeLocalFavorite } from "@/lib/local-storage";
import { useAudio } from "@/context/AudioContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface LocalFav {
  stationuuid: string;
  name: string;
  url: string;
  favicon: string;
  countrycode: string;
  tags: string;
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const { playStation } = useAudio();
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<LocalFav[]>([]);

  const loadFavorites = useCallback(() => {
    setFavorites(getLocalFavorites());
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRemove = (stationUuid: string) => {
    removeLocalFavorite(stationUuid);
    loadFavorites();
  };

  const handlePlay = (fav: LocalFav) => {
    playStation({
      name: fav.name,
      url: fav.url,
      favicon: fav.favicon,
      stationuuid: fav.stationuuid,
    });
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">{t("favoritesTitle")}</h1>
        <p className="text-[var(--color-foreground-muted)] mt-1">{t("favoritesSubtitle")}</p>
      </header>

      {favorites.length === 0 ? (
        <div className="p-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
          <Star className="w-10 h-10 text-[var(--color-foreground-muted)] mx-auto mb-3" />
          <p className="text-[var(--color-foreground-muted)] text-sm">{t("noFavorites")}</p>
          {!user && (
            <p className="mt-2 text-sm">
              <Link href="/login" className="text-[var(--color-primary)] hover:underline">{t("signIn")}</Link>{" "}
              {t("syncAcrossDevices")}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {favorites.map((fav) => (
            <div
              key={fav.stationuuid}
              className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 cursor-pointer transition-all group"
              onClick={() => handlePlay(fav)}
            >
              {fav.favicon ? (
                <img src={fav.favicon} alt={fav.name} className="w-10 h-10 rounded-lg object-cover bg-[var(--color-background)]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[var(--color-background)] flex items-center justify-center">
                  <Radio className="w-4 h-4 text-[var(--color-foreground-muted)]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-[var(--color-primary)] transition-colors">{fav.name}</h3>
                {fav.countrycode && <span className="text-xs text-[var(--color-foreground-muted)]">{fav.countrycode}</span>}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleRemove(fav.stationuuid); }}
                className="p-1 text-[var(--color-star)] hover:text-yellow-300 transition-colors"
              >
                <Star className="w-4 h-4" fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
