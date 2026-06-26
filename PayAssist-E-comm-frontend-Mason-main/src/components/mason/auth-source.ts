/* MASON — auth adapter. The backend user/auth endpoints, mapped + Zod-validated.
   Mirrors the Sona reference 1:1 — the backend contract is shared. */
import {
  userSchema,
  authSessionSchema,
  orderSchema,
  type User,
  type BackendOrder,
} from "@components/mason/schemas";

export interface AuthSession {
  user: User;
  token: string;
}

function clientApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
}

function extractError(data: unknown, status: number): string {
  const d = (data || {}) as { error?: string; message?: string };
  return d.error || d.message || `Request failed (${status})`;
}

async function request(path: string, init: RequestInit): Promise<unknown> {
  const res = await fetch(`${clientApiBase()}${path}`, init);
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(extractError(data, res.status));
  return data;
}

function jsonInit(method: string, body: unknown, token?: string): RequestInit {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  };
}

function toSession(data: unknown): AuthSession {
  const parsed = authSessionSchema.parse(data);
  return { user: parsed.data.user, token: parsed.data.token };
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<string> {
  const data = (await request("/api/user/signup", jsonInit("POST", input))) as {
    status?: string;
    message?: string;
  };
  if (data.status === "failed") throw new Error(data.message || "Email already exists.");
  return data.message || "Please check your email to verify your account.";
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  return toSession(await request("/api/user/login", jsonInit("POST", input)));
}

export async function confirmEmail(token: string): Promise<AuthSession> {
  return toSession(
    await request(`/api/user/confirmEmail/${encodeURIComponent(token)}`, { method: "GET" })
  );
}

export async function forgotPassword(email: string): Promise<string> {
  const data = (await request(
    "/api/user/forget-password",
    jsonInit("PATCH", { verifyEmail: email })
  )) as { message?: string };
  return data.message || "Check your email to reset your password.";
}

export async function resetPassword(token: string, password: string): Promise<string> {
  const data = (await request(
    "/api/user/confirm-forget-password",
    jsonInit("PATCH", { token, password })
  )) as { message?: string };
  return data.message || "Password reset. You can sign in now.";
}

export async function getMe(token: string): Promise<User | null> {
  try {
    const data = (await request("/api/user/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })) as { data?: unknown };
    const parsed = userSchema.safeParse(data.data);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function updateProfile(
  id: string,
  token: string,
  input: { name?: string; email?: string; phone?: string; address?: string; bio?: string }
): Promise<AuthSession> {
  return toSession(
    await request(`/api/user/update-user/${encodeURIComponent(id)}`, jsonInit("PUT", input, token))
  );
}

export async function getMyOrders(token: string): Promise<BackendOrder[]> {
  try {
    const data = (await request("/api/user-order/order-by-user", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })) as { orders?: unknown[] };
    const out: BackendOrder[] = [];
    for (const o of data.orders || []) {
      const parsed = orderSchema.safeParse(o);
      if (parsed.success) out.push(parsed.data);
    }
    return out;
  } catch {
    return [];
  }
}
