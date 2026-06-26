"use client";

import Link from "next/link";
import { AnnouncementBar } from "@components/mason/AnnouncementBar";
import { Header } from "@components/mason/Header";
import { FooterSlim } from "@components/mason/Footer";
import { Toast } from "@components/mason/Toast";
import { useCart } from "@components/mason/useCart";
import { useToast } from "@components/mason/useToast";
import { money } from "@components/mason/types";

export default function CartPage() {
  const { cart, count, subtotal, inc, dec, remove } = useCart();
  const { message, flash } = useToast();

  const empty = cart.length === 0;
  const shipFree = subtotal >= 150;
  // Flat $10 standard shipping; waived when the bag hits $150.
  const shipping = empty || shipFree ? 0 : 10;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;
  const shipNote = shipFree ? "free shipping" : "free over $150";

  const onRemove = (uid: string) => {
    remove(uid);
    flash("Item removed");
  };
  const onPromo = (e: React.FormEvent) => {
    e.preventDefault();
    flash("That code isn’t valid");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header cartCount={count} cartHref="/cart" />

      {/* TITLE */}
      <div className="max-w-[1240px] mx-auto w-full pt-[54px] px-10">
        <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-[14px]">Shopping bag</div>
        <h1 className="font-display font-medium text-[clamp(34px,4vw,52px)] tracking-[-0.01em] text-ink">Your cart</h1>
      </div>

      {empty ? (
        <div className="flex-1 max-w-[1240px] mx-auto w-full pt-20 pb-[120px] px-10 text-center flex flex-col items-center gap-[22px]">
          <div className="font-serif text-[26px] text-coffee">Your cart is empty</div>
          <p className="text-[14px] text-coffee-3 font-light max-w-[360px]">
            Nothing here yet. Explore the collection and add the pieces that finish your home.
          </p>
          <Link href="/shop" className="bg-ink text-cream no-underline text-[12.5px] tracking-[0.16em] uppercase px-[38px] py-4 font-medium transition-colors duration-300 hover:bg-coffee">
            Continue shopping
          </Link>
        </div>
      ) : (
        <section className="flex-1 max-w-[1240px] mx-auto w-full pt-10 pb-[110px] px-10 grid grid-cols-[1fr_380px] gap-16 items-start">
          {/* LINE ITEMS */}
          <div>
            <div className="grid grid-cols-[1fr_130px_130px] gap-5 pb-4 border-b border-coffee/20 text-[11px] tracking-[0.16em] uppercase text-taupe">
              <div>Item</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>

            {cart.map((it) => (
              <div key={it.uid} className="grid grid-cols-[1fr_130px_130px] gap-5 items-center py-7 border-b border-coffee/10">
                <div className="flex gap-5 items-center">
                  <div className="w-24 flex-none aspect-[4/5] bg-sand-2 overflow-hidden">
                    <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <div className="text-[11px] tracking-[0.14em] uppercase text-taupe">{it.finish}</div>
                    <div className="font-display text-[20px] font-medium text-ink leading-[1.15]">{it.name}</div>
                    <div className="text-[13.5px] text-coffee">{money(it.price)} each</div>
                    <button
                      type="button"
                      onClick={() => onRemove(it.uid)}
                      className="bg-transparent border-0 cursor-pointer text-taupe text-[11.5px] tracking-[0.04em] p-0 mt-1 flex items-center gap-[6px] w-max hover:text-coffee"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex items-center border border-coffee/30">
                    <button type="button" onClick={() => dec(it.uid)} className="w-[38px] h-[44px] bg-transparent border-0 cursor-pointer text-ink text-base hover:bg-sand" aria-label="Decrease">−</button>
                    <span className="w-[34px] text-center text-[14px]">{it.qty}</span>
                    <button type="button" onClick={() => inc(it.uid)} className="w-[38px] h-[44px] bg-transparent border-0 cursor-pointer text-ink text-base hover:bg-sand" aria-label="Increase">+</button>
                  </div>
                </div>
                <div className="text-right text-base text-ink font-medium">{money(it.price * it.qty)}</div>
              </div>
            ))}

            <Link href="/shop" className="inline-flex items-center gap-[9px] mt-[30px] text-coffee no-underline text-[12.5px] tracking-[0.1em] uppercase font-medium hover:opacity-65">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Continue shopping
            </Link>
          </div>

          {/* SUMMARY */}
          <aside className="sticky top-[104px] bg-sand py-[34px] px-8">
            <div className="font-display text-[22px] font-medium text-ink mb-6">Order summary</div>
            <div className="flex justify-between text-[13.5px] text-coffee-2 mb-[14px]"><span>Subtotal</span><span className="text-ink font-medium">{money(subtotal)}</span></div>
            <div className="flex justify-between text-[13.5px] text-coffee-2 mb-[14px]"><span>Shipping</span><span className="text-ink font-medium">{shipping === 0 ? "Free" : money(shipping)}</span></div>
            <div className="flex justify-between text-[13.5px] text-coffee-2 mb-[18px]"><span>Estimated tax</span><span className="text-ink font-medium">{money(tax)}</span></div>

            <form onSubmit={onPromo} className="flex border-b border-coffee/30 mb-[22px]">
              <input type="text" placeholder="Gift or promo code" className="flex-1 bg-transparent border-0 outline-none py-[11px] px-[2px] text-[13px] text-ink font-sans" />
              <button type="submit" className="bg-transparent border-0 cursor-pointer text-coffee text-[11px] tracking-[0.14em] uppercase font-semibold px-1 font-sans">Apply</button>
            </form>

            <div className="flex justify-between items-baseline pt-5 border-t border-coffee/20 mb-6">
              <span className="text-[14px] text-ink font-medium">Total</span>
              <span className="font-serif text-[30px] text-coffee">{money(total)}</span>
            </div>
            <Link href="/checkout" className="block text-center bg-ink text-cream no-underline text-[12.5px] tracking-[0.16em] uppercase py-[17px] font-medium transition-colors duration-300 hover:bg-coffee">
              Proceed to checkout
            </Link>
            <div className="flex items-center justify-center gap-2 mt-4 text-[11.5px] text-taupe">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="10" width="16" height="11" rx="1.5" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              Secure checkout · {shipNote}
            </div>
          </aside>
        </section>
      )}

      <FooterSlim />
      <Toast message={message} />
    </div>
  );
}
