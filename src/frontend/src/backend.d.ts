import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    username: string;
    rank: bigint;
    score: bigint;
}
export type Timestamp = bigint;
export interface ActivityHistoryView {
    at: Timestamp;
    id: bigint;
    title: string;
    owner: string;
    kind: ActivityType;
    amount: bigint;
}
export interface WalletView {
    total: bigint;
    owner: string;
    rewardEmailKhusus: bigint;
    rewardEmailBebas: bigint;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface WithdrawalView {
    at: Timestamp;
    id: bigint;
    status: WithdrawalStatus;
    method: string;
    owner: string;
    nominal: bigint;
}
export interface LeaderboardPeriod {
    entries: Array<LeaderboardEntry>;
    periodLabel: string;
    prizes: Array<bigint>;
}
export interface Job {
    id: bigint;
    reward: bigint;
    title: string;
    description: string;
    category: RewardType;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface TaskView {
    id: bigint;
    status: TaskStatus;
    reward: bigint;
    owner: string;
    createdAt: Timestamp;
    jobId: bigint;
    category: RewardType;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface UserProfileView {
    principal: string;
    name: string;
    email?: string;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum ActivityType {
    job = "job",
    tugas = "tugas",
    penarikan = "penarikan"
}
export enum RewardType {
    emailKhusus = "emailKhusus",
    emailBebas = "emailBebas"
}
export enum TaskStatus {
    pending = "pending",
    diterima = "diterima"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WithdrawalStatus {
    diproses = "diproses",
    selesai = "selesai",
    diajukan = "diajukan"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeTask(id: bigint): Promise<TaskView | null>;
    execute(qJson: string): Promise<Result>;
    getCallerProfile(): Promise<UserProfileView | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHomeSummary(): Promise<{
        pendingCount: bigint;
        diterimaCount: bigint;
        rewardEmailKhusus: bigint;
        saldo: bigint;
        rewardEmailBebas: bigint;
    }>;
    getJob(id: bigint): Promise<Job | null>;
    getMyProfileStats(): Promise<{
        totalRewardEarned: bigint;
        totalJobsCompleted: bigint;
        currentRank: bigint;
    }>;
    getMyTask(id: bigint): Promise<TaskView | null>;
    getMyWallet(): Promise<WalletView>;
    getWeeklyLeaderboard(): Promise<LeaderboardPeriod>;
    isCallerAdmin(): Promise<boolean>;
    listJobs(): Promise<Array<Job>>;
    listJobsByCategory(category: RewardType): Promise<Array<Job>>;
    listMyHistory(): Promise<Array<ActivityHistoryView>>;
    listMyHistoryByKind(kind: ActivityType): Promise<Array<ActivityHistoryView>>;
    listMyTasks(): Promise<Array<TaskView>>;
    listMyWithdrawals(): Promise<Array<WithdrawalView>>;
    requestWithdrawal(nominal: bigint, method: string): Promise<WithdrawalView>;
    schema(): Promise<string>;
    takeJob(jobId: bigint): Promise<TaskView | null>;
    updateCallerName(name: string): Promise<UserProfileView>;
}
