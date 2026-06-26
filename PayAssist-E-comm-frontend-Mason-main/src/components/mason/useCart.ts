"use client";

import { useCallback, useEffect, useState } from "react";
import { defaultCart } from "./products";
import type { CartLine } from "./types";

const KEY = "ms_cart";

export function useCart() {
  const [cart, setCart] = useState<CartLine[] | null>(null);

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "null");
      setCart(Array.isArray(v) ? v : defaultCart.slice());
    } catch {
      setCart(defaultCart.slice());
    }
  }, []);

  const save = useCallback((next: CartLine[]) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    setCart(next);
  }, []);

  const inc = useCallback((uid: string) => {
    setCart((cur) => {
      const next = (cur || []).map((i) => (i.uid === uid ? { ...i, qty: i.qty + 1 } : i));
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const dec = useCallback((uid: string) => {
    setCart((cur) => {
      const next = (cur || []).map((i) => (i.uid === uid ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const remove = useCallback((uid: string) => {
    setCart((cur) => {
      const next = (cur || []).filter((i) => i.uid !== uid);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const add = useCallback((line: Omit<CartLine, "uid">) => {
    setCart((cur) => {
      const list = (cur || defaultCart).slice();
      const existing = list.find((i) => i.id === line.id && i.finish === line.finish);
      if (existing) {
        existing.qty += line.qty;
      } else {
        list.push({ ...line, uid: "c" + Date.now() });
      }
      try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
      return list;
    });
  }, []);

  // Drop every line — used after a successful order so the bag isn't reused.
  const clear = useCallback(() => {
    try { localStorage.setItem(KEY, JSON.stringify([])); } catch {}
    setCart([]);
  }, []);

  const items = cart ?? defaultCart;
  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return { cart: items, ready: cart !== null, count, subtotal, add, inc, dec, remove, save, clear };
}
