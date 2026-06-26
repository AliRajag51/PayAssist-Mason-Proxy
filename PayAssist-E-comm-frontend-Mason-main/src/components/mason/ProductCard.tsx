"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Product } from "./types";
import { money } from "./types";

type Props = {
  product: Product;
  wished: boolean;
  onToggleWish: (id: string) => void;
  onQuickView: (id: string) => void;
};

export function ProductCard({ product, wished, onToggleWish, onQuickView }: Props) {
  const quickRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    if (quickRef.current) {
      quickRef.current.style.opacity = "1";
      quickRef.current.style.transform = "translateY(0)";
    }
  };
  const onLeave = () => {
    if (quickRef.current) {
      quickRef.current.style.opacity = "0";
      quickRef.current.style.transform = "translateY(8px)";
    }
  };

  return (
    <div data-reveal className="bg-transparent">
      <div
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="relative overflow-hidden aspect-[4/5] bg-sand-2 mb-[18px]"
      >
        <Link href={`/product-details/${product.id}`} className="block w-full h-full">
          <img
            src={product.img}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </Link>
        {product.badge ? (
          <div className="absolute top-4 left-4 bg-cream text-ink text-[10px] tracking-[0.14em] uppercase px-3 py-[7px] font-medium z-[3]">
            {product.badge}
          </div>
        ) : null}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWish(product.id);
          }}
          className="absolute top-[14px] right-[14px] w-[38px] h-[38px] rounded-full bg-cream/90 border-0 cursor-pointer flex items-center justify-center z-[3] transition-colors duration-[250ms] hover:bg-cream"
          aria-label="Add to wishlist"
        >
          {wished ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#5C4733" stroke="#5C4733" strokeWidth="1.5">
              <path d="M19.5 12.6 12 20l-7.5-7.4a4.6 4.6 0 0 1 6.5-6.5l1 1 1-1a4.6 4.6 0 0 1 6.5 6.5z" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2B2723" strokeWidth="1.5">
              <path d="M19.5 12.6 12 20l-7.5-7.4a4.6 4.6 0 0 1 6.5-6.5l1 1 1-1a4.6 4.6 0 0 1 6.5 6.5z" />
            </svg>
          )}
        </button>
        <div
          ref={quickRef}
          className="absolute left-0 right-0 bottom-0 p-[14px] opacity-0 translate-y-2 transition-[opacity,transform] duration-[350ms] z-[3]"
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product.id);
            }}
            className="w-full bg-ink/90 text-cream border-0 cursor-pointer text-[11.5px] tracking-[0.16em] uppercase p-[14px] font-medium font-sans transition-colors duration-[250ms] hover:bg-ink"
          >
            Quick view
          </button>
        </div>
      </div>
      <div className="text-left">
        <div className="text-[11px] tracking-[0.16em] uppercase text-taupe mb-[6px]">{product.cat}</div>
        <div className="font-display text-[19px] font-medium text-ink mb-[6px]">{product.name}</div>
        <div className="text-[14px] text-coffee font-medium">{money(product.price)}</div>
      </div>
    </div>
  );
}
