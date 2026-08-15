import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { shortPrincipal } from "@/lib/format";
import { BadgeCheck } from "lucide-react";

/**
 * Profile header card.
 *
 * Shows a gradient avatar built from the user's initials, the display name,
 * a verified-email row (with checkmark) when an email is present, and the
 * shortened principal as a mono badge. Designed mobile-first with the
 * blue-purple gradient token and rounded 20-24px cards.
 */
export function ProfileHeader({
  profile,
  principal,
  isLoading,
}: {
  profile: { name: string; email?: string } | null | undefined;
  principal: string | null | undefined;
  isLoading: boolean;
}) {
  const name = profile?.name?.trim() || "Pengguna";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (isLoading) {
    return (
      <section
        data-ocid="profil.header.section"
        className="rounded-3xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-6 w-40 rounded-full" />
        </div>
      </section>
    );
  }

  return (
    <section
      data-ocid="profil.header.section"
      className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm"
    >
      <div
        aria-hidden
        className="bg-gradient-primary pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
      />
      <div className="relative flex flex-col items-center gap-3 text-center">
        <div
          data-ocid="profil.header.avatar"
          className="bg-gradient-primary flex size-20 items-center justify-center rounded-full text-2xl font-bold text-white shadow-glow"
        >
          {initials || "?"}
        </div>

        <h2
          data-ocid="profil.header.name"
          className="font-display text-xl font-bold text-foreground"
        >
          {name}
        </h2>

        {profile?.email ? (
          <div
            data-ocid="profil.header.email"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <BadgeCheck className="size-4 text-primary" aria-hidden />
            <span className="min-w-0 truncate">{profile.email}</span>
          </div>
        ) : (
          <p
            data-ocid="profil.header.email_unverified"
            className="text-sm text-muted-foreground"
          >
            Email belum terverifikasi
          </p>
        )}

        <Badge
          variant="secondary"
          data-ocid="profil.header.principal"
          className="font-mono text-xs font-normal"
        >
          {shortPrincipal(principal ?? undefined)}
        </Badge>
      </div>
    </section>
  );
}
