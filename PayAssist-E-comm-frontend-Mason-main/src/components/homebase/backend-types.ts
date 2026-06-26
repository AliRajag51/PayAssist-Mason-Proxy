/* MASON — backend-aware UI types. Mirrors the Sona reference exactly so the
   shared PayAssist backend / admin contract stays consistent across storefronts.
   The Mason UI uses its own simpler `Product` / `CartLine` (see ./types.ts);
   these types come into play when you wire the catalog / checkout / payment
   adapter to the live backend. */

export interface UIProduct {
  id: string;
  /* Backend SKU (e.g. "MASON-PEND-01"); used as the PayPal/order Item ID. */
  sku?: string;
  name: string;
  type: string;
  cat: string;
  price: number;
  tag: string | null;
  rating: number;
  reviews: number;
  img: string;
}

export interface UIProductDetail {
  tagline: string;
  desc: string;
  gallery: string[];
  highlights: string[];
  specs: { group: string; rows: string[][] }[];
  box: string[];
}

export interface CartItem {
  id: string;
  sku?: string;
  name: string;
  price: number;
  img: string;
  type: string;
  cat: string;
  qty: number;
}

export interface CheckoutForm {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country?: string;
  zipCode: string;
}

export interface OrderPayloadCartItem {
  id: string;
  sku: string;
  title: string;
  image: string;
  parent: string;
  price: number;
  originalPrice: number;
  discount: number;
  orderQuantity: number;
}

export interface AppliedCoupon {
  code: string;
  discountPercentage: number;
  discount: number;
}

export interface OrderPayload {
  user?: string;
  cart: OrderPayloadCartItem[];
  name: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  subTotal: number;
  shippingCost: number;
  shippingOption: string;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentProvider?: string;
  paymentRef?: string;
  status: string;
}
