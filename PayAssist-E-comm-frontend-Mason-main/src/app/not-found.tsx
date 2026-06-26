import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-7 text-center">
      <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-4">404</div>
      <h1 className="font-display font-medium text-[clamp(34px,4vw,52px)] tracking-[-0.01em] text-ink leading-[1.1]">
        That page wandered off
      </h1>
      <p className="font-serif text-[18px] text-coffee mt-4 max-w-[440px]">
        The link may be old, or the page moved. Head back to the collection.
      </p>
      <Link
        href="/"
        className="mt-8 bg-ink text-cream no-underline text-[12.5px] tracking-[0.16em] uppercase px-[38px] py-4 font-medium transition-colors duration-300 hover:bg-coffee"
      >
        Back to home
      </Link>
    </main>
  );
}
