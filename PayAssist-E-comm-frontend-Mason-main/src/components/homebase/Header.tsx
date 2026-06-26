"use client";

import Link from "next/link";

type HeaderProps = {
  cartCount: number;
  activeNav?: "decor" | "lighting" | "kitchen" | "storage";
  onCartClick?: () => void;
  cartHref?: string;
};

export function Header({ cartCount, activeNav, onCartClick, cartHref }: HeaderProps) {
  const isActive = (k: string) => activeNav === k;
  const linkCls = (k: string) =>
    `no-underline transition-colors duration-[250ms] ${isActive(k) ? "text-coffee font-medium" : "text-ink hover:text-coffee"}`;

  const cartBtn = (
    <>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 8h12l1 12H5z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </svg>
      <span className="absolute -top-[7px] -right-[9px] bg-coffee text-cream text-[9.5px] font-semibold min-w-[15px] h-[15px] rounded-[9px] flex items-center justify-center px-[3px]">
        {cartCount}
      </span>
    </>
  );

  return (
    <header className="sticky top-0 z-[60] bg-cream/80 backdrop-blur-[14px] border-b border-coffee/15">
      <div className="max-w-[1360px] mx-auto px-10 h-[78px] grid grid-cols-[1fr_auto_1fr] items-center">
        <nav className="flex gap-[34px] items-center text-[13px] tracking-[0.04em]">
          <Link href="/shop?category=decor" className={linkCls("decor")}>Decor</Link>
          <Link href="/shop?category=lighting" className={linkCls("lighting")}>Lighting</Link>
          <Link href="/shop?category=kitchen" className={linkCls("kitchen")}>Kitchen</Link>
          <Link href="/shop?category=storage" className={linkCls("storage")}>Storage</Link>
        </nav>
        <Link href="/" className="text-center no-underline text-ink">
          <div className="font-display text-[23px] font-semibold tracking-[0.06em] leading-none">HOMEBASE</div>
          <div className="text-[9px] tracking-[0.42em] uppercase text-taupe mt-[3px]">Supply</div>
        </Link>
        <div className="flex gap-[22px] items-center justify-end text-ink">
          <Link href="/shop" className="flex text-ink no-underline transition-colors duration-[250ms] hover:text-coffee" aria-label="Search">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.5" y2="16.5" />
            </svg>
          </Link>
          <button type="button" className="flex bg-transparent border-0 cursor-pointer text-ink transition-colors duration-[250ms] hover:text-coffee" aria-label="Wishlist">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19.5 12.6 12 20l-7.5-7.4a4.6 4.6 0 0 1 6.5-6.5l1 1 1-1a4.6 4.6 0 0 1 6.5 6.5z" />
            </svg>
          </button>
          {onCartClick ? (
            <button
              type="button"
              onClick={onCartClick}
              className="relative flex bg-transparent border-0 cursor-pointer text-ink transition-colors duration-[250ms] hover:text-coffee"
              aria-label="Cart"
            >
              {cartBtn}
            </button>
          ) : (
            <Link
              href={cartHref ?? "/cart"}
              className="relative flex text-ink no-underline transition-colors duration-[250ms] hover:text-coffee"
              aria-label="Cart"
            >
              {cartBtn}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
