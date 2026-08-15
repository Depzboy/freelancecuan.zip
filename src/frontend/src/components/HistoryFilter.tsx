import { cn } from "@/lib/utils";
import { ActivityType } from "@/types";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Briefcase, ClipboardList, History, Layers } from "lucide-react";
import { useMemo } from "react";

/**
 * Filter kind values that can be stored in the URL search param `kind`.
 * `all` is the synthetic "no filter" value; the rest map 1:1 to ActivityType.
 */
export type HistoryFilterKind = "all" | ActivityType;

const FILTERS: ReadonlyArray<{
  key: HistoryFilterKind;
  label: string;
  icon: typeof Layers;
}> = [
  { key: "all", label: "Semua", icon: Layers },
  { key: ActivityType.job, label: "Job", icon: Briefcase },
  { key: ActivityType.tugas, label: "Tugas", icon: ClipboardList },
  { key: ActivityType.penarikan, label: "Penarikan", icon: History },
];

/** Valid `kind` search-param values for fast membership checks. */
const VALID_KINDS = new Set<string>(["all", "job", "tugas", "penarikan"]);

/**
 * Read the active filter from the current URL `?kind=` search param.
 * Falls back to `all` when the param is missing or invalid, so the URL
 * is always the source of truth and survives reloads and sharing.
 */
export function useHistoryFilter(): HistoryFilterKind {
  const kind = useRouterState({
    select: (s) => (s.location.search as { kind?: unknown }).kind,
  });
  return useMemo(() => {
    if (typeof kind === "string" && VALID_KINDS.has(kind)) {
      return kind as HistoryFilterKind;
    }
    return "all";
  }, [kind]);
}

/**
 * Pill-style filter tabs for the Riwayat page.
 *
 * The active filter is persisted in the URL search param `kind` via
 * TanStack Router's `useNavigate`, so reloads, back/forward, and shared
 * links all preserve the selection. Each tab is a real button with a
 * visible focus ring and ≥44px hit target for comfortable mobile tapping.
 */
export function HistoryFilter() {
  const active = useHistoryFilter();
  const navigate = useNavigate();

  return (
    <div
      data-ocid="riwayat.filter"
      role="tablist"
      aria-label="Filter riwayat aktivitas"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
    >
      {FILTERS.map((filter) => {
        const Icon = filter.icon;
        const isActive = filter.key === active;
        return (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-ocid={`riwayat.filter.tab.${filter.key}`}
            onClick={() => {
              void navigate({
                to: "/riwayat",
                search: filter.key === "all" ? {} : { kind: filter.key },
                replace: true,
              });
            }}
            className={cn(
              "flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-smooth",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              isActive
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
