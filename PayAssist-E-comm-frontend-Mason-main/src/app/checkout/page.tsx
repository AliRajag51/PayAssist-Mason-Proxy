"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useCart } from "@components/mason/useCart";
import { money } from "@components/mason/types";
import { products } from "@components/mason/products";
import CheckoutPayment, { type CheckoutContext } from "@components/mason/checkout-payment";
import { buildOrderPayload, validateCoupon } from "@components/mason/catalog-source";
import {
  isStripeConfigured,
  isPaypalConfigured,
} from "@components/mason/payment-source";
import type { CartItem, AppliedCoupon } from "@components/mason/backend-types";
import type { CartLine } from "@components/mason/types";

const shipDefs = [
  { key: "standard", title: "Standard", sub: "5–7 business days", price: 0 },
  { key: "express", title: "Express", sub: "2–3 business days", price: 18 },
];

/* Mason CartLine (UI shape) -> Sona-style CartItem (backend payload shape).
   `finish` maps to `type`; `cat` is looked up from the catalog mock. */
function masonToBackendItems(cart: CartLine[]): CartItem[] {
  return cart.map((line) => {
    const product = products.find((p) => p.id === line.id);
    return {
      id: line.id,
      sku: `MASON-${line.id.toUpperCase()}`,
      name: line.name,
      price: line.price,
      img: line.img,
      type: line.finish || "",
      cat: product?.cat || "",
      qty: line.qty,
    };
  });
}

/* Sona's validateCheckout, ported. Returns an error string or null. */
function validate(form: Record<string, string>, cartLength: number): string | null {
  if (!cartLength) return "Your bag is empty.";
  if (!form.email) return "Please enter your email.";
  if (!form.firstName || !form.lastName) return "Please enter your name.";
  if (!form.address) return "Please enter your shipping address.";
  if (!form.city || !form.zipCode) return "Please enter your city and ZIP.";
  if (!form.country) return "Please enter your country.";
  return null;
}

const defaultMethod: "stripe" | "paypal" = isStripeConfigured
  ? "stripe"
  : isPaypalConfigured
    ? "paypal"
    : "stripe";

export default function CheckoutPage() {
  const { cart, ready, subtotal, clear } = useCart();
  const formRef = useRef<HTMLFormElement>(null);

  const [method, setMethod] = useState<"stripe" | "paypal">(defaultMethod);
  const [ship, setShip] = useState<"standard" | "express">("standard");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const shipObj = shipDefs.find((s) => s.key === ship) || shipDefs[0];
  // Standard: flat $10, waived when subtotal hits $150. Express: always $18.
  const baseShip = subtotal >= 150 ? 0 : 10;
  const shipping = ship === "express" ? shipObj.price : baseShip;
  const discount = appliedCoupon?.discount || 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  // Stable bag lines for Stripe payment metadata (item_N "qty× name").
  // Memoised so PaymentIntent isn't recreated on unrelated re-renders.
  const lineItems = useMemo(
    () => cart.map((it) => ({ name: it.name, qty: it.qty })),
    [cart]
  );
  const backendItems = useMemo(() => masonToBackendItems(cart), [cart]);

  const applyCoupon = async () => {
    setCouponError("");
    setApplyingCoupon(true);
    try {
      setAppliedCoupon(await validateCoupon(couponCode, backendItems, subtotal));
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError((err as Error).message);
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Read + validate the form, then hand a payload factory to the payment methods.
  const buildContext = (): CheckoutContext => {
    const form = formRef.current
      ? (Object.fromEntries(new FormData(formRef.current).entries()) as Record<string, string>)
      : {};
    const invalid = validate(form, cart.length);
    if (invalid) return { ok: false, error: invalid };
    return {
      ok: true,
      makePayload: (provider, paymentRef) =>
        buildOrderPayload({
          items: backendItems,
          subtotal,
          form,
          paymentMethod: provider === "stripe" ? "Card" : "PayPal",
          discount,
          shippingCost: shipping,
          shippingOption: shipObj.title,
          paymentProvider: provider,
          paymentRef,
        }),
    };
  };

  if (ready && cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-coffee/15 bg-cream">
          <div className="max-w-[1200px] mx-auto px-10 h-[78px] flex items-center justify-between">
            <Link href="/" className="text-left no-underline text-ink">
              <div className="font-display text-[22px] font-semibold tracking-[0.06em] leading-none">MASON SKY</div>
              <div className="text-[9px] tracking-[0.42em] uppercase text-taupe mt-[3px]">Enterprises</div>
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center py-20 px-10 text-center">
          <div className="max-w-[440px]">
            <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-4">Checkout</div>
            <h1 className="font-display font-medium text-[clamp(34px,4vw,52px)] tracking-[-0.01em] text-ink leading-[1.1]">
              Your bag is empty
            </h1>
            <p className="font-serif text-[18px] text-coffee mt-4">
              Add a piece to the bag before heading to checkout.
            </p>
            <Link href="/shop" className="inline-block mt-7 bg-ink text-cream no-underline text-[12.5px] tracking-[0.16em] uppercase px-[38px] py-4 font-medium transition-colors duration-300 hover:bg-coffee">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* SLIM HEADER */}
      <header className="border-b border-coffee/15 bg-cream">
        <div className="max-w-[1200px] mx-auto px-10 h-[78px] flex items-center justify-between">
          <Link href="/" className="text-left no-underline text-ink">
            <div className="font-display text-[22px] font-semibold tracking-[0.06em] leading-none">MASON SKY</div>
            <div className="text-[9px] tracking-[0.42em] uppercase text-taupe mt-[3px]">Enterprises</div>
          </Link>
          <div className="flex items-center gap-[9px] text-[11.5px] tracking-[0.1em] uppercase text-coffee-3">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5C4733" strokeWidth="1.5">
              <rect x="4" y="10" width="16" height="11" rx="1.5" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            Secure checkout
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto w-full pt-[18px] pb-2 px-10 text-[11.5px] tracking-[0.06em] text-taupe flex gap-[9px] items-center">
        <Link href="/cart" className="text-taupe no-underline hover:text-coffee">Cart</Link>
        <span>/</span>
        <span className="text-coffee">Checkout</span>
      </div>

      <section className="flex-1 max-w-[1200px] mx-auto w-full pt-[18px] pb-[100px] px-10 grid grid-cols-[1fr_420px] gap-16 items-start">
        {/* Outer form lives outside the payment block so FormData picks up
            contact/shipping/delivery; the Pay button is rendered by the
            payment component (Stripe / PayPal each have their own). */}
        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-11">
          {/* CONTACT */}
          <div>
            <div className="flex items-baseline gap-[14px] mb-[22px]">
              <span className="font-serif text-[24px] text-taupe">01</span>
              <h2 className="font-display text-[22px] font-medium text-ink">Contact</h2>
            </div>
            <input className="ms-field" name="email" type="email" autoComplete="email" required placeholder="Email address" />
            <input className="ms-field mt-[14px]" name="phone" type="tel" autoComplete="tel" placeholder="Phone (optional)" />
            <label className="flex items-center gap-[10px] mt-[14px] text-[13px] text-coffee-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-[15px] h-[15px] accent-coffee" />
              Email me with news and offers
            </label>
          </div>

          {/* SHIPPING */}
          <div>
            <div className="flex items-baseline gap-[14px] mb-[22px]">
              <span className="font-serif text-[24px] text-taupe">02</span>
              <h2 className="font-display text-[22px] font-medium text-ink">Shipping address</h2>
            </div>
            <div className="grid grid-cols-2 gap-[14px]">
              <input className="ms-field" name="firstName" type="text" autoComplete="given-name" required placeholder="First name" />
              <input className="ms-field" name="lastName" type="text" autoComplete="family-name" required placeholder="Last name" />
            </div>
            <input className="ms-field mt-[14px]" name="address" type="text" autoComplete="street-address" required placeholder="Address" />
            <input className="ms-field mt-[14px]" name="address2" type="text" autoComplete="address-line2" placeholder="Apartment, suite, etc. (optional)" />
            <div className="grid grid-cols-[2fr_1.4fr_1fr] gap-[14px] mt-[14px]">
              <input className="ms-field" name="city" type="text" autoComplete="address-level2" required placeholder="City" />
              <input className="ms-field" name="state" type="text" autoComplete="address-level1" placeholder="State" />
              <input className="ms-field" name="zipCode" type="text" autoComplete="postal-code" required placeholder="ZIP" />
            </div>
            <input className="ms-field mt-[14px]" name="country" type="text" autoComplete="country-name" required placeholder="Country" />
          </div>

          {/* DELIVERY */}
          <div>
            <div className="flex items-baseline gap-[14px] mb-[22px]">
              <span className="font-serif text-[24px] text-taupe">03</span>
              <h2 className="font-display text-[22px] font-medium text-ink">Delivery</h2>
            </div>
            <div className="flex flex-col gap-3">
              {shipDefs.map((o) => {
                const on = o.key === ship;
                const eff = o.key === "standard" ? baseShip : o.price;
                const priceLabel = eff === 0 ? "Free" : money(eff);
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setShip(o.key as "standard" | "express")}
                    className={`${on ? "border border-coffee" : "border border-coffee/25"} flex items-center gap-[14px] text-left bg-white cursor-pointer py-[17px] px-[18px] font-sans transition-colors duration-200`}
                  >
                    <span className={`${on ? "border-coffee" : "border-coffee/40"} w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-none`}>
                      <span className={`${on ? "bg-coffee" : "bg-transparent"} w-[9px] h-[9px] rounded-full`} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[14px] text-ink font-medium">{o.title}</span>
                      <span className="block text-[12.5px] text-taupe mt-[2px]">{o.sub}</span>
                    </span>
                    <span className="text-[14px] text-coffee font-medium">{priceLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PAYMENT */}
          <div>
            <div className="flex items-baseline gap-[14px] mb-2">
              <span className="font-serif text-[24px] text-taupe">04</span>
              <h2 className="font-display text-[22px] font-medium text-ink">Payment</h2>
            </div>
            <p className="text-[12.5px] text-taupe mb-[22px] flex items-center gap-[7px]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="4" y="10" width="16" height="11" rx="1.5" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              All transactions are secure and encrypted.
            </p>

            {/* Method selector — 2-column tiles. */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={() => setMethod("stripe")}
                aria-pressed={method === "stripe"}
                className={`${method === "stripe" ? "border-2 border-ink" : "border border-coffee/20"} flex items-center gap-[18px] text-left bg-white cursor-pointer py-[22px] px-[26px] rounded-2xl font-sans transition-all duration-200`}
              >
                <svg width="32" height="22" viewBox="0 0 24 24" fill="none" stroke="#2B2723" strokeWidth="1.4" className="flex-none">
                  <rect x="2" y="6" width="20" height="13" rx="2" />
                  <line x1="2" y1="11" x2="22" y2="11" />
                  <line x1="6" y1="15" x2="10" y2="15" />
                </svg>
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-[19px] font-semibold text-ink leading-tight">Stripe</span>
                  <span className="block text-[13px] text-taupe mt-[3px]">Credit or debit card</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("paypal")}
                aria-pressed={method === "paypal"}
                className={`${method === "paypal" ? "border-2 border-ink" : "border border-coffee/20"} flex items-center gap-[18px] text-left bg-white cursor-pointer py-[22px] px-[26px] rounded-2xl font-sans transition-all duration-200`}
              >
                <span className="flex-none bg-[#FFC439] py-[6px] px-[14px] rounded-full leading-none">
                  <span className="font-bold text-[13px] tracking-tight" style={{ color: "#003087" }}>Pay</span>
                  <span className="font-bold text-[13px] tracking-tight italic" style={{ color: "#009CDE" }}>Pal</span>
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-[19px] font-semibold text-ink leading-tight">PayPal</span>
                  <span className="block text-[13px] text-taupe mt-[3px]">Credit or debit card</span>
                </span>
              </button>
            </div>

            {/* Payment form wrapper — light outer panel, white inner form + Pay button. */}
            <div className="bg-sand-2 rounded-2xl p-[18px]">
              <CheckoutPayment
                method={method}
                total={total}
                lineItems={lineItems}
                getContext={buildContext}
                onPlaced={clear}
              />
            </div>
          </div>
        </form>

        {/* ORDER SUMMARY */}
        <aside className="sticky top-6 bg-sand py-8 px-[30px]">
          <div className="font-display text-[20px] font-medium text-ink mb-[22px]">Order summary</div>
          <div className="flex flex-col gap-[18px] mb-6 max-h-[300px] overflow-y-auto">
            {cart.map((it) => (
              <div key={it.uid} className="grid grid-cols-[58px_1fr_auto] gap-[14px] items-center">
                <div className="relative aspect-square bg-sand-2 overflow-hidden">
                  <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
                  <span className="absolute -top-[7px] -right-[7px] bg-coffee text-cream text-[10px] font-semibold w-[19px] h-[19px] rounded-full flex items-center justify-center">
                    {it.qty}
                  </span>
                </div>
                <div>
                  <div className="text-[13px] font-medium text-ink leading-[1.25]">{it.name}</div>
                  <div className="text-[11px] text-taupe mt-[2px]">{it.finish}</div>
                </div>
                <div className="text-[13px] text-ink font-medium">{money(it.price * it.qty)}</div>
              </div>
            ))}
          </div>

          {/* Discount code */}
          <div className="mb-5">
            <label className="block text-[11px] tracking-[0.18em] uppercase text-ink mb-[8px]">Discount code</label>
            <div className="flex border-b border-coffee/30">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 bg-transparent border-0 outline-none py-[11px] px-[2px] text-[13px] text-ink font-sans"
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={applyingCoupon || !couponCode.trim()}
                className="bg-transparent border-0 cursor-pointer text-coffee text-[11px] tracking-[0.14em] uppercase font-semibold px-1 font-sans disabled:opacity-50"
              >
                {applyingCoupon ? "…" : "Apply"}
              </button>
            </div>
            {couponError && <div className="text-[11.5px] mt-[6px] text-coffee">{couponError}</div>}
            {appliedCoupon && (
              <div className="text-[11.5px] mt-[6px] text-taupe">
                Applied {appliedCoupon.code} (−{appliedCoupon.discountPercentage}%)
              </div>
            )}
          </div>

          <div className="pt-5 border-t border-coffee/20">
            <div className="flex justify-between text-[13px] text-coffee-2 mb-3"><span>Subtotal</span><span className="text-ink font-medium">{money(subtotal)}</span></div>
            {appliedCoupon && (
              <div className="flex justify-between text-[13px] text-coffee-2 mb-3">
                <span>Discount</span>
                <span className="text-ink font-medium">−{money(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[13px] text-coffee-2 mb-3"><span>Shipping</span><span className="text-ink font-medium">{shipping === 0 ? "Free" : money(shipping)}</span></div>
            <div className="flex justify-between items-baseline pt-[18px] border-t border-coffee/20">
              <span className="text-[14px] text-ink font-medium">Total</span>
              <span className="font-serif text-[28px] text-coffee">{money(total)}</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
