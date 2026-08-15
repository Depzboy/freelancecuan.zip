import { formatDateTime, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  WITHDRAWAL_STATUS_LABEL,
  type WithdrawalStatus,
  type WithdrawalView,
} from "@/types";
import { Inbox } from "lucide-react";
import { motion } from "motion/react";

/**
 * WithdrawalHistory
 *
 * List of past withdrawals with date, nominal, method, and a status badge.
 * Status badge colors:
 *   - diajukan → yellow (amber)
 *   - diproses → blue
 *   - selesai  → green
 */

const STATUS_STYLES: Record<WithdrawalStatus, string> = {
  diajukan:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  diproses:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30",
  selesai:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
};

const STATUS_DOT: Record<WithdrawalStatus, string> = {
  diajukan: "bg-amber-500",
  diproses: "bg-blue-500",
  selesai: "bg-emerald-500",
};

export function WithdrawalHistory({
  withdrawals,
  isLoading,
}: {
  withdrawals: WithdrawalView[];
  isLoading: boolean;
}) {
  return (
    <motion.section
      data-ocid="saldo.history.section"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-foreground">
          Riwayat Penarikan
        </h2>
        {!isLoading && withdrawals.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {withdrawals.length} transaksi
          </span>
        )}
      </div>

      {isLoading ? (
        <HistorySkeleton />
      ) : withdrawals.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-2.5">
          {withdrawals.map((w, idx) => (
            <WithdrawalItem key={w.id.toString()} withdrawal={w} index={idx} />
          ))}
        </ul>
      )}
    </motion.section>
  );
}

function WithdrawalItem({
  withdrawal,
  index,
}: {
  withdrawal: WithdrawalView;
  index: number;
}) {
  const status = withdrawal.status;
  const statusLabel = WITHDRAWAL_STATUS_LABEL[status] ?? status;

  return (
    <li
      data-ocid={`saldo.history.item.${index}`}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-smooth hover:shadow-glow"
    >
      {/* Status dot / icon */}
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl border",
          STATUS_STYLES[status],
        )}
        aria-hidden
      >
        <span className={cn("size-2.5 rounded-full", STATUS_DOT[status])} />
      </div>

      {/* Date + method */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {withdrawal.method}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {formatDateTime(withdrawal.at)}
        </p>
      </div>

      {/* Nominal + status */}
      <div className="flex flex-col items-end gap-1">
        <span
          data-ocid={`saldo.history.nominal.${index}`}
          className="font-mono text-sm font-semibold text-foreground"
        >
          -{formatRupiah(withdrawal.nominal)}
        </span>
        <span
          data-ocid={`saldo.history.status.${index}`}
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
            STATUS_STYLES[status],
          )}
        >
          {statusLabel}
        </span>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div
      data-ocid="saldo.history.empty_state"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center"
    >
      <div
        className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"
        aria-hidden
      >
        <Inbox className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="font-display text-sm font-semibold text-foreground">
          Belum ada penarikan
        </p>
        <p className="text-xs text-muted-foreground">
          Penarikan yang Anda ajukan akan muncul di sini.
        </p>
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <ul data-ocid="saldo.history.loading_state" className="space-y-2.5">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <div className="size-10 shrink-0 animate-pulse rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded-full bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  );
}
