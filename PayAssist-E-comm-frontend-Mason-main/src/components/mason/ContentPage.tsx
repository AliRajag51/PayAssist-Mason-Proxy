"use client";

import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useCart } from "./useCart";

type ContentPageProps = {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

export function ContentPage({ eyebrow, title, children }: ContentPageProps) {
  const { count } = useCart();
  return (
    <>
      <AnnouncementBar />
      <Header cartCount={count} />
      <section className="max-w-[820px] mx-auto px-10 pt-[88px] pb-[110px]">
        <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-5">{eyebrow}</div>
        <h1 className="font-display font-medium text-[clamp(36px,4.6vw,56px)] tracking-[-0.01em] leading-[1.06] text-ink mb-9">{title}</h1>
        <div className="font-serif text-[17px] leading-[1.75] text-coffee-2 space-y-6 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-medium [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-ink hover:[&_a]:text-coffee [&_strong]:text-ink [&_strong]:font-medium">
          {children}
        </div>
      </section>
      <Footer />
    </>
  );
}
