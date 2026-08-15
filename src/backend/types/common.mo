module {
  // Nanoseconds since epoch (Time.now()).
  public type Timestamp = Nat;

  // Job / task reward category. Matches the UI labels in Bahasa Indonesia.
  public type RewardType = {
    #emailKhusus; // "Email Khusus"
    #emailBebas; // "Email Bebas"
  };

  // Lifecycle of a task the user picked up from the Job board.
  public type TaskStatus = {
    #pending; // taken, not yet submitted
    #diterima; // accepted / completed
  };

  // High-level kind of a history entry, used by the Riwayat filter.
  public type ActivityType = {
    #job; // took a job
    #tugas; // submitted / accepted a task
    #penarikan; // dummy withdrawal request
  };

  // Status of a dummy withdrawal request (never actually paid out).
  public type WithdrawalStatus = {
    #diajukan; // submitted
    #diproses; // processing (dummy)
    #selesai; // completed (dummy)
  };
};
