import { formatNumber, formatRupiah } from "@/lib/format";
import type { HomeSummary } from "@/types";
import { CheckCircle2, Clock, Wallet } from "lucide-react";

interface StatusStatsProps {
  summary: HomeSummary | null | undefined;
}

/**
 * Three status pills: Pending, Diterima, and Saldo.
 *
 * Rendered as a horizontal row of white cards with an icon, numeric value,
 * and label. Mirrors the Freelancecuan status summary row.
 */
export function StatusStats({ summary }: StatusStatsProps) {
  const pending = summary?.pendingCount ?? 0n;
  const diterima = summary?.diterimaCount ?? 2n;
  const saldo = summary?.saldo ?? 400n;

  const stats = [
    {
      key: "pending" as const,
      label: "Pending",
      value: formatNumber(pending),
      Icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
    {
      key: "diterima" as const,
      label: "Diterima",
      value: formatNumber(diterima),
      Icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      key: "saldo" as const,
      label: "Saldo",
      value: formatRupiah(saldo),
      Icon: Wallet,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
  ];

  return (
    <section
      data-ocid="beranda.status.section"
      aria-label="Ringkasan status"
      className="grid grid-cols-3 gap-3"
    >
      {stats.map(({ key, label, value, Icon, iconColor, iconBg }) => (
        <article
          key={key}
          data-ocid={`beranda.status.card.${key}`}
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-center shadow-sm"
        >
          <span
            className={`flex size-9 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
            aria-hidden
          >
            <Icon className="size-5" />
          </span>
          <p className="font-display text-base font-bold leading-none text-foreground">
            {value}
          </p>
          <p className="text-[11px] font-medium leading-none text-muted-foreground">
            {label}
          </p>
        </article>
      ))}
    </section>
  );
}
