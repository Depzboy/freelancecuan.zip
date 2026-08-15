# Cuan Glow — Design Brief

## Direction
Cuan Glow: light, mobile-first freelance marketplace. White canvas, blue→purple gradient reserved for focal moments (CTA, balance hero, active nav). Replica tampilan Freelancecuan — clean, friendly, trustworthy.

## Tone
Friendly, aspirational, professional. Bahasa Indonesia for all copy. Numbers feel rewarding (saldo, job count). Never corporate-cold.

## Differentiation
- Gradient is the brand signature — used sparingly, never as background wash.
- Cards carry soft blue-tinted shadows (not neutral grey) for warmth.
- Rounded 16–24px corners throughout; nothing sharp.
- Bottom nav fixed with gradient active state.

## Color Palette (OKLCH)

| Token        | Light                          | Dark                           | Usage                          |
|--------------|--------------------------------|--------------------------------|--------------------------------|
| background   | oklch(1.0 0 0)                 | oklch(0.16 0.02 260)           | page canvas                    |
| foreground   | oklch(0.18 0.02 260)           | oklch(0.96 0.01 260)           | primary text                  |
| primary      | oklch(0.62 0.16 250)           | oklch(0.68 0.16 250)           | blue CTA, links, active nav    |
| accent       | oklch(0.58 0.22 300)           | oklch(0.65 0.2 300)            | purple highlights, badges      |
| card         | oklch(1.0 0 0)                 | oklch(0.2 0.02 260)            | surfaces                       |
| muted        | oklch(0.97 0.005 260)          | oklch(0.24 0.02 260)           | secondary backgrounds          |
| muted-foreground | oklch(0.5 0.02 260)        | oklch(0.65 0.02 260)           | captions, meta                 |
| border       | oklch(0.92 0.01 260)           | oklch(0.3 0.02 260)            | dividers, inputs               |
| destructive  | oklch(0.58 0.22 25)            | oklch(0.65 0.2 25)             | errors, logout                 |

Gradient: `linear-gradient(135deg, #4A90E2, #9B51E0)` via `--gradient-primary`.

## Typography
DM Sans for display and body (variable woff2, 100–900). Single family keeps the friendly geometric tone consistent. Headings 600–700, body 400–500. Numerals tabular for saldo/counts.

## Elevation & Depth
- `shadow-card` — resting cards (subtle, neutral).
- `shadow-soft` — interactive cards, list items (blue-tinted).
- `shadow-elevated` — hero balance card, modals (blue+purple tint).
- `shadow-glow` / `shadow-glow-accent` — gradient CTAs, floating chat button.

## Structural Zones
1. **Auth screen** — centered gradient hero card, II SSO button.
2. **App shell** — top header (greeting + avatar), scrollable content, fixed bottom nav (6 tabs).
3. **Beranda** — greeting, saldo hero (gradient), quick actions, recommended jobs.
4. **Job/Tugas** — list/grid cards with status chips.
5. **Riwayat** — timeline cards.
6. **Saldo** — gradient hero balance, transaction list.
7. **Profil** — avatar header, settings list.
8. **Floating chat** — bottom-right, above nav, gradient + float-bob.

## Spacing & Rhythm
4px base grid. Page padding 16px mobile / 24px tablet. Card padding 16–20px. Section gap 24px. Max content width 480px mobile-first, expands to 1024px grid on tablet+.

## Component Patterns
- Cards: `rounded-2xl` (16px) default, `rounded-3xl` (24px) for hero/balance.
- Buttons: gradient primary `bg-gradient-primary text-white rounded-2xl shadow-glow`; secondary outline.
- Chips: `rounded-full` with tinted bg (primary/8%).
- Bottom nav: 6 items, icon + label, active = gradient pill behind icon.
- Inputs: `rounded-2xl`, 1px border, focus ring primary.

## Motion
- `fade-up` on screen mount (0.5s, expo-out).
- `float-bob` on chat FAB (3s infinite).
- `gradient-shimmer` on saldo hero (6s) — animated gradient position.
- Transitions 0.3s `cubic-bezier(0.4,0,0.2,1)` for hover/active.

## Constraints
- Mobile-first; bottom nav always visible, content scrolls above it.
- No dark mode toggle in UI — light is default, dark tokens reserved for system preference.
- Bahasa Indonesia only in UI copy.
- No payment gateway UI, no real withdrawal flows (per doNotBuild).
- Static dummy data for all demo content.

## Signature Detail
Saldo hero card: full-bleed `--gradient-primary` with `gradient-shimmer` animation, white tabular numerals, soft `shadow-elevated` glow. It is the single most recognizable Cuan Glow element.
