import { TaskCard } from "@/components/TaskCard";
import { TaskDetailModal } from "@/components/TaskDetailModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyTasks } from "@/hooks/useBackend";
import type { TaskView } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { ClipboardList, Inbox, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

/**
 * TugasPage — the user's active task list.
 *
 * Pulls tasks via `useMyTasks`, renders them as TaskCards, and opens a
 * TaskDetailModal on tap. Shows a loading skeleton while fetching, an
 * error state with retry, and a friendly empty state when there are no
 * tasks. All copy is in Indonesian.
 */
export function TugasPage() {
  const { data: tasks, isLoading, isError, refetch, isFetching } = useMyTasks();
  const navigate = useNavigate();
  const [activeTask, setActiveTask] = useState<TaskView | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function openDetail(task: TaskView) {
    setActiveTask(task);
    setModalOpen(true);
  }

  const taskList = tasks ?? [];
  const showSkeleton = isLoading && taskList.length === 0;

  return (
    <motion.div
      data-ocid="tugas.page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      {/* Page header */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow"
            aria-hidden
          >
            <ClipboardList className="size-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Tugas
            </h1>
            <p className="text-xs text-muted-foreground">
              Daftar tugas aktif yang sedang Anda kerjakan.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          data-ocid="tugas.refresh_button"
          aria-label="Muat ulang daftar tugas"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="rounded-xl"
        >
          <RefreshCw className={`size-5 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </header>

      {/* Loading skeleton */}
      {showSkeleton && (
        <div
          data-ocid="tugas.loading_state"
          className="space-y-3"
          aria-busy="true"
          aria-live="polite"
        >
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              className="h-36 rounded-2xl border border-border/60"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && !showSkeleton && (
        <div
          data-ocid="tugas.error_state"
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 p-8 text-center"
        >
          <span
            className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
            aria-hidden
          >
            <Inbox className="size-6" />
          </span>
          <div className="space-y-1">
            <h2 className="font-display text-base font-semibold text-foreground">
              Gagal memuat tugas
            </h2>
            <p className="text-sm text-muted-foreground">
              Terjadi kesalahan saat mengambil daftar tugas Anda.
            </p>
          </div>
          <Button
            type="button"
            data-ocid="tugas.retry_button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="rounded-xl"
          >
            <RefreshCw
              className={`size-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Coba lagi
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!showSkeleton && !isError && taskList.length === 0 && (
        <div
          data-ocid="tugas.empty_state"
          className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-gradient-subtle p-10 text-center"
        >
          <span
            className="flex size-16 items-center justify-center rounded-3xl bg-gradient-primary text-white shadow-glow"
            aria-hidden
          >
            <ClipboardList className="size-8" />
          </span>
          <div className="space-y-1.5">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Belum ada tugas aktif
            </h2>
            <p className="mx-auto max-w-xs text-sm text-muted-foreground">
              Anda belum mengambil job apa pun. Jelajahi daftar job dan ambil
              job untuk mulai mengerjakan tugas.
            </p>
          </div>
          <Button
            type="button"
            data-ocid="tugas.empty_state.browse_jobs_button"
            onClick={() => void navigate({ to: "/job" })}
            className="rounded-xl bg-gradient-primary text-white shadow-glow hover:opacity-90"
          >
            Jelajahi Job
          </Button>
        </div>
      )}

      {/* Task list */}
      {!showSkeleton && !isError && taskList.length > 0 && (
        <ul
          data-ocid="tugas.list"
          className="space-y-3"
          aria-label="Daftar tugas aktif"
        >
          {taskList.map((task, i) => (
            <li key={task.id.toString()}>
              <TaskCard task={task} index={i} onOpen={openDetail} />
            </li>
          ))}
        </ul>
      )}

      {/* Detail modal */}
      <TaskDetailModal
        task={activeTask}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </motion.div>
  );
}
