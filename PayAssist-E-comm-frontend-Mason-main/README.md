# HomeBase Supply — Storefront

The HomeBase Supply customer storefront. Built on the same technical
scaffold as the SONA storefront so both share configs, deployment shape, and the
PayAssist backend contract — only the UI/UX is HomeBase Supply's own.

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript strict**.
- **Tailwind CSS v4** — design tokens declared in `src/app/globals.css` `@theme`
  (no `tailwind.config.*` file). HomeBase Supply brand palette: `cream`, `sand[-2/3]`,
  `ink[-2]`, `coffee[-2/3/4]`, `taupe`. Type stack: Playfair Display (display),
  Cormorant Garamond (serif), Inter (sans), Manrope (mono) — all via `next/font`.
- **Bun** for installs + dev/build.
- **Zod** schemas + per-store catalog/payment/auth adapters (see
  `src/components/homebase/`), aligned 1:1 with the Sona reference so the same
  PayAssist backend handles both stores.

## Run locally

```bash
cp .env.example .env.local        # then fill in NEXT_PUBLIC_API_BASE_URL etc.
bun install
bun run dev                       # http://localhost:3000
```

Type check / lint / build:

```bash
bun run typecheck
bun run lint
bun run build
```

## Routes (Phase 1)

| Route | Purpose |
| --- | --- |
| `/` | Homepage — hero, categories, collections, best sellers, journal, reviews, newsletter |
| `/shop` | Category grid + filters + sort + Quick View |
| `/product-details/[id]` | PDP — finish swatches, qty, related, mini-cart drawer |
| `/cart` | Full cart with summary + promo input |
| `/checkout` | Single-page checkout (contact, address, delivery, payment, place order) |
| `/api/[[...path]]` | Same-origin proxy → `INTERNAL_API_BASE_URL` (mirrors Sona) |

## Layout

```
src/
  app/                Routes (App Router). Pages are thin; UI/state lives in components/homebase/.
    api/[[...path]]   Backend proxy (same-origin → INTERNAL_API_BASE_URL)
  components/homebase/   All HomeBase Supply UI + the per-store backend adapter
    Header.tsx Footer.tsx AnnouncementBar.tsx ProductCard.tsx CartDrawer.tsx
    QuickViewModal.tsx Toast.tsx
    useCart.ts useReveal.ts useToast.ts            ← UI hooks
    products.ts types.ts                           ← product/cart shapes (UI layer)
    catalog-source.ts schemas.ts backend-types.ts  ← backend adapter (Phase 2)
    auth-source.ts payment-source.ts data.ts       ← backend adapter (Phase 2)
scripts/              smoke.mjs (storefront/backend reachability)
public/               static assets (favicon, etc.)
```

## Backend wiring (Phase 2)

The catalog/auth/payment adapters under `src/components/homebase/` mirror the Sona
reference and call the shared PayAssist backend. They are **not yet wired** into
the UI — HomeBase Supply currently uses local mock data from `products.ts`. To swap:

1. Have the layout `await fetchProducts()` and pass it down via a `CatalogProvider`.
2. Replace the local `useCart` with a `cart-context` that emits backend payloads
   via `buildOrderPayload` + `placeOrder`.
3. Use `payment-source` (Stripe/PayPal) on the checkout page.

The Sona codebase is the working reference for that surgery.

## Deployment

Same `Dockerfile` + `docker-compose.yml` shape as Sona. The browser calls
same-origin `/api/*`; the proxy forwards privately to `INTERNAL_API_BASE_URL`
(`http://backend:5000` by default).
