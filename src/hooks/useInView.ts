"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Becomes true once the element enters the viewport (and stays true).
 * Fail-safe: IntersectionObserver + manual position check on scroll + 8s timeout,
 * so content can never get stuck hidden.
 */
export function useInView(ref: RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    let raf = 0;
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) show();
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && show(), { threshold });
    const safety = window.setTimeout(show, 8000);

    function cleanup() {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    }
    function show() {
      setInView(true);
      cleanup();
    }

    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    raf = requestAnimationFrame(check);
    return cleanup;
  }, [ref, threshold]);

  return inView;
}
