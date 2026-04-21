"use client";

import { Radio, Globe, Music, Mic2, AlertCircle, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import StationList from "./StationList";
import { useLanguage } from "@/context/LanguageContext";
import { getStationsByVotes, getStationsByTag } from "@/lib/radio-browser";
import type { Station } from "@/types/station";

const PAGE_SIZE = 100;

export default function CategoryNav() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const categories = [
    { name: t("allStations"), icon: Radio, tag: "" },
    { name: t("musicStations"), icon: Music, tag: "music" },
    { name: t("englishLearning"), icon: Globe, tag: "english" },
    { name: t("newsTalk"), icon: Mic2, tag: "news" },
  ];

  const fetchPage = useCallback(async (tag: string, offset: number): Promise<Station[]> => {
    if (!tag) {
      return await getStationsByVotes(PAGE_SIZE, offset);
    }
    return await getStationsByTag(tag, PAGE_SIZE, offset);
  }, []);

  const handleCategoryClick = useCallback(async (tag: string) => {
    setActiveCategory(tag);
    setLoading(true);
    setError("");
    setHasMore(false);
    try {
      const data = await fetchPage(tag, 0);
      setStations(data);
      setHasMore(data.length >= PAGE_SIZE);
    } catch (e) {
      console.error("Failed to fetch stations:", e);
      setError("Failed to load stations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const offset = stations.length;
      const data = await fetchPage(activeCategory, offset);
      if (data.length > 0) {
        setStations((prev) => [...prev, ...data]);
        setHasMore(data.length >= PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error("Failed to load more stations:", e);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, activeCategory, fetchPage, stations.length]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.tag;
          return (
            <button
              key={cat.tag}
              onClick={() => handleCategoryClick(cat.tag)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--color-primary)] text-[var(--color-background)] shadow-lg shadow-[var(--color-primary-glow)]"
                  : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="mt-8 p-12 text-center">
          <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin mx-auto" />
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {stations.length > 0 && (
        <section className="mt-6">
          <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
            {stations.length} {t("stations")}
          </p>
          <StationList stations={stations} />
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("loading")}
                  </span>
                ) : (
                  t("loadMore")
                )}
              </button>
            </div>
          )}
        </section>
      )}

      {!loading && !error && activeCategory !== "" && stations.length === 0 && (
        <div className="mt-8 p-12 text-center text-[var(--color-foreground-muted)]">
          {t("noResults")}
        </div>
      )}
    </div>
  );
}
