import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { BerandaPage } from "@/pages/BerandaPage";
import { JobPage } from "@/pages/JobPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProfilPage } from "@/pages/ProfilPage";
import { RiwayatPage } from "@/pages/RiwayatPage";
import { SaldoPage } from "@/pages/SaldoPage";
import { TugasPage } from "@/pages/TugasPage";
import {
  Outlet,
  RouterProvider,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

/* ------------------------------------------------------------------ */
/* Auth gate                                                           */
/* ------------------------------------------------------------------ */

/** Routes that require an authenticated user. */
const PROTECTED_PREFIXES = [
  "/beranda",
  "/job",
  "/tugas",
  "/riwayat",
  "/saldo",
  "/profil",
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

/** Full-screen loading veil shown while the II client restores identity. */
function AuthVeil() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm">Memuat sesi…</p>
      </div>
    </div>
  );
}

/**
 * Root route component.
 *
 * Reads the current pathname from the router state and the auth state
 * from the II provider, then either renders the outlet or issues a
 * navigation to /login or /beranda via TanStack Router's `useNavigate`.
 * Doing the gate here (in a React component) keeps `useAuth` inside a
 * valid hook context and avoids direct `window.history` manipulation.
 */
function RootComponent() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const needsAuth = isProtected(pathname);
  const onLogin = pathname === "/login" || pathname.startsWith("/login");

  useEffect(() => {
    if (isInitializing) return;
    if (!isAuthenticated && needsAuth && pathname !== "/login") {
      navigate({ to: "/login", replace: true });
    } else if (isAuthenticated && onLogin && pathname !== "/beranda") {
      navigate({ to: "/beranda", replace: true });
    }
  }, [isInitializing, isAuthenticated, needsAuth, onLogin, pathname, navigate]);

  if (isInitializing) {
    return <AuthVeil />;
  }

  // Render login directly while the redirect to /login is pending.
  if (!isAuthenticated && needsAuth) {
    return <LoginPage />;
  }

  // Render beranda directly while the redirect from /login is pending.
  if (isAuthenticated && onLogin) {
    return (
      <Layout>
        <BerandaPage />
      </Layout>
    );
  }

  return <Outlet />;
}

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

const rootRoute = createRootRouteWithContext<Record<string, never>>()({
  component: RootComponent,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => null, // gated by RootComponent
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_layout",
  component: Layout,
});

const berandaRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/beranda",
  component: BerandaPage,
});

const jobRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/job",
  component: JobPage,
});

const tugasRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/tugas",
  component: TugasPage,
});

const riwayatRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/riwayat",
  component: RiwayatPage,
});

const saldoRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/saldo",
  component: SaldoPage,
});

const profilRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profil",
  component: ProfilPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => null, // gated by RootComponent
});

const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    loginRoute,
    layoutRoute.addChildren([
      berandaRoute,
      jobRoute,
      tugasRoute,
      riwayatRoute,
      saldoRoute,
      profilRoute,
    ]),
  ]),
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

/* ------------------------------------------------------------------ */
/* App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  return <RouterProvider router={router} />;
}
