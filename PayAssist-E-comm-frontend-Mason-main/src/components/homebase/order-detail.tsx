/* MASON — order detail / confirmation for a real backend order. Display-only
   (server component). Mirrors Sona's structure (status timeline + items +
   summary + shipping) in Mason's cream/ink/coffee design language. */
import Link from "next/link";
import { AnnouncementBar } from "@components/homebase/AnnouncementBar";
import { FooterSlim } from "@components/homebase/Footer";
import { money } from "@components/homebase/types";
import type { BackendOrder } from "@components/homebase/schemas";

const TIMELINE = ["Order confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];
const REACHED: Record<string, number> = { pending: 0, processing: 2, delivered: 4 };
const STATUS_LABEL: Record<string, string> = {
  pending: "Order placed",
  processing: "In progress",
  delivered: "Delivered",
  cancel: "Cancelled",
};

export default function OrderDetail({ order }: { order: BackendOrder | null }) {
  if (!order) {
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
          <div className="max-w-[460px]">
            <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-4">Order</div>
            <h1 className="font-display font-medium text-[clamp(34px,4vw,52px)] tracking-[-0.01em] text-ink leading-[1.1]">
              Order not found
            </h1>
            <p className="font-serif text-[18px] text-coffee mt-4">
              We couldn’t find that order. Check the link, or contact support.
            </p>
            <Link href="/shop" className="inline-block mt-7 bg-ink text-cream no-underline text-[12.5px] tracking-[0.16em] uppercase px-[38px] py-4 font-medium transition-colors duration-300 hover:bg-coffee">
              Back to the shop
            </Link>
          </div>
        </div>
        <FooterSlim />
      </div>
    );
  }

  const cart = order.cart || [];
  const cancelled = order.status === "cancel";
  const reached = (order.status ? REACHED[order.status] : undefined) ?? 0;
  const statusLabel = (order.status ? STATUS_LABEL[order.status] : undefined) || order.status || "Order placed";

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <header className="border-b border-coffee/15 bg-cream">
        <div className="max-w-[1200px] mx-auto px-10 h-[78px] flex items-center justify-between">
          <Link href="/" className="text-left no-underline text-ink">
            <div className="font-display text-[22px] font-semibold tracking-[0.06em] leading-none">HOMEBASE</div>
            <div className="text-[9px] tracking-[0.42em] uppercase text-taupe mt-[3px]">Supply</div>
          </Link>
          <Link href="/shop" className="text-[11.5px] tracking-[0.1em] uppercase text-coffee no-underline hover:opacity-60">
            Continue shopping
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-[1200px] mx-auto w-full pt-[54px] pb-[30px] px-10">
        <div className="text-[11.5px] tracking-[0.32em] uppercase text-taupe mb-[14px]">Order confirmed</div>
        <h1 className="font-display font-medium text-[clamp(34px,4vw,52px)] tracking-[-0.01em] text-ink leading-[1.1]">
          Order #MS-{order.invoice ?? order._id.slice(-4).toUpperCase()}
        </h1>
        <p className="font-serif text-[20px] text-coffee mt-4 max-w-[560px]">
          Thanks for your order. Here’s everything we received — we’ll email tracking when it ships.
        </p>
      </section>

      {/* STATUS + TIMELINE */}
      <section className="max-w-[1200px] mx-auto w-full px-10 pb-[30px]">
        <div className="bg-white border border-coffee/15 py-[28px] px-[34px]">
          <div className="flex justify-between items-baseline gap-4 mb-7 flex-wrap">
            <div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-taupe">Status</div>
              <div className="font-display text-[22px] font-medium text-ink mt-[6px]">{statusLabel}</div>
            </div>
            <span className="bg-ink text-cream text-[11px] tracking-[0.16em] uppercase py-[7px] px-[14px] font-medium">
              {statusLabel}
            </span>
          </div>
          {!cancelled && (
            <div className="flex justify-between relative">
              {TIMELINE.map((t, i) => {
                const done = i <= reached;
                const lineDone = i < reached;
                return (
                  <div key={t} className="flex-1 text-center relative">
                    <div
                      className={`w-[26px] h-[26px] rounded-full mx-auto flex items-center justify-center relative z-[1] ${done ? "bg-ink border-ink" : "bg-cream border-coffee/30"} border-2`}
                    >
                      {done && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FAF7F2" strokeWidth="2">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className={`absolute top-3 left-1/2 w-full h-px ${lineDone ? "bg-ink" : "bg-coffee/30"}`} />
                    )}
                    <div className={`text-[11.5px] mt-[10px] ${done ? "text-ink font-medium" : "text-taupe"}`}>{t}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ITEMS + SUMMARY */}
      <section className="flex-1 max-w-[1200px] mx-auto w-full pt-[12px] pb-[110px] px-10 grid grid-cols-[1fr_380px] gap-16 items-start">
        <div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-ink mb-4 pb-3 border-b border-coffee/20">Items</div>
          {cart.map((it, idx) => {
            const qty = it.orderQuantity || 1;
            return (
              <div key={it.id || idx} className="grid grid-cols-[92px_1fr_auto] gap-5 items-center py-6 border-b border-coffee/10">
                <div className="aspect-square bg-sand-2 overflow-hidden">
                  {it.image && <img src={it.image} alt={it.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex flex-col gap-[5px]">
                  {it.parent && <div className="text-[11px] tracking-[0.14em] uppercase text-taupe">{it.parent}</div>}
                  <div className="font-display text-[19px] font-medium text-ink leading-[1.2]">{it.title}</div>
                  <div className="text-[12.5px] text-taupe">Qty {qty}</div>
                </div>
                <div className="text-right text-[15px] text-ink font-medium">{money(it.price * qty)}</div>
              </div>
            );
          })}
        </div>

        <aside className="sticky top-6 bg-sand py-8 px-[30px]">
          <div className="font-display text-[20px] font-medium text-ink mb-[22px]">Summary</div>
          <div className="flex justify-between text-[13px] text-coffee-2 mb-3"><span>Subtotal</span><span className="text-ink font-medium">{money(order.subTotal)}</span></div>
          <div className="flex justify-between text-[13px] text-coffee-2 mb-3"><span>Shipping</span><span className="text-ink font-medium">{order.shippingCost ? money(order.shippingCost) : "Free"}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[13px] text-coffee-2 mb-3"><span>Discount</span><span className="text-ink font-medium">−{money(order.discount)}</span></div>
          )}
          {order.paymentMethod && (
            <div className="flex justify-between text-[13px] text-coffee-2 mb-3">
              <span>Payment</span>
              <span className="text-ink font-medium">
                {order.paymentMethod}{order.paymentStatus ? ` · ${order.paymentStatus}` : ""}
              </span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-[18px] border-t border-coffee/20">
            <span className="text-[14px] text-ink font-medium">Total</span>
            <span className="font-serif text-[28px] text-coffee">{money(order.totalAmount)}</span>
          </div>

          {/* Shipping address */}
          <div className="mt-7 pt-6 border-t border-coffee/20">
            <div className="text-[11px] tracking-[0.2em] uppercase text-ink mb-3">Shipping to</div>
            <div className="text-[13.5px] leading-[1.7] text-coffee-2">
              <div className="text-ink font-medium">{order.name}</div>
              <div>{order.address}</div>
              <div>{order.city}{order.zipCode ? `, ${order.zipCode}` : ""}</div>
              <div>{order.country}</div>
              {order.contact && <div className="mt-2 text-taupe">{order.contact}</div>}
            </div>
          </div>

          <Link href="/shop" className="block text-center border border-ink text-ink no-underline text-[12.5px] tracking-[0.16em] uppercase py-[15px] mt-7 font-medium transition-colors duration-300 hover:bg-ink hover:text-cream">
            Continue shopping
          </Link>
        </aside>
      </section>

      <FooterSlim />
    </div>
  );
}
