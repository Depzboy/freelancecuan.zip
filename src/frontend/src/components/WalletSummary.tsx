import { formatRupiah } from "@/lib/format";
import type { WalletView } from "@/types";
import { motion } from "motion/react";

/**
 * WalletSummary
 *
 * Gradient biru-ungu card showing the user's total saldo, with a breakdown
 * below: Reward Email Khusus, Reward Email Bebas, and the total. The card
 * uses the project's `--gradient-primary` token and rounded-3xl corners
 * (24px) to match the Freelancecuan aesthetic.
 */
export function WalletSummary({ wallet }: { wallet: WalletView | null }) {
  const total = wallet?.total ?? 0n;
  const khusus = wallet?.rewardEmailKhusus ?? 0n;
  const bebas = wallet?.rewardEmailBebas ?? 0n;

  return (
    <motion.section
      data-ocid="saldo.summary.card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-glow"
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-12 size-48 rounded-full bg-white/15 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative space-y-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary-foreground/80">
            Total Saldo
          </p>
          <p
            data-ocid="saldo.summary.total"
            className="font-display text-4xl font-bold tracking-tight"
          >
            {formatRupiah(total)}
          </p>
          <p className="text-xs text-primary-foreground/70">
            Saldo dapat ditarik kapan saja
          </p>
        </div>

        {/* Breakdown */}
        <div className="space-y-2.5 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">
            Rincian Saldo
          </p>

          <BreakdownRow
            label="Reward Email Khusus"
            value={khusus}
            marker="saldo.summary.khusus"
          />
          <BreakdownRow
            label="Reward Email Bebas"
            value={bebas}
            marker="saldo.summary.bebas"
          />

          <div className="my-1 h-px bg-white/20" />

          <BreakdownRow
            label="Total"
            value={total}
            marker="saldo.summary.total_row"
            emphasize
          />
        </div>
      </div>
    </motion.section>
  );
}

function BreakdownRow({
  label,
  value,
  marker,
  emphasize = false,
}: {
  label: string;
  value: bigint;
  marker: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={
          emphasize
            ? "text-sm font-semibold text-primary-foreground"
            : "text-sm text-primary-foreground/85"
        }
      >
        {label}
      </span>
      <span
        data-ocid={marker}
        className={
          emphasize
            ? "font-display text-base font-bold text-primary-foreground"
            : "font-mono text-sm font-medium text-primary-foreground"
        }
      >
        {formatRupiah(value)}
      </span>
    </div>
  );
}
