'use client';

import { useEffect } from 'react';

/** Highlights the top-nav link matching the current path. */
export function ActiveNav() {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.navlinks .navlink'));
    const mark = () => {
      const path = window.location.pathname;
      for (const l of links) {
        const href = l.getAttribute('href') || '';
        l.classList.toggle('active', href !== '/' && (path === href || path.startsWith(href + '/')));
      }
    };
    mark();
    window.addEventListener('popstate', mark);
    return () => window.removeEventListener('popstate', mark);
  }, []);
  return null;
}
