"use client";

import { ContentPage } from "@components/mason/ContentPage";

export default function PrivacyPage() {
  return (
    <ContentPage eyebrow="Legal" title="Privacy policy">
      <p>
        This policy describes how HomeBase Supply (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
        collects, uses and protects information you share with us through this site. Last updated
        June 2026.
      </p>
      <h2>What we collect</h2>
      <p>
        When you place an order or create an account, we collect your name, email, shipping and
        billing address, phone number and the items you&apos;ve purchased. When you browse the site
        we collect anonymised analytics — pages viewed, time on page, device type. We do not collect
        payment card details directly; those are handled by Stripe and PayPal.
      </p>
      <h2>How we use it</h2>
      <p>
        To fulfil your order, to communicate about it, to handle returns, and — if you opt in — to
        send the occasional email about new arrivals or studio notes. That&apos;s it. We do not
        sell, rent or trade your information.
      </p>
      <h2>Cookies</h2>
      <p>
        We use first-party cookies to keep your cart between visits and to remember if you&apos;re
        signed in. We use a small set of third-party cookies (Stripe, PayPal, analytics) to support
        checkout and improve the site.
      </p>
      <h2>Your rights</h2>
      <p>
        You can ask for a copy of your data, ask us to correct it, or ask us to delete it at any
        time. Write to <strong>privacy@homebasesupply.com</strong>.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy? <strong>privacy@homebasesupply.com</strong>.
      </p>
    </ContentPage>
  );
}
