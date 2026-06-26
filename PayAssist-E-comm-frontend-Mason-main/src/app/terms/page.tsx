"use client";

import { ContentPage } from "@components/mason/ContentPage";

export default function TermsPage() {
  return (
    <ContentPage eyebrow="Legal" title="Terms of service">
      <p>
        By using homebasesupply.com you agree to these terms. They&apos;re short and written in plain
        English. Last updated June 2026.
      </p>
      <h2>Orders</h2>
      <p>
        Placing an order constitutes an offer to buy at the listed price. We confirm the order by
        email once it ships. Until then we reserve the right to cancel any order — for example if a
        piece sells out, is mispriced, or we suspect fraud.
      </p>
      <h2>Pricing</h2>
      <p>
        Prices are in US dollars and may change without notice. Sales tax is added at checkout
        where applicable.
      </p>
      <h2>Product representations</h2>
      <p>
        We do our best to photograph and describe every piece accurately. Hand-made objects vary
        subtly from one to the next — see our <a href="/craftsmanship">Craftsmanship page</a> for
        more on this. Variations within the normal hand-made range are not grounds for return for
        fault.
      </p>
      <h2>Intellectual property</h2>
      <p>
        Site content — photography, copy, and design — is © 2026 HomeBase Supply. Don&apos;t
        republish, scrape or resell it without our written permission.
      </p>
      <h2>Liability</h2>
      <p>
        We will repair or replace any product that arrives faulty. Beyond that, our liability is
        limited to the amount you paid for the order. We&apos;re not liable for indirect or
        consequential loss.
      </p>
      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the State of New York, USA.
      </p>
      <h2>Contact</h2>
      <p>
        <strong>hello@homebasesupply.com</strong> for any question about these terms.
      </p>
    </ContentPage>
  );
}
