import { createActor } from "@/backend";
import type {
  ActivityHistoryView,
  ActivityType,
  Job,
  LeaderboardPeriod,
  RewardType,
  TaskView,
  UserProfileView,
  WalletView,
  WithdrawalView,
} from "@/backend";
import type { HomeSummary, ProfileStats } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Backend integration layer.
 *
 * Every backend method is exposed as a TanStack Query hook (read) or
 * mutation hook (write). All hooks call `useActor(createActor)` at the
 * top level and are gated on `!!actor && !isFetching`.
 *
 * Pages should import the named hooks from here, never call the actor
 * directly.
 */

/** Underlying actor + fetch status for advanced consumers. */
export function useBackendActor() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}

/* ------------------------------------------------------------------ */
/* Profile                                                            */
/* ------------------------------------------------------------------ */

export function useCallerProfile() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["callerProfile"],
    queryFn: async (): Promise<UserProfileView | null> => {
      if (!actor) return null;
      return actor.getCallerProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateCallerName() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string): Promise<UserProfileView> => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.updateCallerName(name);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Home                                                               */
/* ------------------------------------------------------------------ */

export function useHomeSummary() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["homeSummary"],
    queryFn: async (): Promise<HomeSummary | null> => {
      if (!actor) return null;
      return actor.getHomeSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWeeklyLeaderboard() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["weeklyLeaderboard"],
    queryFn: async (): Promise<LeaderboardPeriod | null> => {
      if (!actor) return null;
      return actor.getWeeklyLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

/* ------------------------------------------------------------------ */
/* Jobs                                                               */
/* ------------------------------------------------------------------ */

export function useJobs() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async (): Promise<Job[]> => {
      if (!actor) return [];
      return actor.listJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useJobsByCategory(category: RewardType | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["jobs", category],
    queryFn: async (): Promise<Job[]> => {
      if (!actor || category === null) return [];
      return actor.listJobsByCategory(category);
    },
    enabled: !!actor && !isFetching && category !== null,
  });
}

export function useJob(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["job", id?.toString()],
    queryFn: async (): Promise<Job | null> => {
      if (!actor || id === null) return null;
      return actor.getJob(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useTakeJob() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: bigint): Promise<TaskView | null> => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.takeJob(jobId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["myTasks"] });
      void queryClient.invalidateQueries({ queryKey: ["homeSummary"] });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Tasks                                                              */
/* ------------------------------------------------------------------ */

export function useMyTasks() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["myTasks"],
    queryFn: async (): Promise<TaskView[]> => {
      if (!actor) return [];
      return actor.listMyTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyTask(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["myTask", id?.toString()],
    queryFn: async (): Promise<TaskView | null> => {
      if (!actor || id === null) return null;
      return actor.getMyTask(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCompleteTask() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint): Promise<TaskView | null> => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.completeTask(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myTasks"] });
      void queryClient.invalidateQueries({ queryKey: ["homeSummary"] });
      void queryClient.invalidateQueries({ queryKey: ["myWallet"] });
      void queryClient.invalidateQueries({ queryKey: ["myHistory"] });
      void queryClient.invalidateQueries({ queryKey: ["myProfileStats"] });
    },
  });
}

/* ------------------------------------------------------------------ */
/* History                                                            */
/* ------------------------------------------------------------------ */

export function useMyHistory() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["myHistory"],
    queryFn: async (): Promise<ActivityHistoryView[]> => {
      if (!actor) return [];
      return actor.listMyHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyHistoryByKind(kind: ActivityType | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["myHistory", kind],
    queryFn: async (): Promise<ActivityHistoryView[]> => {
      if (!actor || kind === null) return [];
      return actor.listMyHistoryByKind(kind);
    },
    enabled: !!actor && !isFetching && kind !== null,
  });
}

/* ------------------------------------------------------------------ */
/* Wallet & Withdrawals                                               */
/* ------------------------------------------------------------------ */

export function useMyWallet() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["myWallet"],
    queryFn: async (): Promise<WalletView | null> => {
      if (!actor) return null;
      return actor.getMyWallet();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyWithdrawals() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["myWithdrawals"],
    queryFn: async (): Promise<WithdrawalView[]> => {
      if (!actor) return [];
      return actor.listMyWithdrawals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestWithdrawal() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      nominal: bigint;
      method: string;
    }): Promise<WithdrawalView> => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.requestWithdrawal(args.nominal, args.method);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myWithdrawals"] });
      void queryClient.invalidateQueries({ queryKey: ["myWallet"] });
      void queryClient.invalidateQueries({ queryKey: ["myHistory"] });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Profile stats                                                      */
/* ------------------------------------------------------------------ */

export function useMyProfileStats() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["myProfileStats"],
    queryFn: async (): Promise<ProfileStats | null> => {
      if (!actor) return null;
      return actor.getMyProfileStats();
    },
    enabled: !!actor && !isFetching,
  });
}
