import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import _OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";
import ListEntity "mo:caffeineai-oql/ListEntity";
import Types "types/freelancecuan";
import Common "types/common";
import FreelancecuanApi "mixins/freelancecuan-api";

actor {
  // --- Authorization (Internet Identity SSO) ------------------------------
  // Type-only: initial value comes from the migration chain.
  let accessControlState : AccessControl.AccessControlState;

  // --- Freelancecuan domain state -----------------------------------------
  // All type-only; initial values come from the migration chain.
  let profiles : Map.Map<Principal, Types.UserProfile>;
  let jobs : List.List<Types.Job>;
  let tasks : List.List<Types.Task>;
  let history : List.List<Types.ActivityHistory>;
  let wallets : Map.Map<Principal, Types.Wallet>;
  let withdrawals : List.List<Types.Withdrawal>;

  // Mutable counters wrapped in records so mixins share them by reference.
  let nextTaskId : { var next : Nat };
  let nextHistoryId : { var next : Nat };
  let nextWithdrawalId : { var next : Nat };

  // Static dummy leaderboard (immutable record, supplied by migration).
  let leaderboard : Types.LeaderboardPeriod;

  // --- Internet Identity SSO with verified-email capture ------------------
  // The callback stores the verified email (II's verified_email) into the
  // caller's profile. It runs once per sign-in, after attribute verification.
  include MixinAuthorization(
    accessControlState,
    ?(func(caller : Principal, attrs : { name : ?Text; email : ?Text; sso : ?Text }) {
      // Capture II's verified_email into the caller's profile. The helper
      // creates the profile on first sign-in so the email is persisted before
      // the user ever opens the Profil screen.
      _freelancecuan_recordEmail(caller, attrs.email);
    }),
  );

  // --- Freelancecuan public API -------------------------------------------
  include FreelancecuanApi(
    accessControlState,
    profiles,
    jobs,
    tasks,
    history,
    wallets,
    withdrawals,
    nextTaskId,
    nextHistoryId,
    nextWithdrawalId,
    leaderboard,
  );

  // --- OQL: expose domain collections to the Data Intelligence agent ------
  // Auth levels: jobs/leaderboard are public catalogue data; tasks/history/
  // wallets/withdrawals are per-user (scoped). Profiles back auth + email only
  // and are intentionally not exposed as an entity.

  // Variant → Text sentinels for OQL manual-mode payloads. One Value variant
  // per field keeps the reported schema type stable across rows. Defined
  // before the Expose block that references them (Motoko requires definition
  // before use inside an actor body).
  func rewardTypeText(r : Common.RewardType) : Text {
    switch r { case (#emailKhusus) "emailKhusus"; case (#emailBebas) "emailBebas" };
  };
  func taskStatusText(s : Common.TaskStatus) : Text {
    switch s { case (#pending) "pending"; case (#diterima) "diterima" };
  };
  func activityTypeText(k : Common.ActivityType) : Text {
    switch k { case (#job) "job"; case (#tugas) "tugas"; case (#penarikan) "penarikan" };
  };
  func withdrawalStatusText(s : Common.WithdrawalStatus) : Text {
    switch s { case (#diajukan) "diajukan"; case (#diproses) "diproses"; case (#selesai) "selesai" };
  };

  include Expose({
    entities = [
      // jobs: public catalogue. Manual mode because `category` is a variant
      // (RewardType) with no built-in _toRow.
      jobs.toEntityManual("job", "Job", "id")
        .payload("id", func j = j.id)
        .payload("title", func j = j.title)
        .payload("description", func j = j.description)
        .payload("reward", func j = j.reward)
        .payload("category", func j = rewardTypeText(j.category))
        .public_()
        .build(),
      // tasks: per-user. Manual mode because `status` is a var variant field.
      tasks.toEntityManual("task", "Task", "id")
        .payload("id", func t = t.id)
        .payload("jobId", func t = t.jobId)
        .payload("owner", func t = t.owner)
        .payload("status", func t = taskStatusText(t.status))
        .payload("reward", func t = t.reward)
        .payload("category", func t = rewardTypeText(t.category))
        .payload("createdAt", func t = t.createdAt)
        .ownedBy("owner")
        .scopedPerUser()
        .build(),
      // history: per-user. Manual mode because `kind` is a variant.
      history.toEntityManual("activityHistory", "ActivityHistory", "id")
        .payload("id", func h = h.id)
        .payload("owner", func h = h.owner)
        .payload("kind", func h = activityTypeText(h.kind))
        .payload("title", func h = h.title)
        .payload("amount", func h = h.amount)
        .payload("at", func h = h.at)
        .ownedBy("owner")
        .scopedPerUser()
        .build(),
      // withdrawals: per-user. Manual mode because `status` is a var variant.
      withdrawals.toEntityManual("withdrawal", "Withdrawal", "id")
        .payload("id", func w = w.id)
        .payload("owner", func w = w.owner)
        .payload("nominal", func w = w.nominal)
        .payload("method", func w = w.method)
        .payload("status", func w = withdrawalStatusText(w.status))
        .payload("at", func w = w.at)
        .ownedBy("owner")
        .scopedPerUser()
        .build(),
    ];
  });
};
