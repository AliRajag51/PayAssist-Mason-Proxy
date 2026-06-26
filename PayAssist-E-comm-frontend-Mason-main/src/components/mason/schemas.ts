/* MASON — Zod schemas for the backend wire format. The adapter validates every
   backend response against these, so malformed/missing data fails loudly here
   instead of silently rendering broken UI. Mirrors Sona 1:1 — the backend
   contract is shared. */
import { z } from "zod";

const refSchema = z
  .object({ name: z.string().optional(), id: z.string().optional() })
  .partial();

export const backendProductSchema = z
  .object({
    _id: z.string(),
    sku: z.string().default(""),
    title: z.string().default(""),
    parent: z.string().default(""),
    children: z.string().default(""),
    tags: z.array(z.string()).default([]),
    image: z.string().default(""),
    originalPrice: z.number().default(0),
    price: z.number().default(0),
    discount: z.number().default(0),
    relatedImages: z.array(z.string()).default([]),
    description: z.string().default(""),
    brand: refSchema.optional(),
    category: refSchema.optional(),
    unit: z.string().default(""),
    quantity: z.number().default(0),
    colors: z.array(z.string()).default([]),
    type: z.string().default(""),
    itemInfo: z.string().default(""),
    status: z.string().default("active"),
  })
  .passthrough();

export type BackendProduct = z.infer<typeof backendProductSchema>;

export const itemInfoSchema = z
  .object({
    tagline: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    specs: z
      .array(z.object({ group: z.string(), rows: z.array(z.array(z.string())) }))
      .optional(),
    box: z.array(z.string()).optional(),
  })
  .partial();

export const orderCartItemSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().default(""),
    image: z.string().default(""),
    parent: z.string().default(""),
    price: z.number().default(0),
    originalPrice: z.number().default(0),
    discount: z.number().default(0),
    orderQuantity: z.number().default(1),
  })
  .passthrough();

export const orderSchema = z
  .object({
    _id: z.string(),
    invoice: z.number().optional(),
    cart: z.array(orderCartItemSchema).default([]),
    name: z.string().default(""),
    email: z.string().default(""),
    contact: z.string().default(""),
    address: z.string().default(""),
    city: z.string().default(""),
    country: z.string().default(""),
    zipCode: z.string().default(""),
    subTotal: z.number().default(0),
    shippingCost: z.number().default(0),
    shippingOption: z.string().optional(),
    discount: z.number().default(0),
    totalAmount: z.number().default(0),
    paymentMethod: z.string().optional(),
    paymentStatus: z.string().optional(),
    paymentProvider: z.string().optional(),
    status: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .passthrough();

export type BackendOrder = z.infer<typeof orderSchema>;

export const addOrderResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  order: orderSchema,
});

export const couponSchema = z
  .object({
    _id: z.string(),
    title: z.string().default(""),
    couponCode: z.string(),
    endTime: z.string().optional(),
    discountPercentage: z.number().default(0),
    minimumAmount: z.number().default(0),
    productType: z.string().default(""),
  })
  .passthrough();

export type BackendCoupon = z.infer<typeof couponSchema>;

export const userSchema = z.object({
  _id: z.string(),
  name: z.string().default(""),
  email: z.string().default(""),
  role: z.string().default("user"),
  status: z.string().default("inactive"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  imageURL: z.string().optional(),
  contactNumber: z.string().optional(),
  shippingAddress: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

export const authSessionSchema = z.object({
  status: z.string().optional(),
  message: z.string().optional(),
  data: z.object({ user: userSchema, token: z.string() }),
});
