// Init migration: introduces stable state for the freelancecuan domain.
// OldActor = {} because this is the first migration in the chain (fresh canister).
// All initial values are produced here; the actor body declares fields type-only.
import Map "mo:core/Map";
import List "mo:core/List";

module {
  // Inlined old types — empty canister, no prior stable fields.
  type OldActor = {};

  // Inlined new types — must match main.mo's stable fields exactly.
  // AccessControl.AccessControlState shape (inlined; no project imports allowed).
  type UserRole = { #admin; #user; #guest };
  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };
  type RewardType = { #emailKhusus; #emailBebas };
  type TaskStatus = { #pending; #diterima };
  type ActivityType = { #job; #tugas; #penarikan };
  type WithdrawalStatus = { #diajukan; #diproses; #selesai };
  type UserProfile = {
    principal : Principal;
    var name : Text;
    var email : ?Text;
    var role : RewardType;
  };
  type Job = {
    id : Nat;
    title : Text;
    description : Text;
    reward : Nat;
    category : RewardType;
  };
  type Task = {
    id : Nat;
    jobId : Nat;
    owner : Principal;
    var status : TaskStatus;
    reward : Nat;
    category : RewardType;
    createdAt : Nat;
  };
  type ActivityHistory = {
    id : Nat;
    owner : Principal;
    kind : ActivityType;
    title : Text;
    amount : Nat;
    at : Nat;
  };
  type Wallet = {
    owner : Principal;
    var rewardEmailKhusus : Nat;
    var rewardEmailBebas : Nat;
  };
  type Withdrawal = {
    id : Nat;
    owner : Principal;
    nominal : Nat;
    method : Text;
    var status : WithdrawalStatus;
    at : Nat;
  };
  type LeaderboardEntry = { rank : Nat; username : Text; score : Nat };
  type LeaderboardPeriod = {
    periodLabel : Text;
    prizes : [Nat];
    entries : [LeaderboardEntry];
  };
  type NewActor = {
    accessControlState : AccessControlState;
    profiles : Map.Map<Principal, UserProfile>;
    jobs : List.List<Job>;
    tasks : List.List<Task>;
    history : List.List<ActivityHistory>;
    wallets : Map.Map<Principal, Wallet>;
    withdrawals : List.List<Withdrawal>;
    nextTaskId : { var next : Nat };
    nextHistoryId : { var next : Nat };
    nextWithdrawalId : { var next : Nat };
    leaderboard : LeaderboardPeriod;
  };

  public func migration(old : OldActor) : NewActor {
    ignore old;
    {
      accessControlState = {
        var adminAssigned = false;
        userRoles = Map.empty();
      };
      profiles = Map.empty();
      // Static dummy job board per spec. Two categories (Email Khusus /
      // Email Bebas) with a few listings each. Rewards in Rupiah (Nat).
      jobs = List.fromArray([
        { id = 1; title = "Baca email promo brand A"; description = "Buka email promo dari brand A dan konfirmasi pembacaan."; reward = 100; category = #emailKhusus },
        { id = 2; title = "Baca email newsletter brand B"; description = "Buka email newsletter dari brand B."; reward = 100; category = #emailKhusus },
        { id = 3; title = "Klik link promo brand C"; description = "Buka email lalu klik link promo di dalamnya."; reward = 100; category = #emailKhusus },
        { id = 4; title = "Verifikasi email bebas brand D"; description = "Gunakan email bebas Anda untuk verifikasi pendaftaran."; reward = 100; category = #emailBebas },
        { id = 5; title = "Baca email bebas brand E"; description = "Buka email bebas dari brand E."; reward = 100; category = #emailBebas },
        { id = 6; title = "Survei via email bebas brand F"; description = "Isi survei singkat yang dikirim ke email bebas Anda."; reward = 100; category = #emailBebas },
      ]);
      tasks = List.empty();
      history = List.empty();
      wallets = Map.empty();
      withdrawals = List.empty();
      nextTaskId = { var next = 1 };
      nextHistoryId = { var next = 1 };
      nextWithdrawalId = { var next = 1 };
      // Static dummy leaderboard per spec: "Periode 10 Agt - 16 Agt 2026",
      // prizes Juara 1 Rp 75.000, Juara 2 Rp 50.000, Juara 3 Rp 25.000,
      // and 10 ranked entries with dummy usernames and scores.
      leaderboard = {
        periodLabel = "Periode 10 Agt - 16 Agt 2026";
        prizes = [75000, 50000, 25000];
        entries = [
          { rank = 1; username = "Rina"; score = 12500 },
          { rank = 2; username = "Budi"; score = 11200 },
          { rank = 3; username = "Sari"; score = 9800 },
          { rank = 4; username = "Andi"; score = 8400 },
          { rank = 5; username = "Dewi"; score = 7600 },
          { rank = 6; username = "Eko"; score = 6900 },
          { rank = 7; username = "Fitri"; score = 5800 },
          { rank = 8; username = "Gilang"; score = 4900 },
          { rank = 9; username = "Hana"; score = 3700 },
          { rank = 10; username = "Irfan"; score = 2400 },
        ];
      };
    };
  };
};
