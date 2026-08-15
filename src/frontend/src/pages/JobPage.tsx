import { JobCard } from "@/components/JobCard";
import { JobDetailModal } from "@/components/JobDetailModal";
import { JobFilter, useJobFilterValue } from "@/components/JobFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs, useJobsByCategory } from "@/hooks/useBackend";
import type { Job } from "@/types";
import { Briefcase } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

/**
 * Job page — list of available jobs with category filtering.
 *
 * Filter state lives in the URL search param `kategori` (managed by
 * JobFilter) so it persists across refresh. When a category is selected,
 * the page queries `useJobsByCategory`; otherwise it queries `useJobs`
 * (all jobs). Clicking a card opens a detail modal with an "Ambil Job"
 * action that calls the `takeJob` mutation.
 */
export function JobPage() {
  const filter = useJobFilterValue();
  const isAll = filter === "semua";

  const allQuery = useJobs();
  const byCategoryQuery = useJobsByCategory(isAll ? null : filter);

  const query = isAll ? allQuery : byCategoryQuery;
  const jobs: Job[] = query.data ?? [];

  const [selected, setSelected] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openDetail = (job: Job) => {
    setSelected(job);
    setModalOpen(true);
  };

  const handleTaken = () => {
    // Close the modal shortly after the success state is shown so the
    // user sees the confirmation, then return to the refreshed list.
    setTimeout(() => setModalOpen(false), 1200);
  };

  const isLoading = query.isLoading;
  const isEmpty = !isLoading && jobs.length === 0;

  return (
    <motion.div
      data-ocid="job.page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Page heading */}
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Job Tersedia
        </h1>
        <p className="text-sm text-muted-foreground">
          Pilih job dan ambil untuk mulai mengumpulkan reward.
        </p>
      </div>

      {/* Category filter (URL-persisted) */}
      <JobFilter />

      {/* Loading skeletons */}
      {isLoading && (
        <div data-ocid="job.loading_state" className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-[20px] border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-28" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div
          data-ocid="job.empty_state"
          className="flex flex-col items-center gap-3 rounded-[24px] border border-dashed border-border bg-card px-6 py-12 text-center"
        >
          <span
            className="flex size-14 items-center justify-center rounded-full bg-gradient-subtle text-muted-foreground"
            aria-hidden
          >
            <Briefcase className="size-7" />
          </span>
          <div className="space-y-1">
            <p className="font-display text-base font-semibold text-foreground">
              Belum ada job tersedia
            </p>
            <p className="text-sm text-muted-foreground">
              Coba kategori lain atau kembali lagi nanti untuk job baru.
            </p>
          </div>
        </div>
      )}

      {/* Job list */}
      {!isLoading && jobs.length > 0 && (
        <div data-ocid="job.list" className="space-y-3">
          <AnimatePresence mode="popLayout">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id.toString()}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <JobCard job={job} index={i} onOpen={openDetail} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail modal */}
      <JobDetailModal
        job={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onTaken={handleTaken}
      />
    </motion.div>
  );
}
