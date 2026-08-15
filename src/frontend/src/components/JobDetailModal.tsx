import { rewardTypeLabel } from "@/components/JobFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTakeJob } from "@/hooks/useBackend";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Job } from "@/types";
import { CheckCircle2, Coins, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface JobDetailModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaken?: (jobId: bigint) => void;
}

/**
 * Detail modal for a single job.
 *
 * Shows the full title, category badge, complete description, and reward.
 * The "Ambil Job" button calls the `takeJob` mutation; on success it shows
 * an inline confirmation state and notifies the parent so the list can
 * refresh. Closes on Escape, backdrop click, or the close button.
 */
export function JobDetailModal({
  job,
  open,
  onOpenChange,
  onTaken,
}: JobDetailModalProps) {
  const takeJob = useTakeJob();
  const [done, setDone] = useState(false);

  // Reset the success state whenever the modal is opened.
  useEffect(() => {
    if (open) setDone(false);
  }, [open]);

  const handleTake = async () => {
    if (!job) return;
    try {
      await takeJob.mutateAsync(job.id);
      setDone(true);
      onTaken?.(job.id);
    } catch {
      // Error surfaced via mutation.error below.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="job.detail.modal"
        className="max-w-md gap-0 rounded-[24px] border-border bg-card p-0"
      >
        {/* Gradient header band */}
        <div className="relative overflow-hidden rounded-t-[24px] bg-gradient-primary px-5 py-6 text-primary-foreground">
          <div
            className="absolute inset-0 bg-gradient-glow opacity-60"
            aria-hidden
          />
          <div className="relative space-y-2">
            <Badge
              variant="secondary"
              data-ocid="job.detail.badge"
              className="rounded-full bg-white/20 text-primary-foreground backdrop-blur-sm"
            >
              {job ? rewardTypeLabel(job.category) : ""}
            </Badge>
            <DialogTitle
              data-ocid="job.detail.title"
              className="font-display text-xl font-bold leading-snug text-primary-foreground"
            >
              {job?.title ?? ""}
            </DialogTitle>
          </div>
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>Detail Job</DialogTitle>
          <DialogDescription>
            Informasi lengkap job dan tombol untuk mengambil job.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-5 px-5 py-5">
          {/* Reward highlight */}
          <div
            data-ocid="job.detail.reward"
            className="flex items-center gap-3 rounded-2xl border border-border bg-gradient-subtle p-4"
          >
            <span
              className="flex size-11 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
              aria-hidden
            >
              <Coins className="size-5" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Reward yang didapat
              </span>
              <span className="text-gradient-primary font-display text-2xl font-bold leading-tight">
                {job ? formatRupiah(job.reward) : "Rp 0"}
              </span>
            </div>
          </div>

          {/* Full description */}
          <div className="space-y-2">
            <h4 className="font-display text-sm font-semibold text-foreground">
              Deskripsi Job
            </h4>
            <p
              data-ocid="job.detail.description"
              className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground"
            >
              {job?.description ?? ""}
            </p>
          </div>

          {/* Error / success messaging */}
          {takeJob.isError && (
            <p
              data-ocid="job.detail.error"
              role="alert"
              className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              Gagal mengambil job. Coba lagi sebentar lagi.
            </p>
          )}
          {done && (
            <output
              data-ocid="job.detail.success"
              className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary"
            >
              <CheckCircle2 className="size-4 shrink-0" aria-hidden />
              <span>Job berhasil diambil. Lihat di tab Tugas.</span>
            </output>
          )}
        </div>

        {/* Footer action */}
        <div className="flex gap-2 border-t border-border px-5 py-4">
          <Button
            type="button"
            variant="outline"
            data-ocid="job.detail.close_button"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl"
            disabled={takeJob.isPending}
          >
            Tutup
          </Button>
          <Button
            type="button"
            data-ocid="job.detail.take_button"
            onClick={handleTake}
            disabled={takeJob.isPending || done}
            className={cn(
              "flex-[2] rounded-xl bg-gradient-primary text-primary-foreground shadow-glow",
              "hover:opacity-90",
            )}
          >
            {takeJob.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Mengambil…
              </>
            ) : done ? (
              <>
                <CheckCircle2 className="size-4" aria-hidden />
                Diambil
              </>
            ) : (
              "Ambil Job"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
