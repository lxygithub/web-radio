"use client";

import { Search, Loader2, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";
import StationList from "@/components/StationList";
import StationDetail from "@/components/StationDetail";
import { useLanguage } from "@/context/LanguageContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { searchStations } from "@/lib/radio-browser";
import type { Station } from "@/types/station";

export default function SearchPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailStation, setDetailStation] = useState<Station | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await searchStations(query.trim(), 50);
      setResults(data);
    } catch (e) {
      console.error("Search failed:", e);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleViewDetail = useCallback((station: Station) => {
    setDetailStation(station);
  }, []);

  useKeyboardShortcuts(results);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">{t("searchTitle")}</h1>
        <p className="text-[var(--color-foreground-muted)] mt-1">
          {t("searchSubtitle")}
        </p>
      </header>

      <form onSubmit={handleSearch} className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-foreground-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-10 pr-12 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-white placeholder:text-[var(--color-foreground-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-[var(--color-primary)] text-[var(--color-background)] hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-40"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        </div>
      )}

      {error && (
        <div className="mt-8 flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {searched && !loading && !error && (
        <section className="mt-8">
          <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <StationList stations={results} onViewDetail={handleViewDetail} />
        </section>
      )}

      <StationDetail station={detailStation} onClose={() => setDetailStation(null)} />
    </div>
  );
}
