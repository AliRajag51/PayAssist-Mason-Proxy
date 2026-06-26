# CLAUDE.md

## Mandatory first step

Read this file completely before changing anything in this folder. Don't install
or upgrade packages unless the task asks for it, don't make broad refactors
without a plan, and don't touch unrelated files.

## Project context

This is the **HOMEBASE SUPPLY** customer storefront — HomeBase Supply's
considered objects, lighting and accessories for the home. It was built by
porting the existing UI (originally a stand-alone Next 15 + Tailwind 3
project under `Desgin Guide/Mason Sky Enterprises design/` — the design source
folder still carries the original "Mason Sky" name on disk) onto the **Sona
storefront scaffold** so both stores share configs, libs, the deployment
shape, and the PayAssist backend contract.

- **Stack:** Next.js 16 (App Router, **Turbopack**), React 19, **TypeScript (strict)**,
  **Tailwind CSS v4**, `lucide-react`, **Zod** (for backend response validation),
  Stripe / PayPal SDKs. **Bun** is the package manager + dev runtime
  (`bun.lock`); Next 16 builds with Turbopack by default.
- **Styling:** `src/app/globals.css` is the single source for the design system.
  Tokens declared in `@theme` (colors, fonts, animation utilities), small base
  reset in `@layer base`, the `.ms-field` form field class in
  `@layer components`. **No `tailwind.config.*` file — v4 reads from CSS.**
  Storefront JSX uses Tailwind utilities directly with `bg-cream`, `text-ink`,
  `font-display`, `animate-kenburns`, etc.
- **UI is final.** The HomeBase Supply UI was ported 1:1 from the design source
  and is the authoritative visual. Do not redesign it, do not introduce a second
  styling system (e.g. shadcn) — it would alter the look.
- **State (Phase 1):** the storefront ships with a local `useCart` hook
  (`src/components/mason/useCart.ts`) and mock products
  (`src/components/mason/products.ts`). Cart persists to localStorage under
  `ms_cart`.
- **Backend adapter (Phase 2):** the per-store catalog/auth/payment files
  (`catalog-source.ts`, `schemas.ts`, `backend-types.ts`, `auth-source.ts`,
  `payment-source.ts`) mirror Sona's reference 1:1. They speak to the same
  PayAssist backend (`/api/*` via the same-origin proxy) but are **not wired
  yet**. The UI consumes local `products.ts`; the adapter is in place for the
  surgery to point at the live backend.
- **Install with `bun install`; run with `bun run dev`** (port 3000).

### Wiring to the backend (when Phase 2 starts)

Mirror Sona exactly:

1. In `src/app/layout.tsx`, `await fetchProducts()` (server) and pass the result
   down through a `CatalogProvider` (port from Sona's `catalog-context.tsx`).
2. Replace the local `useCart` with a `cart-context.tsx` modeled on Sona's
   — same `CartItem` shape (`{ id, sku, name, price, img, type, cat, qty }`)
   so `buildOrderPayload` consumes it directly.
3. On `/checkout`, swap the static fake card inputs for Stripe Payment Element
   (when `isStripeConfigured`) + PayPal Buttons (when `isPaypalConfigured`),
   following Sona's `checkout-payment.tsx`. Cash-on-delivery stays the fallback.
4. Add a guest order detail route at `/order/[id]` driven by `fetchOrderById`.
5. The backend proxy at `src/app/api/[[...path]]/route.ts` is already in place
   and identical to Sona's — no changes needed there.

### Layout (`src/`)

```
app/                  Routes + layout.tsx + globals.css. Route page.tsx are
                      thin; UI lives in components/mason/.
  api/[[...path]]/route.ts   backend proxy (same-origin → INTERNAL_API_BASE_URL)
  error.tsx, not-found.tsx   on-brand fallbacks
components/mason/      All storefront UI + the integration layer:
  Header.tsx Footer.tsx AnnouncementBar.tsx
  ProductCard.tsx CartDrawer.tsx QuickViewModal.tsx Toast.tsx
  useCart.ts useReveal.ts useToast.ts          UI hooks (Phase 1 local state)
  products.ts types.ts                         UI-layer mock data + shapes
  catalog-source.ts                            per-store ADAPTER (Phase 2)
  schemas.ts backend-types.ts                  Zod + backend-aware UI types
  auth-source.ts payment-source.ts data.ts     adapters / overlay helpers
scripts/              smoke.mjs (storefront/backend reachability)
```

## Required workflow

For every task: **PLAN → ANALYZE → EXECUTE → VERIFY → TEST.** Read the relevant
route and the components it renders before editing. Keep changes minimal and
targeted; prefer existing patterns and the design tokens over ad-hoc values.

## Rules

- TypeScript, strict. Keep new storefront code under `components/mason/`. The
  per-store backend coupling stays in `catalog-source.ts` /
  `payment-source.ts` / `auth-source.ts`; components consume props / hooks /
  (future) contexts.
- **Don't change the finalized UI/UX/design** when wiring or refactoring.
- Styling goes through Tailwind tokens (`@theme`) + the `.ms-field` component
  class in `globals.css`. Don't add a second styling system.
- Imagery uses plain `<img>` — `@next/next/no-img-element` is intentionally off
  (see `eslint.config.mjs`), matching the Sona convention.
- Install deps with `bun install`; commit `bun.lock`.
- Don't hardcode secrets. Only `NEXT_PUBLIC_*` env vars reach the browser.
- Clear `.next/` only when the build cache is genuinely corrupted.

## Verification checklist

- [ ] `bun run typecheck` (tsc --noEmit) is clean (strict types).
- [ ] `bun run lint` is clean.
- [ ] `bun run build` is green and the changed page renders without console or
      hydration errors.
- [ ] Routes verified: `/`, `/shop`, `/product-details/[id]`, `/cart`, `/checkout`.
- [ ] No unrelated files changed; no dependencies bumped unintentionally.
- [ ] UI unchanged from the ported Mason design.

## What lives elsewhere

- The Sona reference storefront: `../PayAssist-E-comm-frontend-Sona-main` —
  treat as read-only.
- Shared PayAssist backend: `../PayAssist-E-comm-Backend-main` — read-only.
- Shared admin: `../PayAssist-E-comm-Admin-main` — read-only.
- The original static UI source (legacy folder name): `../Desgin Guide/Mason Sky Enterprises design/`.
