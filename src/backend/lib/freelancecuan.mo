import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Types "../types/freelancecuan";
import Common "../types/common";

module {
  public type UserProfile = Types.UserProfile;
  public type UserProfileView = Types.UserProfileView;
  public type Job = Types.Job;
  public type Task = Types.Task;
  public type TaskView = Types.TaskView;
  public type ActivityHistory = Types.ActivityHistory;
  public type ActivityHistoryView = Types.ActivityHistoryView;
  public type Wallet = Types.Wallet;
  public type WalletView = Types.WalletView;
  public type Withdrawal = Types.Withdrawal;
  public type WithdrawalView = Types.WithdrawalView;
  public type LeaderboardEntry = Types.LeaderboardEntry;
  public type LeaderboardPeriod = Types.LeaderboardPeriod;

  // --- User profiles -------------------------------------------------------

  public func toProfileView(self : UserProfile) : UserProfileView {
    {
      principal = self.principal.toText();
      name = self.name;
      email = self.email;
    };
  };

  // Insert-or-update the caller's profile. Creates a fresh profile on first
  // sign-in, then keeps name/email in sync on subsequent sign-ins and edits.
  public func upsertProfile(
    profiles : Map.Map<Principal, UserProfile>,
    caller : Principal,
    name : Text,
    email : ?Text,
  ) : UserProfileView {
    switch (profiles.get(caller)) {
      case (?existing) {
        existing.name := name;
        switch (email) {
          case (?e) { existing.email := ?e };
          case null {};
        };
        toProfileView(existing);
      };
      case null {
        let profile : UserProfile = {
          principal = caller;
          var name;
          var email;
          var role = #emailKhusus; // placeholder, unused
        };
        profiles.add(caller, profile);
        toProfileView(profile);
      };
    };
  };

  public func getProfileView(
    profiles : Map.Map<Principal, UserProfile>,
    caller : Principal,
  ) : ?UserProfileView {
    switch (profiles.get(caller)) {
      case (?p) ?toProfileView(p);
      case null null;
    };
  };

  // --- Jobs ----------------------------------------------------------------

  public func listJobs(jobs : List.List<Job>) : [Job] {
    jobs.toArray();
  };

  public func listJobsByCategory(
    jobs : List.List<Job>,
    category : Common.RewardType,
  ) : [Job] {
    jobs.filter(func(j : Job) : Bool { j.category == category }).toArray();
  };

  public func getJob(jobs : List.List<Job>, id : Nat) : ?Job {
    jobs.find(func(j : Job) : Bool { j.id == id });
  };

  // --- Tasks ---------------------------------------------------------------

  public func toTaskView(self : Task) : TaskView {
    {
      id = self.id;
      jobId = self.jobId;
      owner = self.owner.toText();
      status = self.status;
      reward = self.reward;
      category = self.category;
      createdAt = self.createdAt;
    };
  };

  public func listTasksFor(
    tasks : List.List<Task>,
    owner : Principal,
  ) : [TaskView] {
    tasks
      .filter(func(t : Task) : Bool { Principal.equal(t.owner, owner) })
      .map<Task, TaskView>(func(t : Task) : TaskView = toTaskView(t))
      .toArray();
  };

  public func getTaskView(
    tasks : List.List<Task>,
    owner : Principal,
    id : Nat,
  ) : ?TaskView {
    switch (
      tasks.find(func(t : Task) : Bool {
        t.id == id and Principal.equal(t.owner, owner);
      })
    ) {
      case (?t) ?toTaskView(t);
      case null null;
    };
  };

  // Creates a new pending task for the caller from a job. Returns null if the
  // job does not exist. Does NOT mutate the wallet — reward is credited on
  // completion (see completeTask).
  public func takeTask(
    tasks : List.List<Task>,
    jobs : List.List<Job>,
    nextTaskId : { var next : Nat },
    owner : Principal,
    jobId : Nat,
    now : Common.Timestamp,
  ) : ?TaskView {
    switch (jobs.find(func(j : Job) : Bool { j.id == jobId })) {
      case (?job) {
        let id = nextTaskId.next;
        nextTaskId.next := nextTaskId.next + 1;
        let task : Task = {
          id;
          jobId = job.id;
          owner;
          var status = #pending;
          reward = job.reward;
          category = job.category;
          createdAt = now;
        };
        tasks.add(task);
        ?toTaskView(task);
      };
      case null null;
    };
  };

  // Marks a task as diterima (accepted/completed). Only mutates local task
  // state — the caller's wallet and history are updated by the mixin so this
  // helper stays single-purpose. Returns null if the task is not owned by
  // `owner` or does not exist.
  public func completeTask(
    tasks : List.List<Task>,
    owner : Principal,
    id : Nat,
  ) : ?TaskView {
    switch (
      tasks.find(func(t : Task) : Bool {
        t.id == id and Principal.equal(t.owner, owner);
      })
    ) {
      case (?t) {
        t.status := #diterima;
        ?toTaskView(t);
      };
      case null null;
    };
  };

  // --- Activity history ----------------------------------------------------

  public func toHistoryView(self : ActivityHistory) : ActivityHistoryView {
    {
      id = self.id;
      owner = self.owner.toText();
      kind = self.kind;
      title = self.title;
      amount = self.amount;
      at = self.at;
    };
  };

  public func listHistoryFor(
    history : List.List<ActivityHistory>,
    owner : Principal,
  ) : [ActivityHistoryView] {
    history
      .filter(func(h : ActivityHistory) : Bool {
        Principal.equal(h.owner, owner);
      })
      .map<ActivityHistory, ActivityHistoryView>(func(h : ActivityHistory) : ActivityHistoryView = toHistoryView(h))
      .toArray();
  };

  public func listHistoryByKind(
    history : List.List<ActivityHistory>,
    owner : Principal,
    kind : Common.ActivityType,
  ) : [ActivityHistoryView] {
    history
      .filter(func(h : ActivityHistory) : Bool {
        Principal.equal(h.owner, owner) and h.kind == kind;
      })
      .map<ActivityHistory, ActivityHistoryView>(func(h : ActivityHistory) : ActivityHistoryView = toHistoryView(h))
      .toArray();
  };

  public func recordActivity(
    history : List.List<ActivityHistory>,
    nextHistoryId : { var next : Nat },
    owner : Principal,
    kind : Common.ActivityType,
    title : Text,
    amount : Nat,
    now : Common.Timestamp,
  ) : () {
    let id = nextHistoryId.next;
    nextHistoryId.next := nextHistoryId.next + 1;
    history.add({
      id;
      owner;
      kind;
      title;
      amount;
      at = now;
    });
  };

  // --- Wallet --------------------------------------------------------------

  public func toWalletView(self : Wallet) : WalletView {
    {
      owner = self.owner.toText();
      rewardEmailKhusus = self.rewardEmailKhusus;
      rewardEmailBebas = self.rewardEmailBebas;
      total = self.rewardEmailKhusus + self.rewardEmailBebas;
    };
  };

  // Returns the caller's wallet, creating an empty one on first access so the
  // Saldo screen always has a view to render.
  public func getWalletView(
    wallets : Map.Map<Principal, Wallet>,
    owner : Principal,
  ) : WalletView {
    switch (wallets.get(owner)) {
      case (?w) toWalletView(w);
      case null {
        let w : Wallet = {
          owner;
          var rewardEmailKhusus = 0;
          var rewardEmailBebas = 0;
        };
        wallets.add(owner, w);
        toWalletView(w);
      };
    };
  };

  // Credits a reward into the matching bucket, creating the wallet on first
  // access. Used by completeTask to pay out a finished task.
  public func addReward(
    wallets : Map.Map<Principal, Wallet>,
    owner : Principal,
    category : Common.RewardType,
    amount : Nat,
  ) : () {
    let w = switch (wallets.get(owner)) {
      case (?existing) existing;
      case null {
        let fresh : Wallet = {
          owner;
          var rewardEmailKhusus = 0;
          var rewardEmailBebas = 0;
        };
        wallets.add(owner, fresh);
        fresh;
      };
    };
    switch (category) {
      case (#emailKhusus) {
        w.rewardEmailKhusus := w.rewardEmailKhusus + amount;
      };
      case (#emailBebas) {
        w.rewardEmailBebas := w.rewardEmailBebas + amount;
      };
    };
  };

  // --- Withdrawals ---------------------------------------------------------

  public func toWithdrawalView(self : Withdrawal) : WithdrawalView {
    {
      id = self.id;
      owner = self.owner.toText();
      nominal = self.nominal;
      method = self.method;
      status = self.status;
      at = self.at;
    };
  };

  public func listWithdrawalsFor(
    withdrawals : List.List<Withdrawal>,
    owner : Principal,
  ) : [WithdrawalView] {
    withdrawals
      .filter(func(w : Withdrawal) : Bool {
        Principal.equal(w.owner, owner);
      })
      .map<Withdrawal, WithdrawalView>(func(w : Withdrawal) : WithdrawalView = toWithdrawalView(w))
      .toArray();
  };

  // Creates a dummy withdrawal record in #diajukan state. Does NOT move funds
  // and does NOT debit the wallet — this is demo-only per the spec.
  public func requestWithdrawal(
    withdrawals : List.List<Withdrawal>,
    nextWithdrawalId : { var next : Nat },
    owner : Principal,
    nominal : Nat,
    method : Text,
    now : Common.Timestamp,
  ) : WithdrawalView {
    let id = nextWithdrawalId.next;
    nextWithdrawalId.next := nextWithdrawalId.next + 1;
    let w : Withdrawal = {
      id;
      owner;
      nominal;
      method;
      var status = #diajukan;
      at = now;
    };
    withdrawals.add(w);
    toWithdrawalView(w);
  };

  // --- Leaderboard ---------------------------------------------------------

  // The leaderboard is a static dummy record supplied by the migration; this
  // just returns it as-is.
  public func getLeaderboard(
    leaderboard : LeaderboardPeriod,
  ) : LeaderboardPeriod {
    leaderboard;
  };
};
