"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-7 text-center">
      <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-4">Something went sideways</div>
      <h1 className="font-display font-medium text-[clamp(34px,4vw,52px)] tracking-[-0.01em] text-ink leading-[1.1]">
        That didn’t go as planned
      </h1>
      <p className="font-serif text-[18px] text-coffee mt-4 max-w-[440px]">
        An unexpected error stopped the page from loading. Try again in a moment.
      </p>
      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={reset}
          className="bg-ink text-cream border-0 cursor-pointer text-[12.5px] tracking-[0.16em] uppercase px-[34px] py-4 font-medium transition-colors duration-300 hover:bg-coffee"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-ink text-ink no-underline text-[12.5px] tracking-[0.16em] uppercase px-[34px] py-4 font-medium transition-colors duration-300 hover:bg-ink hover:text-cream"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
