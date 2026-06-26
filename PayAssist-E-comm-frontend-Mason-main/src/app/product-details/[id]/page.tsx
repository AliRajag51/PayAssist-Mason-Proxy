"use client";

import { use, useRef, useState } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@components/mason/AnnouncementBar";
import { Header } from "@components/mason/Header";
import { Footer } from "@components/mason/Footer";
import { CartDrawer } from "@components/mason/CartDrawer";
import { Toast } from "@components/mason/Toast";
import { useCart } from "@components/mason/useCart";
import { useToast } from "@components/mason/useToast";
import { money } from "@components/mason/types";
import { products as catalog } from "@components/mason/products";

const finishDefs = [
  { key: "brass", label: "Brass · Opal Glass", swatch: "#C7A878" },
  { key: "bronze", label: "Antique Bronze",    swatch: "#7A5A3C" },
  { key: "black",  label: "Matte Black",        swatch: "#2B2723" },
];

const accDefs = [
  { key: "details", title: "Details & dimensions", body: "H 38cm × W 16cm. Solid hand-turned alabaster shade and base. Warm dimmable LED with an in-line dimmer switch and a 2m braided cord. Each piece weighs roughly 2.4kg." },
  { key: "materials", title: "Materials & care", body: "Natural alabaster, brass fittings, linen-wrapped cord. Dust with a dry, soft cloth. Avoid water and household cleaners, which can mark the stone. Keep out of direct, prolonged sunlight." },
  { key: "shipping", title: "Shipping & returns", body: "Ships within 3 days in protective packaging. Complimentary shipping on orders over $150. Returns accepted within 30 days in original condition — we cover the return label." },
];

function RelatedCard({ r }: { r: { id: string; name: string; cat: string; price: number; img: string } }) {
  const ref = useRef<HTMLImageElement>(null);
  return (
    <Link
      href={`/product-details/${r.id}`}
      className="no-underline block"
      onMouseEnter={() => ref.current && (ref.current.style.transform = "scale(1.06)")}
      onMouseLeave={() => ref.current && (ref.current.style.transform = "scale(1)")}
    >
      <div className="relative overflow-hidden aspect-[4/5] bg-sand-2 mb-4">
        <img
          ref={ref}
          src={r.img}
          alt={r.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
      </div>
      <div className="text-[11px] tracking-[0.16em] uppercase text-taupe mb-[6px]">{r.cat}</div>
      <div className="font-display text-[18px] font-medium text-ink mb-[5px]">{r.name}</div>
      <div className="text-[14px] text-coffee font-medium">{money(r.price)}</div>
    </Link>
  );
}

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lead = catalog.find((p) => p.id === id) ?? catalog.find((p) => p.id === "l11")!;
  const product = {
    id: lead.id,
    name: lead.name,
    cat: lead.cat,
    price: lead.price,
    badge: lead.badge ?? "Best seller",
    reviews: 48,
    desc: lead.desc,
    images: [lead.img],
  };

  // Surface four products from the same category as "related".
  const relatedIds = catalog
    .filter((p) => p.cat === lead.cat && p.id !== lead.id)
    .slice(0, 4)
    .map((p) => p.id);
  const related = relatedIds
    .map((rid) => catalog.find((p) => p.id === rid))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({ id: p.id, name: p.name, cat: p.cat, price: p.price, img: p.img }));

  const { cart, count, subtotal, add, inc, dec, remove } = useCart();
  const { message, flash } = useToast();
  const [qty, setQty] = useState(1);
  const [finish, setFinish] = useState("brass");
  const [wished, setWished] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({ details: true, materials: false, shipping: false });

  const finishObj = finishDefs.find((f) => f.key === finish) || finishDefs[0];

  const onAdd = () => {
    add({ id: product.id, name: product.name, finish: finishObj.label, price: product.price, qty, img: product.images[0] });
    setDrawer(true);
    flash("Added to your cart");
  };

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={count} onCartClick={() => setDrawer(true)} />

      {/* BREADCRUMB */}
      <div className="max-w-[1360px] mx-auto pt-[26px] pb-[6px] px-10 text-[11.5px] tracking-[0.06em] text-taupe flex gap-[9px] items-center">
        <Link href="/" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-coffee">Home</Link>
        <span>/</span>
        <Link href="/shop" className="text-taupe no-underline transition-colors duration-[250ms] hover:text-coffee">{product.cat}</Link>
        <span>/</span>
        <span className="text-coffee">{product.name}</span>
      </div>

      {/* PRODUCT MAIN */}
      <section className="max-w-[1360px] mx-auto pt-6 pb-[100px] px-10 grid grid-cols-[1.08fr_0.92fr] gap-16 items-start">
        {/* IMAGE */}
        <div className="relative overflow-hidden aspect-[4/5] bg-sand-2 sticky top-[104px]">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover block" />
          <div className="absolute top-[18px] left-[18px] bg-cream text-ink text-[10px] tracking-[0.14em] uppercase py-2 px-[13px] font-medium">
            {product.badge}
          </div>
        </div>

        {/* INFO */}
        <div className="pt-1">
          <div className="text-[11px] tracking-[0.2em] uppercase text-taupe mb-[14px]">{product.cat}</div>
          <h1 className="font-display font-medium text-[clamp(34px,3.8vw,48px)] leading-[1.06] tracking-[-0.01em] text-ink">{product.name}</h1>

          <div className="flex items-center gap-4 mt-[18px]">
            <div className="font-serif text-[30px] text-coffee">{money(product.price)}</div>
            <div className="flex items-center gap-2">
              <div className="flex gap-[2px] text-coffee">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m12 2 3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
                  </svg>
                ))}
              </div>
              <span className="text-[12.5px] text-taupe">{product.reviews} reviews</span>
            </div>
          </div>

          <p className="text-[15px] leading-[1.78] text-coffee-3 font-light mt-[26px] max-w-[480px]">{product.desc}</p>

          {/* FINISH */}
          <div className="mt-[34px]">
            <div className="flex justify-between items-baseline mb-[14px]">
              <div className="text-[11px] tracking-[0.18em] uppercase text-ink">Finish</div>
              <div className="text-[12.5px] text-coffee-3">{finishObj.label}</div>
            </div>
            <div className="flex gap-3">
              {finishDefs.map((f) => {
                const ring = f.key === finish ? "outline outline-2 outline-coffee" : "outline outline-2 outline-transparent";
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFinish(f.key)}
                    title={f.label}
                    style={{ background: f.swatch }}
                    className={`${ring} w-[42px] h-[42px] rounded-full cursor-pointer border border-coffee/25 outline-offset-[3px] transition-[outline] duration-200`}
                  />
                );
              })}
            </div>
          </div>

          {/* QTY + ADD */}
          <div className="flex gap-[14px] mt-[34px] items-stretch">
            <div className="flex items-center border border-coffee/30">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-[46px] h-[54px] bg-transparent border-0 cursor-pointer text-ink text-[18px] flex items-center justify-center hover:bg-sand" aria-label="Decrease">−</button>
              <div className="w-[42px] text-center text-[15px] text-ink">{qty}</div>
              <button type="button" onClick={() => setQty((q) => q + 1)} className="w-[46px] h-[54px] bg-transparent border-0 cursor-pointer text-ink text-[18px] flex items-center justify-center hover:bg-sand" aria-label="Increase">+</button>
            </div>
            <button type="button" onClick={onAdd} className="flex-1 bg-ink text-cream border-0 cursor-pointer text-[12.5px] tracking-[0.16em] uppercase font-medium font-sans transition-colors duration-300 hover:bg-coffee">
              Add to cart — {money(product.price)}
            </button>
            <button
              type="button"
              onClick={() => setWished((w) => !w)}
              className="w-[54px] border border-coffee/30 bg-transparent cursor-pointer flex items-center justify-center transition-colors duration-[250ms] hover:bg-sand"
              aria-label="Add to wishlist"
            >
              {wished ? (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#5C4733" stroke="#5C4733" strokeWidth="1.5">
                  <path d="M19.5 12.6 12 20l-7.5-7.4a4.6 4.6 0 0 1 6.5-6.5l1 1 1-1a4.6 4.6 0 0 1 6.5 6.5z" />
                </svg>
              ) : (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2B2723" strokeWidth="1.5">
                  <path d="M19.5 12.6 12 20l-7.5-7.4a4.6 4.6 0 0 1 6.5-6.5l1 1 1-1a4.6 4.6 0 0 1 6.5 6.5z" />
                </svg>
              )}
            </button>
          </div>

          {/* TRUST */}
          <div className="flex flex-col gap-[13px] mt-8 pt-[26px] border-t border-coffee/15">
            <div className="flex gap-3 items-center text-[13px] text-coffee-2">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5C4733" strokeWidth="1.4"><path d="M2 7h11v9H2z" /><path d="M13 10h4l3 3v3h-7z" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
              Free shipping over $150 · ships within 3 days
            </div>
            <div className="flex gap-3 items-center text-[13px] text-coffee-2">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5C4733" strokeWidth="1.4"><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-7 3.5" /><path d="M3 4v4h4" /></svg>
              30-day returns, no questions asked
            </div>
            <div className="flex gap-3 items-center text-[13px] text-coffee-2">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5C4733" strokeWidth="1.4"><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /><path d="m9 12 2 2 4-4" /></svg>
              Hand-finished, two-year guarantee
            </div>
          </div>

          {/* ACCORDION */}
          <div className="mt-[34px] border-t border-coffee/15">
            {accDefs.map((d) => {
              const isOpen = !!open[d.key];
              return (
                <div key={d.key} className="border-b border-coffee/15">
                  <button
                    type="button"
                    onClick={() => setOpen((o) => ({ ...o, [d.key]: !o[d.key] }))}
                    className="w-full flex justify-between items-center bg-transparent border-0 cursor-pointer py-5 px-[2px] font-sans text-[13px] tracking-[0.04em] text-ink text-left"
                  >
                    {d.title}
                    <span className={`${isOpen ? "rotate-45" : "rotate-0"} text-[18px] text-coffee transition-transform duration-300 leading-none`}>+</span>
                  </button>
                  {isOpen ? (
                    <p className="text-[14px] leading-[1.78] text-coffee-3 font-light px-[2px] pb-[22px] max-w-[480px]">{d.body}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 ? (
        <section className="bg-sand py-24">
          <div className="max-w-[1360px] mx-auto px-10">
            <div className="text-center mb-12">
              <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-[14px]">Complete the room</div>
              <h2 className="font-display font-medium text-[clamp(28px,3.2vw,40px)] tracking-[-0.01em] text-ink">You may also like</h2>
            </div>
            <div className="grid grid-cols-4 gap-[26px]">
              {related.map((r) => (
                <RelatedCard key={r.id} r={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
      <CartDrawer
        open={drawer}
        cart={cart}
        subtotal={subtotal}
        count={count}
        onClose={() => setDrawer(false)}
        onInc={inc}
        onDec={dec}
        onRemove={remove}
      />
      <Toast message={message} />
    </>
  );
}
