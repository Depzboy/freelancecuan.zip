import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry, LeaderboardPeriod } from "@/types";
import { Trophy } from "lucide-react";

interface LeaderboardProps {
  /** Weekly leaderboard from useWeeklyLeaderboard(). Falls back to demo data when null. */
  leaderboard: LeaderboardPeriod | null | undefined;
}

/** Demo leaderboard used while the backend is unavailable. */
const DEMO_ENTRIES: LeaderboardEntry[] = [
  { rank: 1n, username: "Adam hakiki", score: 870n },
  { rank: 2n, username: "Zack", score: 741n },
  { rank: 3n, username: "Dian Jeriyan", score: 652n },
  { rank: 4n, username: "Aceng Nawawi", score: 561n },
  { rank: 5n, username: "Riski Hidayat", score: 532n },
  { rank: 6n, username: "Yuskia", score: 519n },
  { rank: 7n, username: "cobra", score: 512n },
  { rank: 8n, username: "Elena", score: 475n },
  { rank: 9n, username: "Bayu Saputra", score: 463n },
  { rank: 10n, username: "Aria Nugrana", score: 383n },
];

const DEMO_PERIOD_LABEL = "Periode 10 Agt - 16 Agt 2026";
const DEMO_PRIZES: bigint[] = [75000n, 50000n, 25000n];

/** Medal styling per top-3 rank. */
const MEDAL_STYLES: Record<
  number,
  { ring: string; badge: string; text: string; label: string }
> = {
  1: {
    ring: "ring-2 ring-amber-300/60 bg-amber-50",
    badge: "bg-gradient-to-br from-amber-400 to-amber-600 text-white",
    text: "text-amber-600",
    label: "Juara 1",
  },
  2: {
    ring: "ring-2 ring-slate-300/60 bg-slate-50",
    badge: "bg-gradient-to-br from-slate-300 to-slate-500 text-white",
    text: "text-slate-500",
    label: "Juara 2",
  },
  3: {
    ring: "ring-2 ring-orange-300/60 bg-orange-50",
    badge: "bg-gradient-to-br from-orange-400 to-orange-700 text-white",
    text: "text-orange-600",
    label: "Juara 3",
  },
};

/**
 * Weekly leaderboard card.
 *
 * Shows the period label, three prize banners (Juara 1/2/3), and a ranked
 * list of 10 entries. Top-3 ranks receive gold/silver/bronze medal styling;
 * ranks 4-10 use neutral numbered badges.
 */
export function Leaderboard({ leaderboard }: LeaderboardProps) {
  const entries = leaderboard?.entries?.length
    ? leaderboard.entries
    : DEMO_ENTRIES;
  const periodLabel = leaderboard?.periodLabel || DEMO_PERIOD_LABEL;
  const prizes = leaderboard?.prizes?.length ? leaderboard.prizes : DEMO_PRIZES;

  const prizeLabels = ["Juara 1", "Juara 2", "Juara 3"];

  return (
    <section
      data-ocid="beranda.leaderboard.section"
      aria-label="Leaderboard Mingguan"
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
    >
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span
          className="flex size-10 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow"
          aria-hidden
        >
          <Trophy className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold text-foreground">
            Leaderboard Mingguan
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            {periodLabel} — peringkat berdasarkan email diterima.
          </p>
        </div>
      </header>

      {/* Prize banners */}
      <div className="grid grid-cols-3 gap-2 px-5 pt-4">
        {prizes.slice(0, 3).map((prize, idx) => {
          const medal = MEDAL_STYLES[idx + 1];
          return (
            <div
              key={`prize-${idx + 1}`}
              data-ocid={`beranda.leaderboard.prize.${idx + 1}`}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center",
                medal.ring,
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-bold",
                  medal.badge,
                )}
                aria-hidden
              >
                {idx + 1}
              </span>
              <p className={cn("text-[11px] font-semibold", medal.text)}>
                {prizeLabels[idx]}
              </p>
              <p className="font-display text-sm font-bold text-foreground">
                {formatRupiah(prize)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Ranked list */}
      <ol
        data-ocid="beranda.leaderboard.list"
        className="divide-y divide-border px-2 pb-2 pt-1"
      >
        {entries.slice(0, 10).map((entry) => {
          const rank = Number(entry.rank);
          const medal = MEDAL_STYLES[rank];
          const isTop3 = Boolean(medal);
          return (
            <li
              key={rank}
              data-ocid={`beranda.leaderboard.row.${rank}`}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-smooth hover:bg-muted/50"
            >
              {/* Rank badge */}
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold",
                  isTop3 ? medal.badge : "bg-muted text-muted-foreground",
                )}
                aria-hidden
              >
                {rank}
              </span>

              {/* Name */}
              <p className="min-w-0 flex-1 truncate font-medium text-foreground">
                {entry.username}
              </p>

              {/* Score */}
              <p
                className={cn(
                  "shrink-0 font-display text-sm font-bold tabular-nums",
                  isTop3 ? medal.text : "text-foreground",
                )}
              >
                {new Intl.NumberFormat("id-ID").format(Number(entry.score))}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
