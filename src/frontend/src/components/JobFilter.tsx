import { cn } from "@/lib/utils";
import { REWARD_TYPE_LABEL, RewardType } from "@/types";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Briefcase, Mail, MailCheck } from "lucide-react";
import { useMemo } from "react";

/** Filter key: "semua" (all) or a RewardType value. */
export type JobFilterValue = "semua" | RewardType;

/** Map a URL `kategori` param to a JobFilterValue, defaulting to "semua". */
function parseFilter(raw: string | null | undefined): JobFilterValue {
  if (raw === RewardType.emailKhusus || raw === RewardType.emailBebas)
    return raw as RewardType;
  return "semua";
}

interface FilterTab {
  value: JobFilterValue;
  label: string;
  icon: typeof Briefcase;
}

const TABS: FilterTab[] = [
  { value: "semua", label: "Semua", icon: Briefcase },
  { value: RewardType.emailKhusus, label: "Email Khusus", icon: MailCheck },
  { value: RewardType.emailBebas, label: "Email Bebas", icon: Mail },
];

/**
 * Horizontal pill-style filter for the Job list.
 *
 * The active filter is stored in the URL search param `kategori` so it
 * survives page refresh and back/forward navigation. "Semua" maps to no
 * param (clean URL); category values map to `?kategori=emailKhusus|emailBebas`.
 */
export function JobFilter() {
  const location = useLocation();
  const navigate = useNavigate();

  const active = useMemo(
    () => parseFilter(new URLSearchParams(location.search).get("kategori")),
    [location.search],
  );

  const select = (value: JobFilterValue) => {
    const params = new URLSearchParams(location.search);
    if (value === "semua") {
      params.delete("kategori");
    } else {
      params.set("kategori", value);
    }
    const qs = params.toString();
    navigate({ to: "/job", search: qs ? Object.fromEntries(params) : {} });
  };

  return (
    <div
      data-ocid="job.filter"
      role="tablist"
      aria-label="Filter kategori job"
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        const Icon = tab.icon;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-ocid={`job.filter.tab.${tab.value}`}
            onClick={() => select(tab.value)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-smooth",
              "min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              isActive
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** Resolve the active filter from the current location search string. */
export function useJobFilterValue(): JobFilterValue {
  const location = useLocation();
  return useMemo(
    () => parseFilter(new URLSearchParams(location.search).get("kategori")),
    [location.search],
  );
}

/** Human-readable label for a RewardType, falling back to the raw value. */
export function rewardTypeLabel(category: RewardType): string {
  return REWARD_TYPE_LABEL[category] ?? category;
}
