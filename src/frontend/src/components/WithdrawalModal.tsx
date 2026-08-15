import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequestWithdrawal } from "@/hooks/useBackend";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { WalletView } from "@/types";
import { Loader2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * WithdrawalModal
 *
 * Modal with a dummy withdrawal form: nominal (number input) and metode
 * (dropdown: Bank Transfer, E-Wallet, etc.). The "Ajukan Penarikan" button
 * calls the `requestWithdrawal` mutation. This is a demo — no real payment
 * is processed.
 *
 * The dialog is controlled: the parent owns the `open` state so the
 * "Tarik Saldo" button on the page can launch it.
 */

const WITHDRAWAL_METHODS = [
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "e-wallet", label: "E-Wallet" },
  { value: "dana", label: "DANA" },
  { value: "gopay", label: "GoPay" },
  { value: "ovo", label: "OVO" },
  { value: "shopeepay", label: "ShopeePay" },
  { value: "qris", label: "QRIS" },
] as const;

const MIN_WITHDRAWAL = 10_000n;

interface WithdrawalFormValues {
  nominal: string;
  method: string;
}

interface FieldErrors {
  nominal?: string;
  method?: string;
}

export function WithdrawalModal({
  open,
  onOpenChange,
  wallet,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: WalletView | null;
}) {
  const requestWithdrawal = useRequestWithdrawal();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [values, setValues] = useState<WithdrawalFormValues>({
    nominal: "",
    method: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const available = wallet?.total ?? 0n;

  // Reset the form whenever the modal closes so a reopen starts clean.
  useEffect(() => {
    if (!open) {
      setValues({ nominal: "", method: "" });
      setErrors({});
      setSubmitError(null);
    }
  }, [open]);

  const validate = (vals: WithdrawalFormValues): FieldErrors => {
    const next: FieldErrors = {};
    const trimmed = vals.nominal.trim();
    if (trimmed === "") {
      next.nominal = "Nominal wajib diisi";
    } else if (!/^\d+$/.test(trimmed)) {
      next.nominal = "Nominal harus berupa angka";
    } else {
      const nominal = BigInt(trimmed);
      if (nominal <= 0n) {
        next.nominal = "Nominal harus lebih dari 0";
      } else if (nominal < MIN_WITHDRAWAL) {
        next.nominal = `Minimal penarikan ${formatRupiah(MIN_WITHDRAWAL)}`;
      } else if (nominal > available) {
        next.nominal = "Nominal melebihi saldo tersedia";
      }
    }
    if (!vals.method) {
      next.method = "Pilih metode penarikan";
    }
    return next;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }
    setSubmitError(null);
    try {
      const nominal = BigInt(values.nominal);
      const methodLabel =
        WITHDRAWAL_METHODS.find((m) => m.value === values.method)?.label ??
        values.method;
      await requestWithdrawal.mutateAsync({
        nominal,
        method: methodLabel,
      });
      toast.success("Penarikan diajukan", {
        description: `${formatRupiah(nominal)} via ${methodLabel} sedang diproses.`,
      });
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengajukan penarikan.";
      setSubmitError(message);
      toast.error("Gagal mengajukan penarikan", { description: message });
    }
  };

  const isPending = requestWithdrawal.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="saldo.withdrawal.modal"
        className="max-w-md rounded-3xl"
      >
        <DialogHeader>
          <div
            className="flex size-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow"
            aria-hidden
          >
            <Wallet className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold">
            Tarik Saldo
          </DialogTitle>
          <DialogDescription>
            Ajukan penarikan saldo. Saldo tersedia:{" "}
            <span className="font-semibold text-foreground">
              {formatRupiah(available)}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {/* Nominal */}
          <div className="space-y-2">
            <Label htmlFor="withdrawal-nominal">Nominal (Rp)</Label>
            <Input
              id="withdrawal-nominal"
              type="number"
              inputMode="numeric"
              min={Number(MIN_WITHDRAWAL)}
              step={1000}
              placeholder="Contoh: 50000"
              aria-invalid={!!errors.nominal}
              data-ocid="saldo.withdrawal.input.nominal"
              className={cn(
                "h-11 rounded-xl",
                errors.nominal && "border-destructive",
              )}
              value={values.nominal}
              onChange={(e) =>
                setValues((v) => ({ ...v, nominal: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Minimal {formatRupiah(MIN_WITHDRAWAL)} per penarikan.
            </p>
            {errors.nominal && (
              <p
                data-ocid="saldo.withdrawal.error.nominal"
                className="text-xs font-medium text-destructive"
              >
                {errors.nominal}
              </p>
            )}
          </div>

          {/* Metode */}
          <div className="space-y-2">
            <Label htmlFor="withdrawal-method">Metode Penarikan</Label>
            <Select
              value={values.method}
              onValueChange={(v) => setValues((val) => ({ ...val, method: v }))}
            >
              <SelectTrigger
                id="withdrawal-method"
                data-ocid="saldo.withdrawal.select.method"
                aria-invalid={!!errors.method}
                className={cn(
                  "h-11 w-full rounded-xl",
                  errors.method && "border-destructive",
                )}
              >
                <SelectValue placeholder="Pilih metode penarikan" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {WITHDRAWAL_METHODS.map((m) => (
                  <SelectItem
                    key={m.value}
                    value={m.value}
                    data-ocid={`saldo.withdrawal.method.${m.value}`}
                  >
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.method && (
              <p
                data-ocid="saldo.withdrawal.error.method"
                className="text-xs font-medium text-destructive"
              >
                {errors.method}
              </p>
            )}
          </div>

          {submitError && (
            <p
              data-ocid="saldo.withdrawal.error.submit"
              className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
            >
              {submitError}
            </p>
          )}

          <DialogFooter className="flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              data-ocid="saldo.withdrawal.cancel_button"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="lg"
              className="flex-1 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
              disabled={isPending}
              data-ocid="saldo.withdrawal.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Mengajukan…
                </>
              ) : (
                "Ajukan Penarikan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
