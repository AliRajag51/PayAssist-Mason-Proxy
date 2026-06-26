"use client";

import { useRef, useState } from "react";
import Link from "next/link";
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

// Each card carries the shop-filter `key` so clicking a category opens the shop
// pre-filtered to that section (no cross-category landing).
const categories = [
  { name: "Objects & Decor", count: 10, key: "decor",      img: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80" },
  { name: "Sculptural Light",count: 10, key: "lighting",   img: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=900&q=80" },
  { name: "Kitchen",         count: 12, key: "kitchen",    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80" },
  { name: "The Tablescape",  count: 12, key: "tablescape", img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80" },
  { name: "Bedroom",         count: 8, key: "bedroom",    img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80" },
  { name: "Storage",         count: 10, key: "storage",    img: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=900&q=80" },
];

const journal = [
  { tag: "Styling", title: "How to layer a living room", text: "Start with one anchor piece, then build texture outward — wool, linen, oak and a little patina.", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80" },
  { tag: "Materials", title: "Living with natural linen", text: "Why we choose heavyweight Belgian linen, and how it softens into the best version of itself.", img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=80" },
  { tag: "The home", title: "Building a calm bedroom", text: "A restrained palette, low furniture and warm light — the quiet rules of a restful room.", img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80" },
];

const reviews = [
  { quote: "The alabaster lamp is the most beautiful thing in our bedroom. The light it casts at night is so warm — photos don’t do the stone justice.", name: "Eleanor M.", meta: "Alabaster Table Lamp · Brooklyn, NY" },
  { quote: "Everything feels considered — from the glaze on the vessel to the note tucked in the box. These are the small pieces that make a home feel finished.", name: "James & Priya R.", meta: "Hand-thrown Vessel · Austin, TX" },
  { quote: "I keep reaching for the alpaca throw every evening. Impossibly soft, beautifully made, and worth every penny at the price.", name: "Sofia L.", meta: "Alpaca Throw · Portland, OR" },
];

const bestSellerIds = ["l11", "b61", "k27", "d1"];
const bestSellers = bestSellerIds.map((id) => products.find((p) => p.id === id)!).filter(Boolean);

function Zoomable({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const enter = () => {
    const z = ref.current?.querySelector("[data-zoom]") as HTMLElement | null;
    if (z) z.style.transform = "scale(1.06)";
  };
  const leave = () => {
    const z = ref.current?.querySelector("[data-zoom]") as HTMLElement | null;
    if (z) z.style.transform = "scale(1)";
  };
  return (
    <div ref={ref} onMouseEnter={enter} onMouseLeave={leave} className={className}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const { count, add } = useCart();
  const { message, flash } = useToast();
  const [wish, setWish] = useState<Record<string, boolean>>({});
  const [quick, setQuick] = useState<(typeof products)[number] | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  useReveal([quick, message]);

  const toggleWish = (id: string) => setWish((w) => ({ ...w, [id]: !w[id] }));
  const openQuick = (id: string) => {
    const p = products.find((x) => x.id === id) || null;
    setQuick(p);
  };
  const closeQuick = () => setQuick(null);
  const addToCart = () => {
    if (quick) add({ id: quick.id, name: quick.name, finish: quick.cat, price: quick.price, qty: 1, img: quick.img });
    setQuick(null);
    flash("Added to your cart");
  };
  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    flash("You’re on the list");
  };

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={count} />

      {/* 1. HERO */}
      <section className="relative h-[calc(100vh-78px)] min-h-[640px] max-h-[900px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury living room"
            className="w-full h-full object-cover animate-kenburns"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,23,20,0.28)] via-[rgba(26,23,20,0.18)] via-40% to-[rgba(26,23,20,0.5)]" />
        <div data-reveal className="relative text-center text-cream max-w-[760px] px-7">
          <div className="text-[12px] tracking-[0.4em] uppercase mb-[26px] text-[rgba(244,239,231,0.86)]">The Spring Collection</div>
          <h1 className="font-display font-medium text-[clamp(44px,6.4vw,86px)] leading-[1.04] tracking-[-0.01em]">
            Crafted for the<br />way you live
          </h1>
          <p className="font-serif text-[clamp(19px,2.1vw,25px)] leading-[1.5] mx-auto mt-[26px] mb-[38px] max-w-[520px] text-[rgba(244,239,231,0.92)] font-normal">
            Considered objects, lighting and accessories for the modern home — small things, beautifully made.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop" className="bg-cream text-ink no-underline text-[12.5px] tracking-[0.16em] uppercase px-[38px] py-[17px] font-medium transition-colors duration-300 hover:bg-ink hover:text-cream">
              Shop the collection
            </Link>
            <a href="#collections" className="border border-[rgba(244,239,231,0.7)] text-cream no-underline text-[12.5px] tracking-[0.16em] uppercase px-[38px] py-[17px] font-medium transition-colors duration-300 hover:bg-[rgba(244,239,231,0.12)]">
              Explore the edit
            </a>
          </div>
        </div>
        <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 text-[rgba(244,239,231,0.7)] text-[10px] tracking-[0.3em] uppercase flex flex-col items-center gap-[9px]">
          Scroll
          <span className="w-px h-[34px] bg-gradient-to-b from-[rgba(244,239,231,0.7)] to-transparent" />
        </div>
      </section>

      {/* 2. CATEGORIES */}
      <section className="max-w-[1360px] mx-auto pt-[108px] pb-[30px] px-10">
        <div data-reveal className="text-center mb-[54px]">
          <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-4">Shop by category</div>
          <h2 className="font-display font-medium text-[clamp(30px,3.6vw,46px)] tracking-[-0.01em] text-ink">Style every corner</h2>
        </div>
        <div className="grid grid-cols-3 gap-[22px]">
          {categories.map((cat) => (
            <Link key={cat.name} href={`/shop?category=${cat.key}`} data-reveal className="no-underline block">
              <Zoomable className="relative overflow-hidden aspect-[4/3] bg-sand-2 block">
                <img
                  data-zoom
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[45%] to-[rgba(26,23,20,0.42)]" />
                <div className="absolute left-6 bottom-[22px] text-cream">
                  <div className="font-display text-2xl font-medium leading-[1.1]">{cat.name}</div>
                  <div className="text-[11px] tracking-[0.14em] uppercase text-[rgba(244,239,231,0.82)] mt-[5px]">{cat.count} pieces</div>
                </div>
              </Zoomable>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS */}
      <section id="collections" className="max-w-[1360px] mx-auto py-[108px] px-10">
        <div data-reveal className="flex justify-between items-end mb-12 flex-wrap gap-4">
          <div>
            <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-4">Featured collections</div>
            <h2 className="font-display font-medium text-[clamp(30px,3.6vw,46px)] tracking-[-0.01em] text-ink max-w-[520px]">
              Considered, collected,<br />made to last
            </h2>
          </div>
          <Link href="/shop" className="text-[12px] tracking-[0.14em] uppercase text-coffee no-underline border-b border-coffee pb-1 whitespace-nowrap transition-opacity duration-[250ms] hover:opacity-60">
            View all collections
          </Link>
        </div>
        <div className="grid grid-cols-[1.5fr_1fr] gap-[22px] mb-[22px] items-stretch">
          <Link href="/shop?category=tablescape" data-reveal className="no-underline block">
            <Zoomable className="relative overflow-hidden aspect-[16/11] bg-sand-2 block">
              <img data-zoom src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80" alt="The Tablescape" className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(26,23,20,0.5)] from-0% to-transparent to-60%" />
              <div className="absolute left-[38px] bottom-9 text-cream max-w-[340px]">
                <div className="text-[11px] tracking-[0.26em] uppercase text-[rgba(244,239,231,0.82)] mb-3">New season</div>
                <div className="font-display text-[34px] font-medium leading-[1.08]">The Tablescape</div>
                <div className="font-serif text-[19px] mt-[10px] text-[rgba(244,239,231,0.9)]">Stoneware, glass and linen for the table you gather around.</div>
              </div>
            </Zoomable>
          </Link>
          <Link href="/shop?category=shelf" data-reveal className="no-underline block h-full">
            <Zoomable className="relative overflow-hidden h-full min-h-full bg-sand-2 block">
              <img data-zoom src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80" alt="The Shelf, Styled" className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[40%] to-[rgba(26,23,20,0.55)]" />
              <div className="absolute left-8 bottom-8 text-cream max-w-[280px]">
                <div className="font-display text-[28px] font-medium leading-[1.08]">The Shelf, Styled</div>
                <div className="font-serif text-[18px] mt-2 text-[rgba(244,239,231,0.9)]">Objects, books and quiet sculpture.</div>
              </div>
            </Zoomable>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-[22px]">
          {[
            { label: "Sculptural Light", key: "lighting", src: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80" },
            { label: "Objects & Decor",  key: "decor",    src: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80" },
            { label: "The Kitchen",      key: "kitchen",  src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80" },
          ].map((tile) => (
            <Link key={tile.label} href={`/shop?category=${tile.key}`} data-reveal className="no-underline block">
              <Zoomable className="relative overflow-hidden aspect-square bg-sand-2 block">
                <img data-zoom src={tile.src} alt={tile.label} className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-1/2 to-[rgba(26,23,20,0.5)]" />
                <div className="absolute left-7 bottom-[26px] text-cream">
                  <div className="font-display text-2xl font-medium">{tile.label}</div>
                </div>
              </Zoomable>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS */}
      <section className="bg-sand py-[108px]">
        <div className="max-w-[1360px] mx-auto px-10">
          <div data-reveal className="text-center mb-[54px]">
            <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-4">Most loved</div>
            <h2 className="font-display font-medium text-[clamp(30px,3.6vw,46px)] tracking-[-0.01em] text-ink">Best sellers</h2>
          </div>
          <div className="grid grid-cols-4 gap-[26px]">
            {bestSellers.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                wished={!!wish[p.id]}
                onToggleWish={toggleWish}
                onQuickView={openQuick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIVING ROOM INSPIRATION */}
      <section className="relative h-[78vh] min-h-[520px] overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=2000&q=80"
          alt="Living room inspiration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(26,23,20,0.6)] from-0% via-[rgba(26,23,20,0.15)] via-[55%] to-transparent" />
        <div data-reveal className="relative max-w-[1360px] w-full mx-auto px-10">
          <div className="max-w-[480px] text-cream">
            <div className="text-[11.5px] tracking-[0.32em] uppercase text-[rgba(244,239,231,0.8)] mb-[18px]">Living with objects</div>
            <h2 className="font-display font-medium text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.01em]">
              The details<br />make the home
            </h2>
            <p className="font-serif text-[22px] leading-[1.5] mt-[22px] mb-8 text-[rgba(244,239,231,0.92)]">
              A vessel on the mantel, a lamp that glows warm at dusk, a throw within reach. The small things are what make a house feel like yours.
            </p>
            <Link href="/shop" className="inline-block bg-cream text-ink no-underline text-[12.5px] tracking-[0.16em] uppercase px-9 py-4 font-medium transition-colors duration-300 hover:bg-ink hover:text-cream">
              Shop the edit
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PRODUCT SPOTLIGHT */}
      {(() => {
        const sp = products.find((p) => p.id === "l11")!;
        return (
          <section className="max-w-[1360px] mx-auto py-[118px] px-10">
            <div className="grid grid-cols-[1.05fr_0.95fr] items-stretch bg-sand">
              <Zoomable className="relative overflow-hidden min-h-[560px]">
                <div data-reveal className="absolute inset-0">
                  <img data-zoom src={sp.img} alt={sp.name} className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                </div>
              </Zoomable>
              <div data-reveal className="p-[clamp(40px,5vw,76px)] flex flex-col justify-center">
                <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-[18px]">Featured · Lighting</div>
                <h2 className="font-display font-medium text-[clamp(34px,4vw,52px)] leading-[1.06] tracking-[-0.01em] text-ink">{sp.name}</h2>
                <div className="font-serif text-[27px] text-coffee mt-[14px] mb-6">${sp.price}</div>
                <p className="text-[15px] leading-[1.75] text-coffee-3 font-light max-w-[440px]">{sp.desc}</p>
                <div className="flex flex-col gap-[14px] mt-[30px] mb-[34px]">
                  <div className="flex gap-3 items-center text-[13.5px] text-ink"><span className="w-[5px] h-[5px] rounded-full bg-coffee" />Hand-finished brass, opal glass diffuser</div>
                  <div className="flex gap-3 items-center text-[13.5px] text-ink"><span className="w-[5px] h-[5px] rounded-full bg-coffee" />Warm dimmable LED, soft and even glow</div>
                  <div className="flex gap-3 items-center text-[13.5px] text-ink"><span className="w-[5px] h-[5px] rounded-full bg-coffee" />Ships in protective packaging within 3 days</div>
                </div>
                <div className="flex gap-[14px] flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      add({ id: sp.id, name: sp.name, finish: "Brass · Opal Glass", price: sp.price, qty: 1, img: sp.img });
                      flash("Added to your cart");
                    }}
                    className="bg-ink text-cream border-0 cursor-pointer text-[12.5px] tracking-[0.16em] uppercase px-10 py-[17px] font-medium font-sans transition-colors duration-300 hover:bg-coffee"
                  >
                    Add to cart
                  </button>
                  <Link href={`/product-details/${sp.id}`} className="border border-ink text-ink no-underline text-[12.5px] tracking-[0.16em] uppercase px-10 py-[17px] font-medium transition-colors duration-300 hover:bg-ink hover:text-cream">
                    View details
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 7. WHY HOMEBASE SUPPLY */}
      <section className="bg-ink text-sand-2 py-24">
        <div className="max-w-[1360px] mx-auto px-10">
          <div data-reveal className="text-center mb-[62px]">
            <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-4">Why HomeBase Supply</div>
            <h2 className="font-display font-medium text-[clamp(28px,3.4vw,42px)] tracking-[-0.01em] text-cream">A standard you can feel</h2>
          </div>
          <div className="grid grid-cols-4 gap-12">
            {[
              { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/></svg>, title: "Uncompromising quality", text: "Natural materials — stoneware, linen, brass and alabaster — chosen to age beautifully." },
              { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="m14 6 4 4-9 9-4 1 1-4z"/><path d="M14 6 17 3l4 4-3 3z"/></svg>, title: "Made by craftspeople", text: "Made in small batches by independent makers, and finished by hand." },
              { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 7h11v9H2z"/><path d="M13 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>, title: "Fast, careful shipping", text: "Every order is packed by hand and shipped quickly, protected for the journey." },
              { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title: "Care, for the long run", text: "Styling help before you buy and a real team after — we’re here for the long run." },
            ].map((c) => (
              <div key={c.title} data-reveal className="text-center">
                <div className="flex justify-center mb-[22px] text-sand-3">{c.icon}</div>
                <h3 className="font-display text-[21px] font-medium text-cream mb-3">{c.title}</h3>
                <p className="text-[13.5px] leading-[1.7] text-taupe font-light">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. JOURNAL */}
      <section className="max-w-[1360px] mx-auto pt-[118px] pb-[60px] px-10">
        <div data-reveal className="text-center mb-[60px]">
          <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-4">The Journal</div>
          <h2 className="font-display font-medium text-[clamp(30px,3.6vw,46px)] tracking-[-0.01em] text-ink">Home styling inspiration</h2>
        </div>
        <div className="grid grid-cols-3 gap-[30px]">
          {journal.map((j) => (
            <Link key={j.title} href="/shop" data-reveal className="no-underline block">
              <Zoomable className="relative overflow-hidden aspect-[5/6] bg-sand-2 mb-5 block">
                <img data-zoom src={j.img} alt={j.title} className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
              </Zoomable>
              <div className="text-[11px] tracking-[0.18em] uppercase text-taupe mb-[10px]">{j.tag}</div>
              <h3 className="font-display text-[23px] font-medium text-ink leading-[1.2] mb-[10px]">{j.title}</h3>
              <p className="text-[14px] leading-[1.7] text-coffee-3 font-light">{j.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. REVIEWS */}
      <section className="bg-sand py-[108px]">
        <div className="max-w-[1360px] mx-auto px-10">
          <div data-reveal className="text-center mb-14">
            <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-4">Loved by homes everywhere</div>
            <h2 className="font-display font-medium text-[clamp(30px,3.6vw,46px)] tracking-[-0.01em] text-ink">What our clients say</h2>
          </div>
          <div className="grid grid-cols-3 gap-[26px]">
            {reviews.map((r) => (
              <div key={r.name} data-reveal className="bg-cream py-10 px-9 flex flex-col gap-5">
                <div className="flex gap-[3px] text-coffee">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="m12 2 3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
                    </svg>
                  ))}
                </div>
                <p className="font-serif text-[21px] leading-[1.55] text-ink">&ldquo;{r.quote}&rdquo;</p>
                <div className="mt-auto">
                  <div className="text-[13.5px] font-semibold text-ink">{r.name}</div>
                  <div className="text-[12px] text-taupe mt-[3px]">{r.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. NEWSLETTER */}
      <section className="relative py-[118px] px-10 text-center overflow-hidden bg-sand-2">
        <div data-reveal className="relative max-w-[560px] mx-auto">
          <div className="text-[11.5px] tracking-[0.32em] uppercase text-coffee-4 mb-[18px]">Stay in touch</div>
          <h2 className="font-display font-medium text-[clamp(30px,3.6vw,44px)] tracking-[-0.01em] text-ink leading-[1.1]">Join the HomeBase Supply list</h2>
          <p className="font-serif text-[21px] leading-[1.5] text-coffee mt-[18px] mb-9">Early access to new collections, styling notes and private sales. No noise.</p>
          <form onSubmit={subscribe} className="flex max-w-[440px] mx-auto border-b border-coffee">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 bg-transparent border-0 outline-none py-[14px] px-1 text-[14px] text-ink font-sans"
            />
            <button type="submit" className="bg-transparent border-0 cursor-pointer text-ink text-[12px] tracking-[0.16em] uppercase font-semibold px-2 font-sans">
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
      <QuickViewModal product={quick} onClose={closeQuick} onAdd={addToCart} />
      <Toast message={message} />
    </>
  );
}
