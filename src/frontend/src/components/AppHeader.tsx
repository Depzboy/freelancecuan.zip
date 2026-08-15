import { useAuth } from "@/hooks/useAuth";
import { useCallerProfile } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

/**
 * Application header shown on every authenticated page.
 *
 * Displays the Freelancecuan wordmark, a "Halo, [Nama]" greeting, and the
 * user's verified email. The greeting falls back to the principal prefix
 * while the profile is loading or before a name is set.
 */
export function AppHeader() {
  const { principal } = useAuth();
  const { data: profile } = useCallerProfile();

  const displayName =
    profile?.name?.trim() ||
    (principal ? `${principal.slice(0, 6)}…` : "Pengguna");
  const email = profile?.email ?? null;

  return (
    <header
      data-ocid="app.header"
      className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3">
        {/* Brand mark */}
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow"
          aria-hidden
        >
          <span className="font-display text-lg font-bold">fc</span>
        </div>

        {/* Greeting + email */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold text-foreground">
            Halo, {displayName}
          </p>
          {email ? (
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          ) : (
            <p className="truncate text-xs text-muted-foreground">
              Email belum terverifikasi
            </p>
          )}
        </div>

        {/* Decorative chevron — visual cue for profile entry */}
        <ChevronRight
          className={cn("size-5 shrink-0 text-muted-foreground")}
          aria-hidden
        />
      </div>
    </header>
  );
}
