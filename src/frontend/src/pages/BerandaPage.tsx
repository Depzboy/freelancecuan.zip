import { Leaderboard } from "@/components/Leaderboard";
import { RewardStats } from "@/components/RewardStats";
import { SaldoCard } from "@/components/SaldoCard";
import { StatusStats } from "@/components/StatusStats";
import { useHomeSummary, useWeeklyLeaderboard } from "@/hooks/useBackend";
import { motion } from "motion/react";

/**
 * Beranda (Home Dashboard) page.
 *
 * Replicates the Freelancecuan dashboard: a gradient Saldo card with nested
 * reward boxes, a secondary reward row, a three-up status row, and the
 * weekly leaderboard with prize banners and a ranked list.
 *
 * All data comes from `useHomeSummary` and `useWeeklyLeaderboard`. While the
 * backend is loading or unavailable, the components fall back to the demo
 * values shown in the Freelancecuan screenshot so the dashboard always
 * renders a complete, intentional view.
 */
export function BerandaPage() {
  const { data: summary } = useHomeSummary();
  const { data: leaderboard } = useWeeklyLeaderboard();

  return (
    <motion.div
      data-ocid="beranda.page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      {/* Greeting */}
      <header className="px-1">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Beranda
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Halo, selamat datang. Pantau saldo dan kirim email untuk menambah
          penghasilanmu.
        </p>
      </header>

      {/* Saldo card with nested reward boxes */}
      <SaldoCard summary={summary} />

      {/* Secondary reward row */}
      <RewardStats summary={summary} />

      {/* Status row */}
      <StatusStats summary={summary} />

      {/* Weekly leaderboard */}
      <Leaderboard leaderboard={leaderboard} />
    </motion.div>
  );
}
