import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/freelancecuan";
import Common "../types/common";
import Freelancecuan "../lib/freelancecuan";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles : Map.Map<Principal, Types.UserProfile>,
  jobs : List.List<Types.Job>,
  tasks : List.List<Types.Task>,
  history : List.List<Types.ActivityHistory>,
  wallets : Map.Map<Principal, Types.Wallet>,
  withdrawals : List.List<Types.Withdrawal>,
  nextTaskId : { var next : Nat },
  nextHistoryId : { var next : Nat },
  nextWithdrawalId : { var next : Nat },
  leaderboard : Types.LeaderboardPeriod,
) {

  // --- Login & Autentikasi ------------------------------------------------

  // Internal helper (not a public endpoint): stores the verified email
  // captured by MixinAuthorization's attribute callback. Called from main.mo's
  // onAttributesVerified closure. Creates the profile on first sign-in so the
  // verified email is persisted before the user ever opens the Profil screen.
  // Declared private (not `public`) so it can be called from a synchronous
  // non-async context without requiring send capability (M0047).
  func _freelancecuan_recordEmail(caller : Principal, email : ?Text) : () {
    switch (email) {
      case (?e) {
        switch (profiles.get(caller)) {
          case (?existing) { existing.email := ?e };
          case null {
            let profile : Types.UserProfile = {
              principal = caller;
              var name = "Pengguna"; // default display name until edited
              var email = ?e;
              var role = #emailKhusus; // placeholder, unused
            };
            profiles.add(caller, profile);
          };
        };
      };
      case null {};
    };
  };

  public query ({ caller }) func getCallerProfile() : async ?Types.UserProfileView {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    Freelancecuan.getProfileView(profiles, caller);
  };

  public shared ({ caller }) func updateCallerName(name : Text) : async Types.UserProfileView {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    // Preserve any previously captured verified email.
    let existingEmail = switch (profiles.get(caller)) {
      case (?p) p.email;
      case null null;
    };
    Freelancecuan.upsertProfile(profiles, caller, name, existingEmail);
  };

  // --- Beranda (Home Dashboard) ------------------------------------------
  // Per spec the dashboard shows static demo aggregates: saldo Rp 400,
  // Email Khusus 4.300, Email Bebas 3.300, 0 Pending, 2 Diterima. These are
  // dummy-static demo values ("Semua data dummy statis untuk demo"), not
  // derived from the caller's live task/wallet state.

  public query ({ caller }) func getHomeSummary() : async {
    rewardEmailKhusus : Nat;
    rewardEmailBebas : Nat;
    pendingCount : Nat;
    diterimaCount : Nat;
    saldo : Nat;
  } {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    {
      rewardEmailKhusus = 4300;
      rewardEmailBebas = 3300;
      pendingCount = 0;
      diterimaCount = 2;
      saldo = 400;
    };
  };

  public query func getWeeklyLeaderboard() : async Types.LeaderboardPeriod {
    Freelancecuan.getLeaderboard(leaderboard);
  };

  // --- Job ----------------------------------------------------------------

  public query func listJobs() : async [Types.Job] {
    Freelancecuan.listJobs(jobs);
  };

  public query func listJobsByCategory(category : Common.RewardType) : async [Types.Job] {
    Freelancecuan.listJobsByCategory(jobs, category);
  };

  public query func getJob(id : Nat) : async ?Types.Job {
    Freelancecuan.getJob(jobs, id);
  };

  public shared ({ caller }) func takeJob(jobId : Nat) : async ?Types.TaskView {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    let now : Common.Timestamp = Int.abs(Time.now());
    switch (Freelancecuan.takeTask(tasks, jobs, nextTaskId, caller, jobId, now)) {
      case (?view) {
        // Record a Riwayat entry for taking the job.
        let title = switch (Freelancecuan.getJob(jobs, jobId)) {
          case (?j) j.title;
          case null "Job #" # jobId.toText();
        };
        Freelancecuan.recordActivity(
          history,
          nextHistoryId,
          caller,
          #job,
          title,
          0, // no reward yet — credited on completion
          now,
        );
        ?view;
      };
      case null null;
    };
  };

  // --- Tugas --------------------------------------------------------------

  public query ({ caller }) func listMyTasks() : async [Types.TaskView] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    Freelancecuan.listTasksFor(tasks, caller);
  };

  public query ({ caller }) func getMyTask(id : Nat) : async ?Types.TaskView {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    Freelancecuan.getTaskView(tasks, caller, id);
  };

  public shared ({ caller }) func completeTask(id : Nat) : async ?Types.TaskView {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    let now : Common.Timestamp = Int.abs(Time.now());
    switch (Freelancecuan.completeTask(tasks, caller, id)) {
      case (?view) {
        // Credit the wallet and record the completion in Riwayat.
        Freelancecuan.addReward(wallets, caller, view.category, view.reward);
        Freelancecuan.recordActivity(
          history,
          nextHistoryId,
          caller,
          #tugas,
          "Tugas #" # view.id.toText() # " diterima",
          view.reward,
          now,
        );
        ?view;
      };
      case null null;
    };
  };

  // --- Riwayat ------------------------------------------------------------

  public query ({ caller }) func listMyHistory() : async [Types.ActivityHistoryView] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    Freelancecuan.listHistoryFor(history, caller);
  };

  public query ({ caller }) func listMyHistoryByKind(
    kind : Common.ActivityType,
  ) : async [Types.ActivityHistoryView] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    Freelancecuan.listHistoryByKind(history, caller, kind);
  };

  // --- Saldo (Wallet) -----------------------------------------------------

  public query ({ caller }) func getMyWallet() : async Types.WalletView {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    Freelancecuan.getWalletView(wallets, caller);
  };

  public shared ({ caller }) func requestWithdrawal(
    nominal : Nat,
    method : Text,
  ) : async Types.WithdrawalView {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    let now : Common.Timestamp = Int.abs(Time.now());
    let view = Freelancecuan.requestWithdrawal(
      withdrawals,
      nextWithdrawalId,
      caller,
      nominal,
      method,
      now,
    );
    // Record the dummy withdrawal request in Riwayat. Does NOT debit the
    // wallet — no real payment processing per spec.
    Freelancecuan.recordActivity(
      history,
      nextHistoryId,
      caller,
      #penarikan,
      "Penarikan " # method,
      nominal,
      now,
    );
    view;
  };

  public query ({ caller }) func listMyWithdrawals() : async [Types.WithdrawalView] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    Freelancecuan.listWithdrawalsFor(withdrawals, caller);
  };

  // --- Profil -------------------------------------------------------------

  // Per spec the Profil stats are dummy-static demo values: total jobs
  // completed, total reward earned, and current leaderboard rank. The user is
  // not present in the dummy leaderboard, so currentRank is a placeholder.
  public query ({ caller }) func getMyProfileStats() : async {
    totalJobsCompleted : Nat;
    totalRewardEarned : Nat;
    currentRank : Nat;
  } {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: silakan login terlebih dahulu");
    };
    {
      totalJobsCompleted = 2;
      totalRewardEarned = 400;
      currentRank = 0; // not ranked in the dummy leaderboard
    };
  };
};
