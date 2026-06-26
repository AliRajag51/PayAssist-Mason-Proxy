"use client";

import Link from "next/link";
import type { CartLine } from "./types";
import { money } from "./types";

type Props = {
  open: boolean;
  cart: CartLine[];
  subtotal: number;
  count: number;
  onClose: () => void;
  onInc: (uid: string) => void;
  onDec: (uid: string) => void;
  onRemove: (uid: string) => void;
};

export function CartDrawer({ open, cart, subtotal, count, onClose, onInc, onDec, onRemove }: Props) {
  if (!open) return null;
  const empty = cart.length === 0;
  const shipNote = subtotal >= 150 ? "You’ve unlocked complimentary shipping." : "Shipping & taxes calculated at checkout.";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-[rgba(26,23,20,0.5)] backdrop-blur-[3px] animate-ms-fade"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 right-0 h-full w-[420px] max-w-[92vw] bg-cream flex flex-col animate-drawer-in shadow-[-20px_0_60px_rgba(26,23,20,0.22)]"
      >
        <div className="flex justify-between items-center py-6 px-7 border-b border-coffee/15">
          <div className="font-display text-[20px] font-medium text-ink">
            Your cart <span className="text-[13px] text-taupe font-sans">({count})</span>
          </div>
          <button type="button" onClick={onClose} className="bg-transparent border-0 cursor-pointer text-ink flex" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {empty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 gap-[18px]">
            <div className="font-serif text-2xl text-coffee">Your cart is empty</div>
            <Link href="/shop" className="bg-ink text-cream no-underline text-[12px] tracking-[0.16em] uppercase py-[15px] px-8 font-medium">
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-2 px-7">
              {cart.map((it) => (
                <div key={it.uid} className="grid grid-cols-[74px_1fr_auto] gap-4 py-[22px] border-b border-coffee/10">
                  <div className="aspect-[4/5] bg-sand-2 overflow-hidden">
                    <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <div className="font-display text-[15px] font-medium text-ink leading-[1.2]">{it.name}</div>
                    <div className="text-[11px] text-taupe tracking-[0.04em]">{it.finish}</div>
                    <div className="flex items-center border border-coffee/25 w-max mt-[6px]">
                      <button type="button" onClick={() => onDec(it.uid)} className="w-7 h-7 bg-transparent border-0 cursor-pointer text-ink text-[14px]" aria-label="Decrease">−</button>
                      <span className="w-[26px] text-center text-[12.5px]">{it.qty}</span>
                      <button type="button" onClick={() => onInc(it.uid)} className="w-7 h-7 bg-transparent border-0 cursor-pointer text-ink text-[14px]" aria-label="Increase">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-[14px] text-coffee font-medium">{money(it.price * it.qty)}</div>
                    <button type="button" onClick={() => onRemove(it.uid)} className="bg-transparent border-0 cursor-pointer text-taupe text-[11px] tracking-[0.04em] underline p-0 hover:text-coffee">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="py-[22px] px-7 pb-[26px] border-t border-coffee/15 bg-sand">
              <div className="flex justify-between text-[13px] text-coffee-3 mb-2">
                <span>Subtotal</span>
                <span className="text-ink font-medium">{money(subtotal)}</span>
              </div>
              <div className="text-[11.5px] text-taupe mb-[18px]">{shipNote}</div>
              <Link href="/checkout" className="block text-center bg-ink text-cream no-underline text-[12.5px] tracking-[0.16em] uppercase p-4 font-medium mb-[10px] transition-colors duration-300 hover:bg-coffee">
                Checkout — {money(subtotal)}
              </Link>
              <Link href="/cart" className="block text-center border border-ink text-ink no-underline text-[12.5px] tracking-[0.16em] uppercase p-[15px] font-medium transition-colors duration-300 hover:bg-ink hover:text-cream">
                View full cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
