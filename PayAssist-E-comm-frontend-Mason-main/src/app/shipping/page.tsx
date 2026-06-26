"use client";

import { ContentPage } from "@components/mason/ContentPage";

export default function ShippingPage() {
  return (
    <ContentPage eyebrow="Support" title="Shipping &amp; delivery">
      <p>
        Every order is packed by hand in our Brooklyn studio. Fragile pieces are wrapped in
        recycled paper and double-boxed; soft goods are folded and tied in linen ribbon. We work
        hard to make the unboxing feel like a small ceremony.
      </p>
      <h2>Standard shipping</h2>
      <p>
        <strong>Free on orders over $150.</strong> Otherwise $9 flat across the contiguous United
        States. Orders ship within 1–2 business days; delivery typically takes 3–5 business days
        from there.
      </p>
      <h2>Express shipping</h2>
      <p>
        <strong>$18 flat.</strong> Orders placed before 1pm Eastern ship the same day; delivery in
        1–2 business days.
      </p>
      <h2>International</h2>
      <p>
        We ship to Canada, the UK and most of the EU. Rates are calculated at checkout. Duties and
        taxes are the responsibility of the customer.
      </p>
      <h2>Large &amp; oversized pieces</h2>
      <p>
        Furniture and oversized lighting ship via a white-glove freight service — we&apos;ll get in
        touch within a day of your order to schedule delivery. Lead times are 2–4 weeks for
        in-stock pieces, longer for made-to-order.
      </p>
      <h2>Tracking</h2>
      <p>
        You&apos;ll receive a tracking number by email as soon as your order leaves the studio. If
        you need it sooner, just write to <strong>hello@homebasesupply.com</strong>.
      </p>
    </ContentPage>
  );
}
