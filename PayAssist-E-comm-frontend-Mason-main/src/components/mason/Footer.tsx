import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink-2 text-taupe pt-20 pb-9 px-10">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 pb-14 border-b border-taupe/20">
          <div>
            <div className="font-display text-2xl font-semibold tracking-[0.06em] text-cream">HOMEBASE</div>
            <div className="text-[9px] tracking-[0.42em] uppercase text-coffee-3 mt-1 mb-[22px]">Supply</div>
            <p className="font-serif text-[18px] leading-[1.55] text-taupe max-w-[300px]">
              Furniture and home goods made to be lived with — and handed down.
            </p>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-sand-2 mb-5">Shop</div>
            <div className="flex flex-col gap-[13px] text-[13.5px]">
              <Link href="/shop?category=decor" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-cream">Objects &amp; Decor</Link>
              <Link href="/shop?category=lighting" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-cream">Sculptural Light</Link>
              <Link href="/shop?category=kitchen" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-cream">Kitchen</Link>
              <Link href="/shop?category=tablescape" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-cream">The Tablescape</Link>
              <Link href="/shop?category=bedroom" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-cream">Bedroom</Link>
            </div>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-sand-2 mb-5">Company</div>
            <div className="flex flex-col gap-[13px] text-[13.5px]">
              <Link href="/about" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-cream">Our story</Link>
              <Link href="/craftsmanship" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-cream">Craftsmanship</Link>
              <Link href="/journal" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-cream">Journal</Link>
            </div>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-sand-2 mb-5">Support</div>
            <div className="flex flex-col gap-[13px] text-[13.5px]">
              <Link href="/contact" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-cream">Contact us</Link>
              <Link href="/shipping" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-cream">Shipping &amp; delivery</Link>
              <Link href="/returns" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-cream">Returns</Link>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-7 flex-wrap gap-[14px] text-[11.5px] tracking-[0.04em] text-coffee-3">
          <div>© 2026 HomeBase Supply. All rights reserved.</div>
          <div className="flex gap-[26px]">
            <Link href="/privacy" className="text-coffee-3 no-underline transition-colors duration-[250ms] hover:text-taupe">Privacy</Link>
            <Link href="/terms" className="text-coffee-3 no-underline transition-colors duration-[250ms] hover:text-taupe">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FooterSlim() {
  return (
    <footer className="bg-ink-2 text-taupe pt-16 pb-9 px-10 mt-auto">
      <div className="max-w-[1360px] mx-auto flex justify-between items-center flex-wrap gap-5">
        <div>
          <div className="font-display text-[22px] font-semibold tracking-[0.06em] text-cream">HOMEBASE</div>
          <div className="text-[9px] tracking-[0.42em] uppercase text-coffee-3 mt-1">Supply</div>
        </div>
        <div className="text-[11.5px] tracking-[0.04em] text-coffee-3">© 2026 HomeBase Supply. All rights reserved.</div>
      </div>
    </footer>
  );
}
