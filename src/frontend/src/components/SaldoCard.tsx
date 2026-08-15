import { formatRupiah } from "@/lib/format";
import type { HomeSummary } from "@/types";
import { Wallet } from "lucide-react";

interface SaldoCardProps {
  /** Home summary from useHomeSummary(). Falls back to demo values when null. */
  summary: HomeSummary | null | undefined;
}

/**
 * Primary gradient balance card.
 *
 * Blue-to-purple gradient surface showing "Saldo kamu" and the formatted
 * Rupiah balance. Two nested semi-transparent reward boxes (Email Khusus /
 * Email Bebas) sit inside the card, mirroring the Freelancecuan dashboard.
 */
export function SaldoCard({ summary }: SaldoCardProps) {
  const saldo = summary?.saldo ?? 400n;
  const rewardKhusus = summary?.rewardEmailKhusus ?? 4300n;
  const rewardBebas = summary?.rewardEmailBebas ?? 3300n;

  return (
    <section
      data-ocid="beranda.saldo.card"
      aria-label="Saldo kamu"
      className="relative overflow-hidden rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow"
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/15 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-8 size-36 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative">
        {/* Header row */}
        <div className="flex items-center gap-2">
          <span
            className="flex size-9 items-center justify-center rounded-2xl bg-white/20"
            aria-hidden
          >
            <Wallet className="size-5 text-primary-foreground" />
          </span>
          <div>
            <p className="text-sm font-medium text-primary-foreground/90">
              Saldo kamu
            </p>
            <p className="text-xs text-primary-foreground/70">
              Total saldo yang dapat ditarik
            </p>
          </div>
        </div>

        {/* Balance */}
        <p className="mt-4 font-display text-4xl font-bold tracking-tight">
          {formatRupiah(saldo)}
        </p>

        {/* Nested reward boxes */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div
            data-ocid="beranda.saldo.reward_khusus"
            className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm"
          >
            <p className="text-xs font-medium text-primary-foreground/80">
              Reward Email Khusus
            </p>
            <p className="mt-1 font-display text-xl font-bold">
              {new Intl.NumberFormat("id-ID").format(Number(rewardKhusus))}
            </p>
          </div>
          <div
            data-ocid="beranda.saldo.reward_bebas"
            className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm"
          >
            <p className="text-xs font-medium text-primary-foreground/80">
              Reward Email Bebas
            </p>
            <p className="mt-1 font-display text-xl font-bold">
              {new Intl.NumberFormat("id-ID").format(Number(rewardBebas))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
