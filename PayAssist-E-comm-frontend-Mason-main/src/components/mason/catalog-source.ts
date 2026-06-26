/* MASON — backend catalog source (the per-store "adapter").
 *
 * The ONLY file that knows the shared PayAssist backend's data shape. It maps
 * backend Product/Order documents onto the exact shapes the storefront UI
 * expects, and validates every response with Zod so bad data fails loudly here
 * (not silently in the UI). Mirrors the Sona reference 1:1 — the backend
 * contract is shared across storefronts.
 *
 * Field mapping (backend -> Mason UI):
 *   title -> name + id (slug)                          sku -> Item ID (SKU-####)
 *   parent -> cat       price+discount -> price (effective)    tags[] -> tag
 *   image  -> img       relatedImages[] -> detail.gallery      description -> detail.desc
 *   itemInfo (JSON) -> detail.{tagline,highlights,specs,box}
 * rating/reviews have no backend column -> overlaid via `data.ts` if Mason
 * starts publishing static review numbers.
 */
import { findByName } from "@components/mason/data";
import {
  backendProductSchema,
  itemInfoSchema,
  orderSchema,
  addOrderResponseSchema,
  couponSchema,
  type BackendProduct,
  type BackendOrder,
  type BackendCoupon,
} from "@components/mason/schemas";
import type {
  UIProduct,
  UIProductDetail,
  OrderPayload,
  CartItem,
  AppliedCoupon,
} from "@components/mason/backend-types";

function apiBase(): string {
  return (
    process.env.INTERNAL_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");
}

async function getJSON(path: string): Promise<unknown> {
  const res = await fetch(`${apiBase()}/api/${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Backend /api/${path} -> ${res.status}`);
  return res.json();
}

function unwrapProducts(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  const obj = (json ?? {}) as Record<string, unknown>;
  return (
    (obj.products as unknown[]) ||
    (obj.data as unknown[]) ||
    (obj.result as unknown[]) ||
    []
  );
}

function parseProducts(json: unknown): BackendProduct[] {
  const out: BackendProduct[] = [];
  for (const raw of unwrapProducts(json)) {
    const parsed = backendProductSchema.safeParse(raw);
    if (parsed.success) out.push(parsed.data);
  }
  return out;
}

function titleToSlug(title = ""): string {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function effectivePrice(price: number, discount: number): number {
  const p = Number(price) || 0;
  const d = Number(discount) || 0;
  return d > 0 ? Math.round(p * (100 - d)) / 100 : p;
}

function toCard(doc: BackendProduct): UIProduct {
  const id = titleToSlug(doc.title);
  const cat = doc.parent || doc.category?.name || "";
  const tag = (doc.tags || []).find((t) => t && t !== cat) || null;
  const staticEntry = findByName(doc.title);
  return {
    id,
    sku: doc.sku,
    name: doc.title,
    type: doc.children || doc.type || "",
    cat,
    price: effectivePrice(doc.price, doc.discount),
    tag,
    rating: staticEntry?.rating ?? 4.8,
    reviews: staticEntry?.reviews ?? 0,
    img: doc.image,
  };
}

function toDetail(doc: BackendProduct): UIProductDetail {
  const gallery = (
    doc.relatedImages.length ? doc.relatedImages : [doc.image]
  ).filter(Boolean);
  const base: UIProductDetail = {
    tagline: "",
    desc: doc.description || "",
    gallery,
    highlights: [],
    specs: [],
    box: [],
  };
  if (!doc.itemInfo) return base;
  let parsed: unknown;
  try {
    parsed = JSON.parse(doc.itemInfo);
  } catch {
    return base;
  }
  const info = itemInfoSchema.safeParse(parsed);
  if (!info.success) return base;
  return {
    ...base,
    tagline: info.data.tagline || "",
    highlights: info.data.highlights || [],
    specs: info.data.specs || [],
    box: info.data.box || [],
  };
}

/* ---- public API ---- */

export async function fetchProducts(): Promise<UIProduct[]> {
  try {
    return parseProducts(await getJSON("products/show")).map(toCard);
  } catch (err) {
    console.error("[mason] fetchProducts failed:", (err as Error).message);
    return [];
  }
}

export async function fetchProductBySlug(
  slug: string
): Promise<{ product: UIProduct; detail: UIProductDetail } | null> {
  try {
    const docs = parseProducts(await getJSON("products/show"));
    const doc = docs.find(
      (d) => titleToSlug(d.title) === String(slug).toLowerCase()
    );
    if (!doc) return null;
    return { product: toCard(doc), detail: toDetail(doc) };
  } catch (err) {
    console.error("[mason] fetchProductBySlug failed:", (err as Error).message);
    return null;
  }
}

/* ---- order placement (guest checkout) ---- */

function clientApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
}

export function buildOrderPayload({
  items,
  subtotal,
  form,
  paymentMethod,
  discount = 0,
  shippingCost = 0,
  shippingOption = "Standard",
  userId,
  paymentProvider,
  paymentRef,
}: {
  items: CartItem[];
  subtotal: number;
  form: Record<string, string>;
  paymentMethod: string;
  discount?: number;
  shippingCost?: number;
  shippingOption?: string;
  userId?: string;
  paymentProvider?: string;
  paymentRef?: string;
}): OrderPayload {
  return {
    ...(userId ? { user: userId } : {}),
    ...(paymentProvider ? { paymentProvider } : {}),
    ...(paymentRef ? { paymentRef } : {}),
    cart: items.map((it) => ({
      id: it.id,
      sku: it.sku || it.id,
      title: it.name,
      image: it.img,
      parent: it.cat,
      price: it.price,
      originalPrice: it.price,
      discount: 0,
      orderQuantity: it.qty || 1,
    })),
    name: `${form.firstName || ""} ${form.lastName || ""}`.trim(),
    email: form.email,
    contact: form.phone || "",
    address: form.address,
    city: form.city,
    country: form.country || "Not specified",
    zipCode: form.zipCode,
    subTotal: subtotal,
    shippingCost,
    shippingOption,
    discount,
    totalAmount: Math.max(0, subtotal - discount) + shippingCost,
    paymentMethod,
    status: "pending",
  };
}

export async function placeOrder(payload: OrderPayload): Promise<BackendOrder> {
  const res = await fetch(`${clientApiBase()}/api/order/addOrder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: unknown = await res.json().catch(() => ({}));
  const parsed = addOrderResponseSchema.safeParse(data);
  if (!res.ok || !parsed.success || parsed.data.success === false) {
    const message = (data as { message?: string })?.message;
    throw new Error(message || `Order failed (${res.status})`);
  }
  return parsed.data.order;
}

export async function fetchOrderById(id: string): Promise<BackendOrder | null> {
  try {
    const json = await getJSON(`order/${encodeURIComponent(id)}`);
    const parsed = orderSchema.safeParse(json);
    return parsed.success ? parsed.data : null;
  } catch (err) {
    console.error("[mason] fetchOrderById failed:", (err as Error).message);
    return null;
  }
}

/* ---------------- coupons ---------------- */

const STOREWIDE = ["all", "all products", "storewide", "store-wide", ""];

export async function validateCoupon(
  code: string,
  items: CartItem[],
  subtotal: number
): Promise<AppliedCoupon> {
  const res = await fetch(`${clientApiBase()}/api/coupon`);
  if (!res.ok) throw new Error("Couldn't check that code. Please try again.");
  const json: unknown = await res.json().catch(() => []);
  const raw = Array.isArray(json)
    ? json
    : ((json as Record<string, unknown>)?.data as unknown[]) || [];

  const coupons: BackendCoupon[] = [];
  for (const c of raw) {
    const parsed = couponSchema.safeParse(c);
    if (parsed.success) coupons.push(parsed.data);
  }

  const norm = code.trim().toLowerCase();
  const coupon = coupons.find((c) => c.couponCode.toLowerCase() === norm);
  if (!coupon) throw new Error("Invalid coupon code.");
  if (coupon.endTime && new Date(coupon.endTime).getTime() < Date.now()) {
    throw new Error("This coupon has expired.");
  }
  if (subtotal < coupon.minimumAmount) {
    throw new Error(`Spend at least $${coupon.minimumAmount} to use this coupon.`);
  }

  const pt = coupon.productType.toLowerCase().trim();
  const eligible = STOREWIDE.includes(pt)
    ? items
    : items.filter((i) => (i.cat || "").toLowerCase() === pt);
  const eligibleSubtotal = eligible.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  if (eligibleSubtotal <= 0) {
    throw new Error("This coupon doesn't apply to the items in your bag.");
  }

  const discount = Math.round(eligibleSubtotal * coupon.discountPercentage) / 100;
  return {
    code: coupon.couponCode,
    discountPercentage: coupon.discountPercentage,
    discount,
  };
}

export async function fetchOrderByInvoice(
  orderNumber: string,
  email: string
): Promise<BackendOrder | null> {
  const digits = String(orderNumber || "").replace(/\D/g, "");
  if (!digits) return null;
  const invoice = Number(digits);
  const res = await fetch(`${clientApiBase()}/api/order/orders`);
  if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
  const json: unknown = await res.json().catch(() => ({}));
  const list = Array.isArray(json)
    ? json
    : ((json as Record<string, unknown>)?.data as unknown[]) || [];
  const match = list.find(
    (o) =>
      Number((o as { invoice?: number }).invoice) === invoice &&
      String((o as { email?: string }).email || "").toLowerCase() ===
        email.trim().toLowerCase()
  );
  if (!match) return null;
  const parsed = orderSchema.safeParse(match);
  return parsed.success ? parsed.data : null;
}
