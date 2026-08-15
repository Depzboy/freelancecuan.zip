import { HistoryFilter, useHistoryFilter } from "@/components/HistoryFilter";
import { HistoryItem } from "@/components/HistoryItem";
import { useMyHistory, useMyHistoryByKind } from "@/hooks/useBackend";
import { formatDateTime, formatRupiah } from "@/lib/format";
import type { ActivityHistoryView } from "@/types";
import { History, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

/**
 * Riwayat (Activity History) page.
 *
 * Composes the HistoryFilter tabs (state persisted in the URL `kind`
 * search param) with the list of activity records. When a filter is
 * active it calls `useMyHistoryByKind`; otherwise it calls
 * `useMyHistory` for the full list. Each row is clickable to open a
 * detail view (currently a lightweight inline expansion — the detail
 * surface is owned by a future task).
 */
export function RiwayatPage() {
  const filter = useHistoryFilter();
  const allQuery = useMyHistory();
  const byKindQuery = useMyHistoryByKind(filter === "all" ? null : filter);

  const [selected, setSelected] = useState<ActivityHistoryView | null>(null);

  const isFiltered = filter !== "all";
  const query = isFiltered ? byKindQuery : allQuery;
  const items = query.data ?? [];
  const isLoading = query.isLoading;
  const isError = query.isError;

  return (
    <motion.div
      data-ocid="riwayat.page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Riwayat
        </h1>
        <p className="text-sm text-muted-foreground">
          Lacak aktivitas job, tugas, dan penarikan saldo Anda.
        </p>
      </header>

      <HistoryFilter />

      {/* Body */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState />
      ) : items.length === 0 ? (
        <EmptyState filtered={isFiltered} />
      ) : (
        <ul data-ocid="riwayat.list" className="space-y-2.5">
          {items.map((item, i) => (
            <li key={item.id.toString()}>
              <HistoryItem
                item={item}
                index={i + 1}
                onSelect={(it) => setSelected(it)}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Detail sheet (lightweight inline expansion) */}
      {selected ? (
        <DetailSheet item={selected} onClose={() => setSelected(null)} />
      ) : null}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

function LoadingState() {
  return (
    <div
      data-ocid="riwayat.loading_state"
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground"
    >
      <Loader2 className="size-7 animate-spin text-primary" aria-hidden />
      <p>Memuat riwayat aktivitas…</p>
    </div>
  );
}

function ErrorState() {
  return (
    <div
      data-ocid="riwayat.error_state"
      className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center"
    >
      <p className="font-display text-sm font-semibold text-destructive">
        Gagal memuat riwayat
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Periksa koneksi Anda lalu coba muat ulang halaman.
      </p>
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div
      data-ocid="riwayat.empty_state"
      className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-10 text-center"
    >
      <span
        aria-hidden
        className="flex size-14 items-center justify-center rounded-2xl bg-gradient-subtle text-primary"
      >
        <History className="size-7" />
      </span>
      <p className="font-display text-base font-semibold text-foreground">
        {filtered ? "Tidak ada aktivitas" : "Belum ada riwayat"}
      </p>
      <p className="max-w-xs text-sm text-muted-foreground">
        {filtered
          ? "Tidak ada aktivitas untuk filter ini. Coba pilih filter lain."
          : "Riwayat aktivitas job, tugas, dan penarikan Anda akan tampil di sini."}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail sheet                                                        */
/* ------------------------------------------------------------------ */

function DetailSheet({
  item,
  onClose,
}: {
  item: ActivityHistoryView;
  onClose: () => void;
}) {
  return (
    <dialog
      open
      data-ocid="riwayat.detail.overlay"
      aria-modal="true"
      aria-label="Detail aktivitas"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center"
    >
      <motion.div
        data-ocid="riwayat.detail.sheet"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl border border-border bg-card p-5 shadow-glow sm:rounded-3xl"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border sm:hidden" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">
            Detail Aktivitas
          </h2>
          <button
            type="button"
            data-ocid="riwayat.detail.close_button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            ✕
          </button>
        </div>

        <DetailRow label="Judul" value={item.title} />
        <DetailRow label="Jenis" value={kindLabel(item.kind)} />
        <DetailRow label="Tanggal" value={formatDateTime(item.at)} />
        <DetailRow label="Pemilik" value={item.owner} />
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
          <span className="text-sm text-muted-foreground">Jumlah</span>
          <span
            className={
              item.kind === "penarikan"
                ? "font-display text-base font-bold text-destructive"
                : "font-display text-base font-bold text-primary"
            }
          >
            {item.kind === "penarikan" ? "−" : "+"}
            {formatRupiah(item.amount)}
          </span>
        </div>
      </motion.div>
    </dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

function kindLabel(kind: ActivityHistoryView["kind"]): string {
  switch (kind) {
    case "job":
      return "Job";
    case "tugas":
      return "Tugas";
    case "penarikan":
      return "Penarikan";
    default:
      return kind;
  }
}
