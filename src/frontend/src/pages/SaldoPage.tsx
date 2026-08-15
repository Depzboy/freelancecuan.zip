import { WalletSummary } from "@/components/WalletSummary";
import { WithdrawalHistory } from "@/components/WithdrawalHistory";
import { WithdrawalModal } from "@/components/WithdrawalModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyWallet, useMyWithdrawals } from "@/hooks/useBackend";
import { AlertCircle, HandCoins } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

/**
 * SaldoPage
 *
 * Composes the wallet summary (with "Tarik Saldo" button), the withdrawal
 * modal, and the withdrawal history. All copy is in Indonesian and the
 * layout is mobile-first with rounded cards (16–24px).
 */
export function SaldoPage() {
  const walletQuery = useMyWallet();
  const withdrawalsQuery = useMyWithdrawals();
  const [modalOpen, setModalOpen] = useState(false);

  const wallet = walletQuery.data ?? null;
  const withdrawals = withdrawalsQuery.data ?? [];
  const walletError = walletQuery.isError;
  const withdrawalsError = withdrawalsQuery.isError;

  return (
    <motion.div
      data-ocid="saldo.page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Saldo
        </h1>
        <Button
          size="lg"
          className="rounded-xl bg-gradient-primary px-5 text-primary-foreground shadow-glow hover:opacity-90"
          onClick={() => setModalOpen(true)}
          disabled={walletQuery.isLoading || !wallet || wallet.total <= 0n}
          data-ocid="saldo.open_modal_button"
        >
          <HandCoins className="size-4" />
          Tarik Saldo
        </Button>
      </div>

      {/* Wallet summary (or skeleton / error) */}
      {walletError ? (
        <Alert
          data-ocid="saldo.summary.error_state"
          variant="destructive"
          className="rounded-2xl"
        >
          <AlertCircle className="size-4" />
          <AlertTitle>Gagal memuat saldo</AlertTitle>
          <AlertDescription>
            Tidak dapat mengambil data saldo. Coba muat ulang halaman.
          </AlertDescription>
        </Alert>
      ) : walletQuery.isLoading || !wallet ? (
        <WalletSummarySkeleton />
      ) : (
        <WalletSummary wallet={wallet} />
      )}

      {/* Withdrawal history */}
      {withdrawalsError ? (
        <Alert
          data-ocid="saldo.history.error_state"
          variant="destructive"
          className="rounded-2xl"
        >
          <AlertCircle className="size-4" />
          <AlertTitle>Gagal memuat riwayat</AlertTitle>
          <AlertDescription>
            Tidak dapat mengambil riwayat penarikan.
          </AlertDescription>
        </Alert>
      ) : (
        <WithdrawalHistory
          withdrawals={withdrawals}
          isLoading={withdrawalsQuery.isLoading}
        />
      )}

      {/* Withdrawal modal (dummy — no real payment) */}
      <WithdrawalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        wallet={wallet}
      />
    </motion.div>
  );
}

/** Layout-matched skeleton for the wallet summary card. */
function WalletSummarySkeleton() {
  return (
    <div
      data-ocid="saldo.summary.loading_state"
      className="space-y-5 rounded-3xl bg-gradient-primary p-6 shadow-glow"
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 bg-white/30" />
        <Skeleton className="h-10 w-48 bg-white/30" />
        <Skeleton className="h-3 w-40 bg-white/20" />
      </div>
      <div className="space-y-3 rounded-2xl bg-white/10 p-4">
        <Skeleton className="h-3 w-24 bg-white/30" />
        <Skeleton className="h-4 w-full bg-white/20" />
        <Skeleton className="h-4 w-full bg-white/20" />
        <div className="my-1 h-px bg-white/20" />
        <Skeleton className="h-5 w-full bg-white/30" />
      </div>
    </div>
  );
}
