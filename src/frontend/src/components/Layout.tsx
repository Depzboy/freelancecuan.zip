import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { FloatingChat } from "@/components/FloatingChat";
import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Mobile-first application shell.
 *
 * Centers content on a phone-width column (max-w-md), pins the AppHeader
 * at the top, the BottomNav at the bottom, and the FloatingChat above the
 * nav. The content area scrolls between header and nav with safe padding.
 *
 * When used as a TanStack Router parent route, the matched child route
 * renders via `<Outlet />`. When used directly (e.g. by the auth gate
 * while a redirect is pending), explicit `children` are rendered instead.
 */
export function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="relative min-h-dvh w-full bg-background">
      {/* Centered phone-width column */}
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
        <AppHeader />
        <main data-ocid="app.content" className="flex-1 px-4 pb-28 pt-4">
          {children ?? <Outlet />}
        </main>
        <BottomNav />
        <FloatingChat />
      </div>
    </div>
  );
}
