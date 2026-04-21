"use client";

import { Grid, List } from "lucide-react";
import { useState } from "react";
import StationCard from "./StationCard";
import { useLanguage } from "@/context/LanguageContext";
import type { Station } from "@/types/station";

export default function StationList({ stations, onViewDetail }: { stations: Station[]; onViewDetail?: (station: Station) => void }) {
  const { t } = useLanguage();
  const [view, setView] = useState<"grid" | "list">("grid");

  if (stations.length === 0) {
    return (
      <div className="p-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
        <p className="text-[var(--color-foreground-muted)]">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <div>
      {/* View toggle */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <button
          onClick={() => setView("grid")}
          className={`p-1.5 rounded transition-colors ${
            view === "grid"
              ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
              : "text-[var(--color-foreground-muted)] hover:text-white"
          }`}
          title="Grid view"
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setView("list")}
          className={`p-1.5 rounded transition-colors ${
            view === "list"
              ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
              : "text-[var(--color-foreground-muted)] hover:text-white"
          }`}
          title="List view"
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stations.map((station) => (
            <StationCard key={station.stationuuid} station={station} onViewDetail={onViewDetail} />
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="space-y-2">
          {stations.map((station) => (
            <StationCard key={station.stationuuid} station={station} onViewDetail={onViewDetail} />
          ))}
        </div>
      )}
    </div>
  );
}
