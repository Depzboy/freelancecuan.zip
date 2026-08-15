import { EditNameModal } from "@/components/EditNameModal";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileStats } from "@/components/ProfileStats";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCallerProfile, useMyProfileStats } from "@/hooks/useBackend";
import {
  Bell,
  ChevronRight,
  HelpCircle,
  Lock,
  LogOut,
  Pencil,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

/** A single dummy account-setting row. */
type SettingRow = {
  key: string;
  label: string;
  description: string;
  icon: typeof Bell;
};

const SETTINGS: SettingRow[] = [
  {
    key: "notifikasi",
    label: "Notifikasi",
    description: "Atur preferensi pemberitahuan",
    icon: Bell,
  },
  {
    key: "keamanan",
    label: "Keamanan",
    description: "Kelola sandi dan sesi aktif",
    icon: Lock,
  },
  {
    key: "privasi",
    label: "Privasi",
    description: "Kontrol data dan visibilitas profil",
    icon: Shield,
  },
  {
    key: "bantuan",
    label: "Bantuan",
    description: "Pusat bantuan dan dukungan",
    icon: HelpCircle,
  },
];

/**
 * Profil (Profile) page.
 *
 * Composes the profile header, statistics summary, an "Edit Nama" action
 * that opens the EditNameModal, a dummy "Pengaturan Akun" section, and a
 * "Keluar" (logout) button wired to useAuth. All copy is in Indonesian.
 */
export function ProfilPage() {
  const { principal, logout } = useAuth();
  const profileQuery = useCallerProfile();
  const statsQuery = useMyProfileStats();
  const [editOpen, setEditOpen] = useState(false);

  const currentName = profileQuery.data?.name ?? "";

  return (
    <motion.div
      data-ocid="profil.page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      <h1 className="font-display text-2xl font-bold text-foreground">
        Profil
      </h1>

      <ProfileHeader
        profile={profileQuery.data}
        principal={principal}
        isLoading={profileQuery.isLoading}
      />

      <ProfileStats stats={statsQuery.data} isLoading={statsQuery.isLoading} />

      {/* Edit name action */}
      <Button
        variant="outline"
        size="lg"
        data-ocid="profil.edit_name.open_button"
        className="w-full rounded-2xl"
        onClick={() => setEditOpen(true)}
      >
        <Pencil className="size-4" aria-hidden />
        Edit Nama
      </Button>

      {/* Account settings (dummy) */}
      <section data-ocid="profil.settings.section" className="space-y-3">
        <h3 className="font-display text-base font-semibold text-foreground">
          Pengaturan Akun
        </h3>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {SETTINGS.map((row, index) => {
            const Icon = row.icon;
            return (
              <button
                key={row.key}
                type="button"
                data-ocid={`profil.settings.row.${index}`}
                className="flex w-full items-center gap-3 border-b border-border p-4 text-left transition-smooth last:border-b-0 hover:bg-secondary/60 focus-visible:bg-secondary/60 focus-visible:outline-none"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {row.label}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {row.description}
                  </p>
                </div>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Logout */}
      <Button
        variant="destructive"
        size="lg"
        data-ocid="profil.logout.button"
        className="w-full rounded-2xl"
        onClick={() => logout()}
      >
        <LogOut className="size-4" aria-hidden />
        Keluar
      </Button>

      <EditNameModal
        open={editOpen}
        onOpenChange={setEditOpen}
        currentName={currentName}
      />
    </motion.div>
  );
}
