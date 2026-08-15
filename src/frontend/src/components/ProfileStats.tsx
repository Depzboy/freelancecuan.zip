import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatRupiah } from "@/lib/format";
import { Briefcase, Medal, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Profile statistics returned by getMyProfileStats(). */
interface ProfileStatsValue {
  totalJobsCompleted: bigint;
  totalRewardEarned: bigint;
  currentRank: bigint;
}

type StatCard = {
  key: string;
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
};

/**
 * Three-card summary of the user's profile statistics:
 * total jobs completed, total reward earned (Rupiah), and current
 * leaderboard rank. Mobile-first grid with rounded 20-24px cards.
 */
export function ProfileStats({
  stats,
  isLoading,
}: {
  stats: ProfileStatsValue | null | undefined;
  isLoading: boolean;
}) {
  const cards: StatCard[] = [
    {
      key: "jobs",
      label: "Total Job Selesai",
      value: formatNumber(stats?.totalJobsCompleted ?? 0n),
      icon: Briefcase,
      accent: "text-primary",
    },
    {
      key: "reward",
      label: "Total Reward Diperoleh",
      value: formatRupiah(stats?.totalRewardEarned ?? 0n),
      icon: Wallet,
      accent: "text-accent",
    },
    {
      key: "rank",
      label: "Peringkat Leaderboard",
      value:
        stats && stats.currentRank > 0n
          ? `#${formatNumber(stats.currentRank)}`
          : "Belum ada",
      icon: Medal,
      accent: "text-primary",
    },
  ];

  return (
    <section data-ocid="profil.stats.section" className="space-y-3">
      <h3 className="font-display text-base font-semibold text-foreground">
        Statistik
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              data-ocid={`profil.stats.card.${index}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-smooth hover:shadow-glow"
            >
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary ${card.accent}`}
              >
                <Icon className="size-5" aria-hidden />
              </div>
              {isLoading ? (
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ) : (
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p
                    data-ocid={`profil.stats.value.${index}`}
                    className="font-display truncate text-lg font-bold text-foreground"
                  >
                    {card.value}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
