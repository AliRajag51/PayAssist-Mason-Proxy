"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@components/mason/AnnouncementBar";
import { Header } from "@components/mason/Header";
import { Footer } from "@components/mason/Footer";
import { ProductCard } from "@components/mason/ProductCard";
import { QuickViewModal } from "@components/mason/QuickViewModal";
import { Toast } from "@components/mason/Toast";
import { useCart } from "@components/mason/useCart";
import { useReveal } from "@components/mason/useReveal";
import { useToast } from "@components/mason/useToast";
import { products } from "@components/mason/products";
import type { Product } from "@components/mason/types";

const catDefs: [string, string][] = [
  ["all", "All"],
  ["decor", "Objects & Decor"],
  ["lighting", "Sculptural Light"],
  ["kitchen", "Kitchen"],
  ["tablescape", "The Tablescape"],
  ["shelf", "The Shelf, Styled"],
  ["storage", "Storage"],
  ["bedroom", "Bedroom"],
];

const sortDefs: [string, string][] = [
  ["featured", "Featured"],
  ["low", "Price ↑"],
  ["high", "Price ↓"],
];

const priceBands = ["Under $50", "$50 – $100", "$100 – $200", "$200 – $300"];
const materials = ["Stoneware", "Linen", "Brass", "Alabaster", "Seagrass", "Travertine"];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

function ShopPageContent() {
  const { count, add } = useCart();
  const { message, flash } = useToast();
  const [wish, setWish] = useState<Record<string, boolean>>({});
  const [quick, setQuick] = useState<Product | null>(null);
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("featured");
  const [shown, setShown] = useState(9);

  // Honor `?category=<key>` reactively so clicking a header/footer/featured
  // link while already on /shop re-filters in place (not just on first mount).
  // Resets pagination so each collection opens at the top.
  const searchParams = useSearchParams();
  const queryCat = searchParams.get("category");
  useEffect(() => {
    if (queryCat && catDefs.some(([key]) => key === queryCat)) {
      setCat(queryCat);
    } else if (queryCat === null) {
      setCat("all");
    }
    setShown(9);
  }, [queryCat]);

  const list = useMemo(() => {
    const res = cat === "all" ? products.slice() : products.filter((p) => norm(p.cat) === cat);
    if (sort === "low") res.sort((a, b) => a.price - b.price);
    if (sort === "high") res.sort((a, b) => b.price - a.price);
    return res;
  }, [cat, sort]);

  const visible = list.slice(0, shown);
  useReveal([visible.length, message, quick]);

  const toggleWish = (id: string) => setWish((w) => ({ ...w, [id]: !w[id] }));
  const openQuick = (id: string) => setQuick(products.find((p) => p.id === id) || null);
  const closeQuick = () => setQuick(null);
  const addToCart = () => {
    if (quick) add({ id: quick.id, name: quick.name, finish: quick.cat, price: quick.price, qty: 1, img: quick.img });
    setQuick(null);
    flash("Added to your cart");
  };

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={count} activeNav="decor" />

      {/* CATEGORY HEADER */}
      <section className="relative h-[46vh] min-h-[340px] overflow-hidden flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2000&q=80"
          alt="Styled home accessories"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,23,20,0.32)] to-[rgba(26,23,20,0.5)]" />
        <div className="relative text-center text-cream max-w-[620px] px-7">
          <div className="text-[11px] tracking-[0.3em] uppercase text-[rgba(244,239,231,0.82)] mb-4">Home · Shop all</div>
          <h1 className="font-display font-medium text-[clamp(38px,5vw,64px)] tracking-[-0.01em] leading-[1.04]">Decor &amp; Accessories</h1>
          <p className="font-serif text-[clamp(18px,2vw,22px)] leading-[1.5] mt-4 text-[rgba(244,239,231,0.92)]">
            Lamps, ceramics, textiles and the small things that finish a room — beautifully made, fairly priced.
          </p>
        </div>
      </section>

      {/* TOOLBAR */}
      <div className="sticky top-[78px] z-40 bg-cream/90 backdrop-blur-[10px] border-b border-coffee/15">
        <div className="max-w-[1360px] mx-auto px-10 h-[62px] flex items-center justify-between">
          <div className="text-[12.5px] text-coffee-3 tracking-[0.04em]">{list.length} products</div>
          <div className="flex items-center gap-[10px]">
            <span className="text-[11px] tracking-[0.16em] uppercase text-taupe">Sort</span>
            <div className="flex gap-1">
              {sortDefs.map(([key, label]) => {
                const on = sort === key;
                const cls = on ? "bg-ink text-cream border border-ink" : "bg-transparent text-coffee-2 border border-coffee/30";
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSort(key)}
                    className={`${cls} cursor-pointer text-[11.5px] tracking-[0.06em] py-[9px] px-4 font-sans transition-all duration-[250ms]`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <section className="max-w-[1360px] mx-auto pt-12 pb-[100px] px-10 grid grid-cols-[228px_1fr] gap-[54px] items-start">
        {/* FILTERS */}
        <aside className="sticky top-[160px] flex flex-col gap-[38px]">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-ink mb-[18px] pb-[14px] border-b border-coffee/20">Category</div>
            <div className="flex flex-col gap-[13px]">
              {catDefs.map(([key, name]) => {
                const c = key === "all" ? products.length : products.filter((p) => norm(p.cat) === key).length;
                const active = cat === key;
                const cls = active ? "text-coffee font-semibold" : "text-coffee-2 font-normal";
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setCat(key);
                      setShown(9);
                    }}
                    className={`${cls} text-left bg-transparent border-0 cursor-pointer text-[13.5px] font-sans flex justify-between transition-colors duration-[250ms]`}
                  >
                    {name}
                    <span className="text-taupe font-normal">{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-ink mb-[18px] pb-[14px] border-b border-coffee/20">Price</div>
            <div className="flex flex-col gap-[13px]">
              {priceBands.map((b) => (
                <label key={b} className="flex items-center gap-[11px] text-[13.5px] text-coffee-2 cursor-pointer">
                  <span className="w-[15px] h-[15px] border border-taupe inline-block" />
                  {b}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-ink mb-[18px] pb-[14px] border-b border-coffee/20">Material</div>
            <div className="flex flex-wrap gap-[9px]">
              {materials.map((m) => (
                <span key={m} className="text-[12px] text-coffee-2 border border-coffee/30 py-[7px] px-[13px] rounded-full">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-[30px]">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wished={!!wish[p.id]}
              onToggleWish={toggleWish}
              onQuickView={openQuick}
            />
          ))}
        </div>
      </section>

      {/* LOAD MORE */}
      <div className="text-center pb-[110px] px-10">
        <button
          type="button"
          onClick={() => setShown((s) => s + 9)}
          className="border border-ink bg-transparent text-ink cursor-pointer text-[12.5px] tracking-[0.16em] uppercase px-[50px] py-[17px] font-medium font-sans transition-colors duration-300 hover:bg-ink hover:text-cream"
        >
          {shown >= list.length ? "Showing all" : "Load more"}
        </button>
      </div>

      <Footer />
      <QuickViewModal product={quick} onClose={closeQuick} onAdd={addToCart} />
      <Toast message={message} />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  );
}
