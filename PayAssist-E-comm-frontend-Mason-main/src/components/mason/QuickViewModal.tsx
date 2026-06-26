"use client";

import type { Product } from "./types";
import { money } from "./types";

type Props = {
  product: Product | null;
  onClose: () => void;
  onAdd: () => void;
};

export function QuickViewModal({ product, onClose, onAdd }: Props) {
  if (!product) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-[rgba(26,23,20,0.55)] backdrop-blur-[4px] flex items-center justify-center p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-cream max-w-[880px] w-full max-h-[88vh] overflow-hidden grid grid-cols-2 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-[38px] h-[38px] rounded-full bg-cream/90 border-0 cursor-pointer flex items-center justify-center z-[5]"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B2723" strokeWidth="1.5">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
        <div className="bg-sand-2">
          <img src={product.img} alt={product.name} className="w-full h-full object-cover min-h-[380px]" />
        </div>
        <div className="py-12 px-11 flex flex-col justify-center">
          <div className="text-[11px] tracking-[0.18em] uppercase text-taupe mb-3">{product.cat}</div>
          <h3 className="font-display text-[30px] font-medium text-ink leading-[1.1]">{product.name}</h3>
          <div className="font-serif text-2xl text-coffee mt-3 mb-5">{money(product.price)}</div>
          <p className="text-[14px] leading-[1.75] text-coffee-3 font-light mb-[30px]">{product.desc}</p>
          <button
            type="button"
            onClick={onAdd}
            className="bg-ink text-cream border-0 cursor-pointer text-[12.5px] tracking-[0.16em] uppercase px-8 py-4 font-medium font-sans transition-colors duration-300 hover:bg-coffee"
          >
            Add to cart — {money(product.price)}
          </button>
        </div>
      </div>
    </div>
  );
}
