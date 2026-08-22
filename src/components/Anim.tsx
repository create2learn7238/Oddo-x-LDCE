'use client';

import { useEffect, useRef, useState } from 'react';

/** Fades & slides content in when it scrolls into view (stagger via `delay`). */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVis(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVis(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as 'div';
  return (
    <Tag ref={ref} className={`reveal ${vis ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

/** Animated number that counts up when scrolled into view. */
export function CountUp({ value, money = false, prefix = '', duration = 900 }: { value: number; money?: boolean; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      if (started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(value * eased);
        if (p < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
    };
    if (typeof IntersectionObserver === 'undefined') {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  const n = Math.round(display).toLocaleString('en-IN');
  return (
    <span ref={ref} className="count-up">
      {prefix}
      {money ? '₹' + n : n}
    </span>
  );
}

/** Route-change transition wrapper: re-plays a slide/fade animation on every navigation. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @next/next/no-html-link-for-pages
  const [path, setPath] = useState('');
  useEffect(() => {
    setPath(window.location.pathname);
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return (
    <div key={path} className="page-anim">
      {children}
    </div>
  );
}

/** Real city photo with graceful fallback: hides itself on error so the gradient shows. */
export function CityPhoto({ src, alt, className = '', sizes }: { src: string; alt: string; className?: string; sizes?: string }) {
  const [err, setErr] = useState(false);
  if (err) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      sizes={sizes}
      className={`photo-img ${className}`}
      onError={() => setErr(true)}
    />
  );
}
