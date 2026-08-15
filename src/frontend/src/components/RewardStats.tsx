import { formatNumber } from "@/lib/format";
import type { HomeSummary } from "@/types";
import { Mail, MailOpen } from "lucide-react";

interface RewardStatsProps {
  summary: HomeSummary | null | undefined;
}

/**
 * Two reward summary cards displayed below the Saldo card.
 *
 * "Reward Email Khusus" and "Reward Email Bebas" each render as a white
 * card with an icon, label, and formatted number value. These mirror the
 * nested reward boxes but as standalone cards for the secondary row.
 */
export function RewardStats({ summary }: RewardStatsProps) {
  const rewardKhusus = summary?.rewardEmailKhusus ?? 4300n;
  const rewardBebas = summary?.rewardEmailBebas ?? 3300n;

  const cards = [
    {
      key: "khusus" as const,
      label: "Reward Email Khusus",
      value: formatNumber(rewardKhusus),
      Icon: Mail,
      accent: "text-primary",
      bg: "bg-primary/10",
    },
    {
      key: "bebas" as const,
      label: "Reward Email Bebas",
      value: formatNumber(rewardBebas),
      Icon: MailOpen,
      accent: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <section
      data-ocid="beranda.reward.section"
      aria-label="Ringkasan reward"
      className="grid grid-cols-2 gap-3"
    >
      {cards.map(({ key, label, value, Icon, accent, bg }) => (
        <article
          key={key}
          data-ocid={`beranda.reward.card.${key}`}
          className="rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <span
            className={`flex size-9 items-center justify-center rounded-xl ${bg} ${accent}`}
            aria-hidden
          >
            <Icon className="size-5" />
          </span>
          <p className="mt-3 text-xs font-medium text-muted-foreground">
            {label}
          </p>
          <p className="mt-0.5 font-display text-xl font-bold text-foreground">
            {value}
          </p>
        </article>
      ))}
    </section>
  );
}
