import Common "common";

module {
  public type Timestamp = Common.Timestamp;
  public type RewardType = Common.RewardType;
  public type TaskStatus = Common.TaskStatus;
  public type ActivityType = Common.ActivityType;
  public type WithdrawalStatus = Common.WithdrawalStatus;

  // Verified-email user profile. `email` is sourced from Internet Identity's
  // verified_email attribute at sign-in (never the unverified `email` key).
  // `name` is editable from the Profil screen (dummy, stored locally on chain).
  public type UserProfile = {
    principal : Principal;
    var name : Text;
    var email : ?Text;
    var role : Common.RewardType; // unused placeholder kept for future use
  };

  // Public, serializable view of a user profile (no var fields, no Principal leakage
  // beyond what the caller already owns).
  public type UserProfileView = {
    principal : Text;
    name : Text;
    email : ?Text;
  };

  // A listing on the Job board. `reward` is in Rupiah (Nat, no decimals).
  public type Job = {
    id : Nat;
    title : Text;
    description : Text;
    reward : Nat;
    category : Common.RewardType;
  };

  // A task the caller picked up from a Job. Tracks status and reward.
  public type Task = {
    id : Nat;
    jobId : Nat;
    owner : Principal;
    var status : Common.TaskStatus;
    reward : Nat;
    category : Common.RewardType;
    createdAt : Common.Timestamp;
  };

  public type TaskView = {
    id : Nat;
    jobId : Nat;
    owner : Text;
    status : Common.TaskStatus;
    reward : Nat;
    category : Common.RewardType;
    createdAt : Common.Timestamp;
  };

  // A Riwayat entry: one row per job-take, task-submission, or withdrawal.
  public type ActivityHistory = {
    id : Nat;
    owner : Principal;
    kind : Common.ActivityType;
    title : Text;
    amount : Nat; // reward gained (job/tugas) or nominal withdrawn (penarikan)
    at : Common.Timestamp;
  };

  public type ActivityHistoryView = {
    id : Nat;
    owner : Text;
    kind : Common.ActivityType;
    title : Text;
    amount : Nat;
    at : Common.Timestamp;
  };

  // Wallet breakdown. Two reward buckets + total. All dummy, demo-only.
  public type Wallet = {
    owner : Principal;
    var rewardEmailKhusus : Nat;
    var rewardEmailBebas : Nat;
  };

  public type WalletView = {
    owner : Text;
    rewardEmailKhusus : Nat;
    rewardEmailBebas : Nat;
    total : Nat;
  };

  // A dummy withdrawal request. Never actually moves funds.
  public type Withdrawal = {
    id : Nat;
    owner : Principal;
    nominal : Nat;
    method : Text;
    var status : Common.WithdrawalStatus;
    at : Common.Timestamp;
  };

  public type WithdrawalView = {
    id : Nat;
    owner : Text;
    nominal : Nat;
    method : Text;
    status : Common.WithdrawalStatus;
    at : Common.Timestamp;
  };

  // One row in the weekly leaderboard. Score is dummy-static per the spec.
  public type LeaderboardEntry = {
    rank : Nat;
    username : Text;
    score : Nat;
  };

  // A weekly leaderboard period with its top-3 prizes and ranked entries.
  public type LeaderboardPeriod = {
    periodLabel : Text; // e.g. "Periode 10 Agt - 16 Agt 2026"
    prizes : [Nat]; // [Juara 1, Juara 2, Juara 3] in Rupiah
    entries : [LeaderboardEntry];
  };
};
