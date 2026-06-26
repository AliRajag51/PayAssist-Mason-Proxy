"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flash = useCallback((msg: string) => {
    setMessage(msg);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setMessage(null), 2400);
  }, []);
  useEffect(() => () => { if (t.current) clearTimeout(t.current); }, []);
  return { message, flash };
}
