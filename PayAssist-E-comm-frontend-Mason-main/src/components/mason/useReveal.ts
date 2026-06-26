"use client";

import { useEffect, useRef } from "react";

export function useReveal(deps: unknown[] = []) {
  const observed = useRef<WeakSet<Element>>(new WeakSet());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const t = e.target as HTMLElement;
            t.style.opacity = "1";
            t.style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (observed.current.has(el)) return;
      observed.current.add(el);
      el.style.opacity = "0";
      el.style.transform = "translateY(22px)";
      el.style.transition = "opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)";
      io.observe(el);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
