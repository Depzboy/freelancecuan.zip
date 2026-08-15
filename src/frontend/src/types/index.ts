/**
 * Frontend types mirroring backend.d.ts.
 * Re-exported here so pages import from a single, stable surface.
 */
import {
  type ActivityHistoryView,
  ActivityType,
  type Error_,
  type Job,
  type LeaderboardEntry,
  type LeaderboardPeriod,
  type Result__1,
  RewardType,
  TaskStatus,
  type TaskView,
  type Timestamp,
  type UserProfileView,
  type UserRole,
  type WalletView,
  WithdrawalStatus,
  type WithdrawalView,
} from "@/backend";

export type {
  ActivityHistoryView,
  Error_,
  Job,
  LeaderboardEntry,
  LeaderboardPeriod,
  Result__1 as SsoResult,
  TaskView,
  Timestamp,
  UserProfileView,
  UserRole,
  WalletView,
  WithdrawalView,
};

// Enums are runtime values — must be re-exported as values, not types.
export { ActivityType, RewardType, TaskStatus, WithdrawalStatus };

/** Aggregated home dashboard summary returned by getHomeSummary(). */
export interface HomeSummary {
  pendingCount: bigint;
  diterimaCount: bigint;
  rewardEmailKhusus: bigint;
  saldo: bigint;
  rewardEmailBebas: bigint;
}

/** Profile statistics returned by getMyProfileStats(). */
export interface ProfileStats {
  totalRewardEarned: bigint;
  totalJobsCompleted: bigint;
  currentRank: bigint;
}

/** Indonesian labels for the RewardType enum. */
export const REWARD_TYPE_LABEL: Record<string, string> = {
  emailKhusus: "Email Khusus",
  emailBebas: "Email Bebas",
};

/** Indonesian labels for the TaskStatus enum. */
export const TASK_STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  diterima: "Diterima",
};

/** Indonesian labels for the ActivityType enum. */
export const ACTIVITY_TYPE_LABEL: Record<string, string> = {
  job: "Job",
  tugas: "Tugas",
  penarikan: "Penarikan",
};

/** Indonesian labels for the WithdrawalStatus enum. */
export const WITHDRAWAL_STATUS_LABEL: Record<string, string> = {
  diajukan: "Diajukan",
  diproses: "Diproses",
  selesai: "Selesai",
};

/** The six bottom-navigation tabs in display order. */
export type TabKey =
  | "beranda"
  | "job"
  | "tugas"
  | "riwayat"
  | "saldo"
  | "profil";
