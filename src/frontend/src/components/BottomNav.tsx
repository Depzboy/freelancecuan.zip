import { cn } from "@/lib/utils";
import type { TabKey } from "@/types";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Briefcase,
  ClipboardList,
  History,
  Home,
  type LucideIcon,
  User,
  Wallet,
} from "lucide-react";

interface TabDef {
  key: TabKey;
  label: string;
  to: string;
  icon: LucideIcon;
}

const TABS: TabDef[] = [
  { key: "beranda", label: "Beranda", to: "/beranda", icon: Home },
  { key: "job", label: "Job", to: "/job", icon: Briefcase },
  { key: "tugas", label: "Tugas", to: "/tugas", icon: ClipboardList },
  { key: "riwayat", label: "Riwayat", to: "/riwayat", icon: History },
  { key: "saldo", label: "Saldo", to: "/saldo", icon: Wallet },
  { key: "profil", label: "Profil", to: "/profil", icon: User },
];

/**
 * Fixed bottom navigation bar with 6 tabs.
 *
 * The active tab is highlighted with the blue-purple gradient text and a
 * gradient indicator pill above the icon. Inactive tabs use muted-foreground.
 * Hit targets are ≥44px for comfortable mobile tapping.
 */
export function BottomNav() {
  const location = useLocation();
  const activeKey = TABS.find((t) => location.pathname.startsWith(t.to))?.key;

  return (
    <nav
      data-ocid="bottom.nav"
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex w-full max-w-md items-stretch justify-between px-1 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const active = tab.key === activeKey;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.key}
              to={tab.to}
              data-ocid={`bottom.nav.tab.${tab.key}`}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex flex-1 flex-col items-center gap-1 px-1 py-2 transition-smooth",
                "min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              )}
            >
              {/* Active indicator pill */}
              <span
                aria-hidden
                className={cn(
                  "absolute top-0 h-1 w-8 rounded-full bg-gradient-primary transition-smooth",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon
                className={cn(
                  "size-5 shrink-0 transition-smooth",
                  active
                    ? "text-transparent"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
                style={
                  active
                    ? {
                        backgroundImage: "var(--gradient-primary)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                      }
                    : undefined
                }
              />
              <span
                className={cn(
                  "text-[10px] font-medium leading-none transition-smooth",
                  active
                    ? "text-transparent"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
                style={
                  active
                    ? {
                        backgroundImage: "var(--gradient-primary)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                      }
                    : undefined
                }
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
