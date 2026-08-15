import { cn } from "@/lib/utils";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface ChatMessage {
  id: number;
  from: "user" | "bot";
  text: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    from: "bot",
    text: "Halo! Ada yang bisa kami bantu seputar Freelancecuan?",
  },
];

/**
 * Floating chat button anchored bottom-right, above the bottom nav.
 *
 * Clicking opens a dummy chat panel with a canned welcome message and a
 * non-functional input (the input echoes a placeholder reply). This is a
 * static demo surface — no backend wiring per the build scope.
 */
export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");

  const toggle = () => setOpen((v) => !v);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const userMsg: ChatMessage = {
      id: Date.now(),
      from: "user",
      text,
    };
    const botMsg: ChatMessage = {
      id: Date.now() + 1,
      from: "bot",
      text: "Terima kasih sudah menghubungi kami. Tim support akan segera membalas pesan Anda.",
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setDraft("");
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        data-ocid="floating.chat.button"
        aria-label={open ? "Tutup chat" : "Buka chat"}
        aria-expanded={open}
        onClick={toggle}
        className={cn(
          "fixed bottom-20 right-4 z-40 flex size-14 items-center justify-center rounded-full",
          "bg-gradient-primary text-primary-foreground shadow-glow",
          "transition-smooth hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          "animate-float-bob",
        )}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-ocid="floating.chat.panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-36 right-4 z-40 flex h-[60vh] max-h-[480px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-elevated"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-gradient-primary px-4 py-3 text-primary-foreground">
              <div className="flex size-9 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold">
                  Bantuan Freelancecuan
                </p>
                <p className="text-xs text-white/80">Online sekarang</p>
              </div>
              <button
                type="button"
                data-ocid="floating.chat.close"
                aria-label="Tutup chat"
                onClick={toggle}
                className="rounded-full p-1.5 transition-smooth hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  data-ocid={`floating.chat.message.${m.id}`}
                  className={cn(
                    "flex",
                    m.from === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                      m.from === "user"
                        ? "rounded-br-md bg-gradient-primary text-primary-foreground"
                        : "rounded-bl-md bg-card text-foreground border border-border",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              className="flex items-center gap-2 border-t border-border bg-card p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                type="text"
                value={draft}
                data-ocid="floating.chat.input"
                aria-label="Tulis pesan"
                placeholder="Tulis pesan…"
                onChange={(e) => setDraft(e.target.value)}
                className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
              <button
                type="submit"
                data-ocid="floating.chat.send"
                aria-label="Kirim pesan"
                disabled={!draft.trim()}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground transition-smooth hover:scale-105 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <Send className="size-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
