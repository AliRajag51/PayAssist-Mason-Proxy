"use client";

import { ContentPage } from "@components/homebase/ContentPage";

export default function ReturnsPage() {
  return (
    <ContentPage eyebrow="Support" title="Returns &amp; exchanges">
      <p>
        We want you to love what you bring home. If a piece doesn&apos;t feel right, you have
        <strong> 30 days </strong>from delivery to send it back for a refund or exchange — no
        questions, no restocking fee.
      </p>
      <h2>How to start a return</h2>
      <p>
        Write to <strong>returns@homebasesupply.com</strong> with your order number and a one-line note
        about which piece is going back. We&apos;ll email you a prepaid shipping label within one
        business day.
      </p>
      <h2>Condition</h2>
      <p>
        Pieces should come back in their original condition — unused, with original packaging if
        possible. Hand-thrown ceramics and hand-blown glass should be packed with care; we&apos;ll
        send detailed packing notes with the label.
      </p>
      <h2>Refunds</h2>
      <p>
        Refunds are issued to the original payment method within 3 business days of us receiving
        the return. Shipping costs are refunded too, unless the return is for personal preference
        rather than a fault.
      </p>
      <h2>Made-to-order</h2>
      <p>
        Made-to-order pieces (noted on the product page) are non-returnable. If something arrives
        damaged or faulty, we&apos;ll replace it at no cost — please send a photo to{" "}
        <strong>hello@homebasesupply.com</strong> within 7 days of delivery.
      </p>
      <h2>Damaged in transit</h2>
      <p>
        If a piece arrives damaged, write to us with a photo within 7 days and we&apos;ll make it
        right — a replacement, repair, or full refund, your choice.
      </p>
    </ContentPage>
  );
}
