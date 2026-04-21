import type { Station } from "@/types/station";

const API_BASE = "https://all.api.radio-browser.info/json";

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "User-Agent": "WebRadioApp/1.0" },
  });
  if (!res.ok) throw new Error(`Radio Browser API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getStationsByVotes(limit = 100, offset = 0): Promise<Station[]> {
  return fetchApi<Station[]>(`/stations?order=votes&reverse=true&limit=${limit}&offset=${offset}&hidebroken=true`);
}

export async function getStationsByClicks(limit = 100, offset = 0): Promise<Station[]> {
  return fetchApi<Station[]>(`/stations?order=clickcount&reverse=true&limit=${limit}&offset=${offset}&hidebroken=true`);
}

export async function searchStations(
  query: string,
  limit = 100,
  offset = 0
): Promise<Station[]> {
  return fetchApi<Station[]>(`/stations/search?name=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&hidebroken=true&order=votes&reverse=true`);
}

export async function getStationsByCountry(
  country: string,
  limit = 100,
  offset = 0
): Promise<Station[]> {
  return fetchApi<Station[]>(`/stations/bycountrycodeexact/${country}?limit=${limit}&offset=${offset}&hidebroken=true&order=votes&reverse=true`);
}

export async function getStationsByLanguage(
  language: string,
  limit = 100,
  offset = 0
): Promise<Station[]> {
  return fetchApi<Station[]>(`/stations/bylanguageexact/${language}?limit=${limit}&offset=${offset}&hidebroken=true&order=votes&reverse=true`);
}

export async function getStationsByTag(
  tag: string,
  limit = 100,
  offset = 0
): Promise<Station[]> {
  return fetchApi<Station[]>(`/stations/bytagexact/${tag}?limit=${limit}&offset=${offset}&hidebroken=true&order=votes&reverse=true`);
}

export async function getAllCountries() {
  return fetchApi<{ name: string; stationcount: number }[]>("/countries?order=stationcount&reverse=true");
}

export async function getAllLanguages() {
  return fetchApi<{ name: string; stationcount: number }[]>("/languages?order=stationcount&reverse=true");
}

export async function getAllTags() {
  return fetchApi<{ name: string; stationcount: number }[]>("/tags?limit=100&order=stationcount&reverse=true");
}
