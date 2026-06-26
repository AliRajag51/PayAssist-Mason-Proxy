import Link from "next/link";
import { AnnouncementBar } from "@components/mason/AnnouncementBar";
import { FooterSlim } from "@components/mason/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <header className="border-b border-coffee/15 bg-cream">
        <div className="max-w-[1200px] mx-auto px-10 h-[78px] flex items-center">
          <Link href="/" className="text-left no-underline text-ink">
            <div className="font-display text-[22px] font-semibold tracking-[0.06em] leading-none">HOMEBASE</div>
            <div className="text-[9px] tracking-[0.42em] uppercase text-taupe mt-[3px]">Supply</div>
          </Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center py-20 px-10 text-center">
        <div className="max-w-[440px]">
          <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-4">Order</div>
          <h1 className="font-display font-medium text-[clamp(28px,3.4vw,42px)] tracking-[-0.01em] text-ink leading-[1.1]">
            Pulling up your order…
          </h1>
        </div>
      </div>
      <FooterSlim />
    </div>
  );
}
