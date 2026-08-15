import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompleteTask } from "@/hooks/useBackend";
import { formatDateTime, formatRupiah, shortPrincipal } from "@/lib/format";
import { REWARD_TYPE_LABEL, TASK_STATUS_LABEL } from "@/types";
import type { TaskStatus, TaskView } from "@/types";
import { CheckCircle2, Clock, Coins, Hash, Mail, User } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

/**
 * Status badge shared with TaskCard but inline-styled for the modal header.
 * Pending = amber, Diterima = emerald.
 */
function StatusBadge({ status }: { status: TaskStatus }) {
  const label = TASK_STATUS_LABEL[status] ?? status;
  if (status === "diterima") {
    return (
      <Badge className="border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
        {label}
      </Badge>
    );
  }
  return (
    <Badge className="border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
      {label}
    </Badge>
  );
}

/** Detail row inside the modal body. */
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-muted-foreground/80">{icon}</span>
        {label}
      </div>
      <div className="text-right text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  );
}

/** Static, category-aware instructions shown in the modal. */
function instructionsFor(task: TaskView): string {
  if (task.category === "emailKhusus") {
    return [
      "1. Buka email khusus yang sudah disediakan oleh sistem.",
      "2. Baca seluruh instruksi pengerjaan pada email tersebut.",
      "3. Kerjakan tugas sesuai panduan dan jaga kualitas hasil.",
      "4. Pastikan hasil pengerjaan sesuai dengan kriteria yang diminta.",
      "5. Tandai tugas ini selesai setelah seluruh langkah dirampungkan.",
    ].join("\n");
  }
  return [
    "1. Gunakan email bebas Anda untuk mengerjakan tugas ini.",
    "2. Ikuti instruksi pada job terkait secara menyeluruh.",
    "3. Pastikan seluruh langkah pengerjaan diselesaikan dengan benar.",
    "4. Simpan bukti pengerjaan jika diperlukan untuk verifikasi.",
    "5. Tandai tugas ini selesai setelah seluruh langkah dirampungkan.",
  ].join("\n");
}

/**
 * TaskDetailModal — shows task instructions and a "Tandai Selesai" action.
 *
 * The complete button only appears for pending tasks and calls the
 * `useCompleteTask` mutation. On success it shows a toast and closes.
 */
export function TaskDetailModal({
  task,
  open,
  onOpenChange,
}: {
  task: TaskView | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const completeMutation = useCompleteTask();
  const isPending = task?.status === "pending";

  if (!task) {
    return null;
  }

  const categoryLabel = REWARD_TYPE_LABEL[task.category] ?? task.category;

  function handleComplete() {
    if (!task) return;
    completeMutation.mutate(task.id, {
      onSuccess: (updated) => {
        toast.success("Tugas ditandai selesai", {
          description: `Reward ${formatRupiah(task.reward)} telah ditambahkan ke saldo Anda.`,
        });
        onOpenChange(false);
        // Touch updated to satisfy linters that expect usage; value is informational.
        void updated;
      },
      onError: (err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Gagal menandai tugas selesai.";
        toast.error("Gagal menandai selesai", { description: message });
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="tugas.detail.modal"
        className="max-w-md gap-0 rounded-3xl border-border/80 p-0 sm:max-w-md"
      >
        {/* Gradient header */}
        <div className="bg-gradient-primary rounded-t-3xl px-5 pb-5 pt-5 text-white">
          <DialogHeader className="gap-2 text-left">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="font-display text-lg font-bold text-white">
                Tugas {categoryLabel}
              </DialogTitle>
              <StatusBadge status={task.status} />
            </div>
            <DialogDescription className="text-white/80">
              Detail pengerjaan tugas Anda.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-5">
          {/* Reward highlight */}
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-subtle px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Coins className="size-4 text-primary" />
              Reward
            </div>
            <span className="font-display text-xl font-bold text-gradient-primary">
              {formatRupiah(task.reward)}
            </span>
          </div>

          {/* Metadata grid */}
          <div className="divide-y divide-border/60 rounded-2xl border border-border/60 px-4">
            <DetailRow
              icon={<Mail className="size-4" />}
              label="Kategori"
              value={categoryLabel}
            />
            <DetailRow
              icon={<Hash className="size-4" />}
              label="Job"
              value={`#${task.jobId.toString()}`}
            />
            <DetailRow
              icon={<User className="size-4" />}
              label="Pemilik"
              value={shortPrincipal(task.owner)}
            />
            <DetailRow
              icon={<Clock className="size-4" />}
              label="Dibuat"
              value={formatDateTime(task.createdAt)}
            />
          </div>

          {/* Instructions */}
          <div>
            <h4 className="mb-2 font-display text-sm font-semibold text-foreground">
              Instruksi Pengerjaan
            </h4>
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
              <pre
                className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground/90"
                data-ocid="tugas.detail.instructions"
              >
                {instructionsFor(task)}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="gap-2 border-t border-border/60 px-5 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            data-ocid="tugas.detail.close_button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Tutup
          </Button>
          {isPending && (
            <Button
              type="button"
              data-ocid="tugas.detail.complete_button"
              onClick={handleComplete}
              disabled={completeMutation.isPending}
              className="min-w-40 rounded-xl bg-gradient-primary text-white shadow-glow hover:opacity-90"
            >
              <CheckCircle2 className="size-4" />
              {completeMutation.isPending ? "Menandai…" : "Tandai Selesai"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
