/* MASON — payment adapter. Calls THIS store's own backend payment endpoints.
 * The Stripe/PayPal SDKs are used in the UI only; the actual create/capture and
 * webhook verification happen on the backend (no client-side capture).
 * Mirrors the Sona reference 1:1 — the backend contract is shared. */
import type { OrderPayload } from "@components/mason/backend-types";

function clientApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
}

export const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_KEY || "";
export const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
const stripeEnabled = process.env.NEXT_PUBLIC_ENABLE_STRIPE !== "false";
const paypalEnabled = process.env.NEXT_PUBLIC_ENABLE_PAYPAL !== "false";
export const isStripeConfigured = stripeEnabled && stripePublishableKey.startsWith("pk_");
export const isPaypalConfigured = paypalEnabled && paypalClientId.length > 0;

export interface PaymentLineItem {
  name: string;
  qty: number;
}

export async function createPaymentIntent(
  amount: number,
  items: PaymentLineItem[] = []
): Promise<{ clientSecret: string }> {
  const res = await fetch(`${clientApiBase()}/api/order/create-payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      price: amount,
      cart: items.map((it) => ({ title: it.name, qty: it.qty })),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.clientSecret) {
    throw new Error(data.message || "Couldn't start the card payment.");
  }
  return { clientSecret: data.clientSecret };
}

export async function confirmStripePayment(
  paymentIntentId: string,
  orderId: string
): Promise<{ success: boolean; status?: string; paymentRef?: string }> {
  const res = await fetch(`${clientApiBase()}/api/order/stripe/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentIntentId, orderId }),
  });
  const data = await res.json().catch(() => ({}));
  return { success: !!data.success, status: data.status, paymentRef: data.paymentRef };
}

export async function createPaypalOrder(amount: number, orderId?: string): Promise<{ id: string }> {
  const res = await fetch(`${clientApiBase()}/api/order/paypal/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, ...(orderId ? { orderId, referenceId: orderId } : {}) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id) {
    throw new Error(data.message || "Couldn't start the PayPal payment.");
  }
  return { id: data.id };
}

export async function capturePaypalOrder(
  paypalOrderId: string,
  orderId: string
): Promise<{ success: boolean; captureId?: string }> {
  const res = await fetch(`${clientApiBase()}/api/order/paypal/capture`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderID: paypalOrderId, orderId }),
  });
  const data = await res.json().catch(() => ({}));
  return { success: !!data.success, captureId: data.captureId };
}

export type { OrderPayload };
