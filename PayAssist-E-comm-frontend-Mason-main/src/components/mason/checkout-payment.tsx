"use client";
/* MASON — checkout payment methods (Stripe card + PayPal). The SDKs render the UI;
   create/capture happen on the backend (no client-side capture). On success the
   order is placed and we redirect to /order/[id]. Styled with Mason's tokens
   (cream / ink / coffee) and the .ms-field family so it matches the checkout. */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import { placeOrder } from "@components/mason/catalog-source";
import {
  stripePublishableKey,
  paypalClientId,
  isStripeConfigured,
  isPaypalConfigured,
  createPaymentIntent,
  confirmStripePayment,
  createPaypalOrder,
  capturePaypalOrder,
  type PaymentLineItem,
} from "@components/mason/payment-source";
import type { OrderPayload } from "@components/mason/backend-types";

export type CheckoutContext =
  | { ok: false; error: string }
  | {
      ok: true;
      makePayload: (provider: "stripe" | "paypal", paymentRef?: string) => OrderPayload;
    };

interface PaymentProps {
  method: string;
  total: number;
  lineItems: PaymentLineItem[];
  getContext: () => CheckoutContext;
  onPlaced: () => void;
}

let stripePromise: Promise<Stripe | null> | null = null;
function getStripe() {
  if (!stripePromise && isStripeConfigured)
    stripePromise = loadStripe(stripePublishableKey, {
      developerTools: { assistant: { enabled: false } },
    });
  return stripePromise;
}

const ALERT_CLS =
  "border border-coffee bg-cream py-[14px] px-[16px] text-[13px] tracking-[0.02em] text-coffee rounded-md";
/* Pill-shaped Pay button — wide and tall, matches the reference. */
const PAY_BTN_CLS =
  "w-full bg-ink text-cream border-0 cursor-pointer text-[15px] tracking-[0.02em] py-[22px] font-semibold font-sans rounded-full transition-colors duration-300 hover:bg-coffee disabled:opacity-60 disabled:cursor-not-allowed";
const INNER_PANEL_CLS =
  "bg-white border border-coffee/15 rounded-xl py-[22px] px-[24px]";

export default function CheckoutPayment({
  method,
  total,
  lineItems,
  getContext,
  onPlaced,
}: PaymentProps) {
  if (method === "stripe") {
    if (!isStripeConfigured) {
      return <div className={ALERT_CLS}>Card payments aren&apos;t configured yet.</div>;
    }
    return <StripeProvider total={total} lineItems={lineItems} getContext={getContext} onPlaced={onPlaced} />;
  }

  if (!isPaypalConfigured) {
    return <div className={ALERT_CLS}>PayPal isn&apos;t configured yet.</div>;
  }
  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: "USD",
        intent: "capture",
        components: "card-fields",
      }}
    >
      <PayPalSection total={total} lineItems={lineItems} getContext={getContext} onPlaced={onPlaced} />
    </PayPalScriptProvider>
  );
}

/* The Payment Element needs the PaymentIntent's clientSecret at the <Elements>
   provider level, so we create it BEFORE the form mounts: on entering the
   payment step we call createPaymentIntent(total) and render the form only
   once the clientSecret is set, showing an on-brand loader until then. */
function StripeProvider({ total, lineItems, getContext, onPlaced }: Omit<PaymentProps, "method">) {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setError("");
    setClientSecret("");
    createPaymentIntent(total, lineItems)
      .then(({ clientSecret }) => {
        if (!cancelled) setClientSecret(clientSecret);
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error).message || "Couldn't start the card payment.");
      });
    return () => {
      cancelled = true;
    };
  }, [total, lineItems]);

  if (error) return <div className={ALERT_CLS}>{error}</div>;
  if (!clientSecret) {
    return (
      <div className={`${INNER_PANEL_CLS} text-[13px] text-taupe`}>
        Loading secure card form…
      </div>
    );
  }

  return (
    <Elements stripe={getStripe()} options={{ clientSecret }}>
      <StripeSection total={total} clientSecret={clientSecret} getContext={getContext} onPlaced={onPlaced} />
    </Elements>
  );
}

function StripeSection({
  total,
  clientSecret,
  getContext,
  onPlaced,
}: Omit<PaymentProps, "method" | "lineItems"> & { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const pay = async () => {
    setError("");
    const ctx = getContext();
    if (!ctx.ok) return setError(ctx.error);
    if (!stripe || !elements) return setError("Payment is still loading — please wait.");

    setSubmitting(true);
    try {
      // Create our order first (unpaid) so we have an orderId to confirm against.
      const payload = ctx.makePayload("stripe");
      const order = await placeOrder(payload);
      // Let the browser confirm the payment (Payment Element handles 3DS in-page).
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: payload.name,
              phone: payload.contact,
            },
          },
        },
      });
      if (result.error) return setError(result.error.message || "Payment failed.");
      const intent = result.paymentIntent;
      if (!intent?.id) return setError("Payment was not completed.");
      // Server-side confirm: retrieve the PaymentIntent, verify, mark order paid (no webhook).
      const res = await confirmStripePayment(intent.id, order._id);
      if (!res.success) return setError(`Payment not completed (${res.status || "failed"}).`);
      onPlaced();
      router.push(`/order/${order._id}`);
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={INNER_PANEL_CLS}>
        {/* Card-only: paymentMethodOrder narrows what the Element renders, and
            wallets:'never' hides Apple Pay / Google Pay. The PaymentIntent is
            already created with payment_method_types:["card"], so Klarna / Link /
            BNPL methods can't appear at either the UI or confirm layer. */}
        <PaymentElement
          options={{
            paymentMethodOrder: ["card"],
            wallets: { applePay: "never", googlePay: "never" },
          }}
        />
      </div>
      {error && <div className={`mt-4 ${ALERT_CLS}`}>{error}</div>}
      <button
        className={`mt-[14px] ${PAY_BTN_CLS}`}
        type="button"
        onClick={pay}
        disabled={submitting || !stripe || !elements || !clientSecret}
      >
        {submitting ? "Processing…" : `Pay with Stripe · $${total.toLocaleString()}`}
      </button>
    </>
  );
}

/* Style for the <input> PayPal renders INSIDE each CardFields iframe. The
   iframe can't read our CSS variables, so these are literal values matching
   the Mason .ms-field look; the outer container (.mason-paypal-field) draws
   the border (otherwise the iframe paints a second, inner border). */
const PAYPAL_FIELD_STYLE = {
  input: {
    appearance: "none",
    "-webkit-appearance": "none",
    "-moz-appearance": "none",
    background: "transparent",
    border: "none",
    "box-shadow": "none",
    outline: "none",
    "font-family":
      "var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, sans-serif",
    "font-size": "14px",
    color: "#2B2723",
    /* Internal text padding lives on the <input> itself so the OUTER iframe can
       extend edge-to-edge (no white gap on either side of the border). */
    padding: "0 15px",
  },
  ":focus": { color: "#2B2723", border: "none", "box-shadow": "none", outline: "none" },
  ".invalid": { color: "#B42318", border: "none", "box-shadow": "none", outline: "none" },
} as const;

const PAYPAL_FIELD_CLS = "ms-paypal-field";

function PayPalSection({ total, getContext, onPlaced }: Omit<PaymentProps, "method">) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const orderIdRef = useRef<string | null>(null);

  const createOrder = async () => {
    setError("");
    const ctx = getContext();
    if (!ctx.ok) {
      setError(ctx.error);
      throw new Error(ctx.error);
    }
    // Create our order (unpaid) FIRST so the backend can attach the buyer name,
    // shipping address, and line items to the PayPal order it builds.
    const order = await placeOrder(ctx.makePayload("paypal"));
    orderIdRef.current = order._id;
    const { id } = await createPaypalOrder(total, order._id);
    return id;
  };

  const onApprove = async (data: { orderID?: string }) => {
    if (!data.orderID) return setError("PayPal didn't return an order id.");
    const orderId = orderIdRef.current;
    if (!orderId) return setError("Order reference is missing.");
    const cap = await capturePaypalOrder(data.orderID, orderId);
    if (!cap.success) {
      setError("PayPal payment could not be completed.");
      return;
    }
    onPlaced();
    router.push(`/order/${orderId}`);
  };

  return (
    <>
      <div className={INNER_PANEL_CLS}>
        <PayPalCardFieldsProvider
          createOrder={createOrder}
          onApprove={onApprove}
          onError={() => setError("PayPal encountered an error. Please try again.")}
          style={PAYPAL_FIELD_STYLE}
        >
          <div className="mb-[14px]">
            <label className="block text-[11px] tracking-[0.18em] uppercase text-ink mb-[8px]">Card number</label>
            <PayPalNumberField className={PAYPAL_FIELD_CLS} />
          </div>
          <div className="grid grid-cols-2 gap-[14px]">
            <div>
              <label className="block text-[11px] tracking-[0.18em] uppercase text-ink mb-[8px]">Expiry</label>
              <PayPalExpiryField className={PAYPAL_FIELD_CLS} />
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.18em] uppercase text-ink mb-[8px]">Security code</label>
              <PayPalCVVField className={PAYPAL_FIELD_CLS} />
            </div>
          </div>
          <PayPalPayButton
            total={total}
            submitting={submitting}
            setSubmitting={setSubmitting}
            setError={setError}
          />
        </PayPalCardFieldsProvider>
      </div>
      {error && <div className={`mt-4 ${ALERT_CLS}`}>{error}</div>}
    </>
  );
}

function PayPalPayButton({
  total,
  submitting,
  setSubmitting,
  setError,
}: {
  total: number;
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  setError: (v: string) => void;
}) {
  const { cardFieldsForm } = usePayPalCardFields();

  const pay = async () => {
    setError("");
    if (!cardFieldsForm) {
      setError("Card form is still loading — please wait.");
      return;
    }
    const state = await cardFieldsForm.getState();
    if (!state.isFormValid) {
      setError("Please check your card details and try again.");
      return;
    }
    setSubmitting(true);
    try {
      // submit() drives createOrder → onApprove (which captures + redirects).
      await cardFieldsForm.submit();
    } catch {
      setError("Payment could not be completed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* The PayPal Pay button now lives inside the white inner panel; sits flush
     with the form (no extra outer margin). The outer wrapper is the sand box. */
  return (
    <button
      className={`mt-[18px] ${PAY_BTN_CLS}`}
      type="button"
      onClick={pay}
      disabled={submitting || !cardFieldsForm}
    >
      {submitting ? "Processing…" : `Pay with PayPal · $${total.toLocaleString()}`}
    </button>
  );
}
