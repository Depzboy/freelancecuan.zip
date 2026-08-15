import { rewardTypeLabel } from "@/components/JobFilter";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Job } from "@/types";
import { ArrowRight, Coins } from "lucide-react";

interface JobCardProps {
  job: Job;
  index: number;
  onOpen: (job: Job) => void;
}

/**
 * A single job listing card.
 *
 * Shows the job title, a 2-line clamped description, a category badge, and
 * the reward formatted as Rupiah. The whole card is a button that opens the
 * detail modal. Mobile-first with a 20px (rounded-[20px]) radius and a soft
 * shadow; hover/active states lift the card slightly.
 */
export function JobCard({ job, index, onOpen }: JobCardProps) {
  return (
    <button
      type="button"
      data-ocid={`job.card.${index + 1}`}
      aria-label={`Buka detail job: ${job.title}`}
      onClick={() => onOpen(job)}
      className={cn(
        "group flex w-full flex-col gap-3 rounded-[20px] border border-border bg-card p-4 text-left",
        "shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-elevated",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      )}
    >
      {/* Header row: category badge + chevron */}
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant="secondary"
          data-ocid={`job.card.${index + 1}.badge`}
          className="rounded-full bg-gradient-subtle text-secondary-foreground"
        >
          {rewardTypeLabel(job.category)}
        </Badge>
        <ArrowRight
          className="size-4 shrink-0 text-muted-foreground transition-smooth group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden
        />
      </div>

      {/* Title */}
      <h3
        data-ocid={`job.card.${index + 1}.title`}
        className="font-display text-base font-semibold leading-snug text-foreground"
      >
        {job.title}
      </h3>

      {/* Short description (2-line clamp) */}
      <p
        data-ocid={`job.card.${index + 1}.description`}
        className="line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-muted-foreground"
      >
        {job.description}
      </p>

      {/* Reward footer */}
      <div className="mt-1 flex items-center gap-2 border-t border-border pt-3">
        <span
          className="flex size-8 items-center justify-center rounded-full bg-gradient-primary/10 text-primary"
          aria-hidden
        >
          <Coins className="size-4" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Reward
          </span>
          <span
            data-ocid={`job.card.${index + 1}.reward`}
            className="text-gradient-primary font-display text-base font-bold leading-none"
          >
            {formatRupiah(job.reward)}
          </span>
        </div>
      </div>
    </button>
  );
}
