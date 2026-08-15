import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatRupiah, formatTimestamp } from "@/lib/format";
import { REWARD_TYPE_LABEL, TASK_STATUS_LABEL } from "@/types";
import type { TaskStatus, TaskView } from "@/types";
import { ChevronRight, Clock, Coins, Hash, Mail } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Status badge for a TaskView.
 * Pending = amber/yellow, Diterima = emerald/green.
 */
function StatusBadge({ status }: { status: TaskStatus }) {
  const label = TASK_STATUS_LABEL[status] ?? status;
  if (status === "diterima") {
    return (
      <Badge
        data-ocid="tugas.card.status_badge"
        className="border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
      >
        {label}
      </Badge>
    );
  }
  return (
    <Badge
      data-ocid="tugas.card.status_badge"
      className="border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
    >
      {label}
    </Badge>
  );
}

/** Small labeled metadata row used inside the card body. */
function MetaRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="text-muted-foreground/80">{icon}</span>
      <span className="min-w-0 truncate">{children}</span>
    </div>
  );
}

/**
 * TaskCard — a single active task in the user's task list.
 *
 * Shows the task category as the title, a status badge (Pending=amber,
 * Diterima=emerald), the reward formatted as Rupiah, the reward category,
 * and the creation date. The whole card is a button that opens the detail
 * modal.
 */
export function TaskCard({
  task,
  index,
  onOpen,
}: {
  task: TaskView;
  index: number;
  onOpen: (task: TaskView) => void;
}) {
  const categoryLabel = REWARD_TYPE_LABEL[task.category] ?? task.category;
  const isPending = task.status === "pending";

  return (
    <motion.div
      data-ocid={`tugas.item.${index + 1}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.24) }}
    >
      <Card
        data-ocid={`tugas.card.${index + 1}`}
        onClick={() => onOpen(task)}
        aria-label={`Buka detail tugas ${categoryLabel}, status ${TASK_STATUS_LABEL[task.status] ?? task.status}, reward ${formatRupiah(task.reward)}`}
        className="group w-full cursor-pointer gap-0 rounded-2xl border-border/80 p-4 text-left shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow focus-visible:-translate-y-0.5 focus-visible:border-primary focus-visible:shadow-glow focus-visible:outline-none"
      >
        {/* Header: title + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${
                isPending ? "bg-gradient-primary" : "bg-emerald-500"
              }`}
              aria-hidden
            >
              <Mail className="size-4" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-display text-base font-semibold text-foreground">
                Tugas {categoryLabel}
              </h3>
              <MetaRow icon={<Hash className="size-3" />}>
                Job #{task.jobId.toString()}
              </MetaRow>
            </div>
          </div>
          <StatusBadge status={task.status} />
        </div>

        {/* Reward highlight */}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-gradient-subtle px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Coins className="size-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Reward
            </span>
          </div>
          <span className="font-display text-lg font-bold text-gradient-primary">
            {formatRupiah(task.reward)}
          </span>
        </div>

        {/* Footer: category + date + chevron */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <MetaRow icon={<Mail className="size-3" />}>
              {categoryLabel}
            </MetaRow>
            <MetaRow icon={<Clock className="size-3" />}>
              {formatTimestamp(task.createdAt)}
            </MetaRow>
          </div>
          <ChevronRight
            className="size-4 shrink-0 text-muted-foreground transition-smooth group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden
          />
        </div>
      </Card>
    </motion.div>
  );
}
