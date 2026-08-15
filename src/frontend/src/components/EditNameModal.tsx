import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateCallerName } from "@/hooks/useBackend";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Modal for editing the caller's display name.
 *
 * Pre-fills with the current name, validates non-empty input, and calls
 * the `updateCallerName` mutation on submit. Closes on success. The
 * mutation invalidates the `callerProfile` query, so the header refreshes
 * automatically.
 */
export function EditNameModal({
  open,
  onOpenChange,
  currentName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
}) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);

  const mutation = useUpdateCallerName();

  // Re-sync the input when the modal opens or the stored name changes.
  useEffect(() => {
    if (open) {
      setName(currentName);
      setError(null);
    }
  }, [open, currentName]);

  const trimmed = name.trim();
  const canSubmit = trimmed.length > 0 && trimmed !== currentName;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    setError(null);
    mutation.mutate(trimmed, {
      onSuccess: () => onOpenChange(false),
      onError: (err) =>
        setError(err instanceof Error ? err.message : "Gagal menyimpan nama."),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid="profil.edit_name.modal" className="rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Nama</DialogTitle>
          <DialogDescription>
            Ubah nama tampilan akun Anda. Perubahan disimpan ke backend.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name-input">Nama Tampilan</Label>
            <Input
              id="profile-name-input"
              data-ocid="profil.edit_name.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama"
              maxLength={64}
              autoComplete="name"
              aria-invalid={!!error}
              autoFocus
            />
            {error && (
              <p
                data-ocid="profil.edit_name.error"
                role="alert"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              data-ocid="profil.edit_name.cancel_button"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              data-ocid="profil.edit_name.save_button"
              disabled={!canSubmit || mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Menyimpan…
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
