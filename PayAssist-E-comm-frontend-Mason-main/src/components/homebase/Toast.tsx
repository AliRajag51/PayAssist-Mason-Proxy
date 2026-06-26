"use client";

type Props = { message: string | null };

export function Toast({ message }: Props) {
  if (!message) return null;
  return (
    <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-[120] bg-ink text-cream py-[15px] px-7 text-[12.5px] tracking-[0.08em] flex items-center gap-3 shadow-[0_18px_50px_rgba(26,23,20,0.3)]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9CDBA" strokeWidth="1.6">
        <path d="m5 13 4 4L19 7" />
      </svg>
      {message}
    </div>
  );
}
