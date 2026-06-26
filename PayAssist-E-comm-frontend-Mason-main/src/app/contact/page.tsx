"use client";

import { ContentPage } from "@components/mason/ContentPage";

export default function ContactPage() {
  return (
    <ContentPage eyebrow="Contact" title="Say hello">
      <p>
        Questions about a product, an order, or a piece we don&apos;t carry yet? Write to us — a real
        person reads every email and we aim to reply within one business day.
      </p>
      <h2>Customer care</h2>
      <p>
        <strong>hello@masonsky.co</strong><br />
        Mon–Fri, 9am–6pm Eastern
      </p>
      <h2>Trade &amp; styling</h2>
      <p>
        Designers and stylists, we&apos;d love to hear from you. Write to{" "}
        <strong>trade@masonsky.co</strong> with a short note about your project and we&apos;ll come
        back to you with our trade terms.
      </p>
      <h2>Press</h2>
      <p>
        For press, partnerships and stockist enquiries: <strong>press@masonsky.co</strong>.
      </p>
      <h2>Our studio</h2>
      <p>
        Mason Sky Enterprises<br />
        100 Considered Lane, Studio 4<br />
        Brooklyn, NY 11211<br />
        United States
      </p>
    </ContentPage>
  );
}
