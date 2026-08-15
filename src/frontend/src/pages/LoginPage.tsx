import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";

/**
 * Login screen.
 *
 * Full-bleed gradient background with the Freelancecuan brand, a short
 * value proposition, and a single primary CTA: "Masuk dengan Internet
 * Identity". After a successful login the auth gate in App.tsx redirects
 * to /beranda.
 */
export function LoginPage() {
  const { login, isLoggingIn, isLoginError, loginError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    // The auth gate in App.tsx reacts to isAuthenticated and redirects.
    // Navigate defensively in case the popup resolves synchronously.
    void navigate({ to: "/beranda" });
  };

  return (
    <div
      data-ocid="login.page"
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-gradient-primary"
    >
      {/* Decorative glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-white/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-24 size-72 rounded-full bg-accent/30 blur-3xl"
      />

      {/* Brand + hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-1 flex-col items-center justify-center px-6 text-center text-primary-foreground"
      >
        <div className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-white/20 shadow-glow backdrop-blur-sm">
          <span className="font-display text-3xl font-bold">fc</span>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Freelancecuan
        </h1>
        <p className="mt-2 max-w-xs text-sm text-white/85">
          Kerjakan tugas email, kumpulkan reward, dan tarik saldo — semua dalam
          satu aplikasi.
        </p>

        <div className="mt-8 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm">
          <Sparkles className="size-4" />
          Login aman dengan Internet Identity
        </div>
      </motion.section>

      {/* Action card */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-t-[2rem] bg-card px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 shadow-elevated"
      >
        <h2 className="font-display text-xl font-semibold text-foreground">
          Masuk ke akun Anda
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gunakan Internet Identity SSO. Email terverifikasi Anda akan
          ditampilkan setelah masuk.
        </p>

        <button
          type="button"
          data-ocid="login.submit_button"
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-6 py-4 font-display text-base font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Memproses…
            </>
          ) : (
            <>
              <ShieldCheck className="size-5" />
              Masuk dengan Internet Identity
            </>
          )}
        </button>

        {isLoginError && (
          <p
            data-ocid="login.error_state"
            role="alert"
            className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            Gagal masuk:{" "}
            {loginError?.message ?? "Terjadi kesalahan. Coba lagi."}
          </p>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi
          Freelancecuan.
        </p>
      </motion.section>
    </div>
  );
}
