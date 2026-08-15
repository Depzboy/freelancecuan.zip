import { formatDateTime, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ActivityHistoryView, ActivityType } from "@/types";
import { Briefcase, ClipboardList, Minus, Plus, Wallet } from "lucide-react";
import { motion } from "motion/react";
import type { ComponentType } from "react";

/** Visual metadata per activity kind: icon, badge label, and tone. */
const KIND_META: Record<
  ActivityType,
  {
    label: string;
    icon: ComponentType<{ className?: string }>;
    badge: string;
    amountClass: string;
  }
> = {
  job: {
    label: "Job",
    icon: Briefcase,
    badge: "bg-primary/10 text-primary",
    amountClass: "text-primary",
  },
  tugas: {
    label: "Tugas",
    icon: ClipboardList,
    badge: "bg-accent/10 text-accent",
    amountClass: "text-accent",
  },
  penarikan: {
    label: "Penarikan",
    icon: Wallet,
    badge: "bg-destructive/10 text-destructive",
    amountClass: "text-destructive",
  },
};

interface HistoryItemProps {
  /** The activity record to render. */
  item: ActivityHistoryView;
  /** 1-based position in the visible list, for deterministic test markers. */
  index: number;
  /** Called when the row is clicked — opens the detail view. */
  onSelect: (item: ActivityHistoryView) => void;
}

/**
 * A single activity-history row.
 *
 * Shows the date (formatDateTime), a kind badge with an icon, the title,
 * and the amount formatted as Rupiah with a `+` prefix for earnings
 * (job, tugas) and a `-` prefix for withdrawals (penarikan). The whole
 * row is a button so it is keyboard-reachable and announces as
 * clickable to assistive tech.
 */
export function HistoryItem({ item, index, onSelect }: HistoryItemProps) {
  const meta = KIND_META[item.kind];
  const Icon = meta.icon;
  const isWithdrawal = item.kind === "penarikan";
  const amountClass = meta.amountClass;

  return (
    <motion.button
      type="button"
      data-ocid={`riwayat.item.${index}`}
      onClick={() => onSelect(item)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.03,
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left transition-smooth",
        "min-h-[64px] hover:border-primary/40 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      )}
    >
      {/* Kind icon tile */}
      <span
        aria-hidden
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          meta.badge,
        )}
      >
        <Icon className="size-5" />
      </span>

      {/* Title + date */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-semibold text-foreground">
          {item.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
              meta.badge,
            )}
          >
            {meta.label}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {formatDateTime(item.at)}
          </span>
        </div>
      </div>

      {/* Amount with sign */}
      <div className="flex shrink-0 flex-col items-end">
        <span
          className={cn(
            "flex items-center gap-0.5 font-display text-sm font-bold tabular-nums",
            amountClass,
          )}
        >
          {isWithdrawal ? (
            <Minus className="size-3.5" aria-hidden />
          ) : (
            <Plus className="size-3.5" aria-hidden />
          )}
          {formatRupiah(item.amount)}
        </span>
      </div>
    </motion.button>
  );
}
