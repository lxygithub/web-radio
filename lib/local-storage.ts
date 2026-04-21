// Client-side favorites and history management (localStorage fallback for dev)
import type { Station } from "@/types/station";

interface LocalFavorite {
  stationuuid: string;
  name: string;
  url: string;
  favicon: string;
  countrycode: string;
  tags: string;
}

interface LocalHistory {
  stationuuid: string;
  name: string;
  url: string;
  favicon: string;
  playedAt: number;
}

const FAVORITES_KEY = "web_radio_favorites";
const HISTORY_KEY = "web_radio_history";

export function getLocalFavorites(): LocalFavorite[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addLocalFavorite(station: Station) {
  const favorites = getLocalFavorites();
  if (!favorites.find((f) => f.stationuuid === station.stationuuid)) {
    favorites.push({
      stationuuid: station.stationuuid,
      name: station.name,
      url: station.url_resolved || station.url,
      favicon: station.favicon,
      countrycode: station.countrycode,
      tags: station.tags,
    });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  return favorites;
}

export function removeLocalFavorite(stationUuid: string) {
  const favorites = getLocalFavorites().filter(
    (f) => f.stationuuid !== stationUuid
  );
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
}

export function isLocalFavorite(stationUuid: string): boolean {
  return getLocalFavorites().some((f) => f.stationuuid === stationUuid);
}

export function addLocalHistory(station: Station) {
  const history = getLocalHistory();
  history.unshift({
    stationuuid: station.stationuuid,
    name: station.name,
    url: station.url_resolved || station.url,
    favicon: station.favicon,
    playedAt: Date.now(),
  });
  const trimmed = history.slice(0, 100); // Keep last 100
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export function getLocalHistory(): LocalHistory[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearLocalHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
}
