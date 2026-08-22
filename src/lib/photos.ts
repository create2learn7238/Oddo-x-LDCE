/** Resolves the bundled photo for a city (by slugified name). Null when no photo exists. */
const EXT: Record<string, string> = { 
  bali: 'webp', 
  istanbul: 'png',
  ahmedabad: 'jpg',
  'rann-of-kutch': 'jpg',
  'statue-of-unity': 'jpg',
};

export function cityPhoto(name: string): string | null {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) return null;
  return `/images/cities/${slug}.${EXT[slug] || 'jpg'}`;
}

export const HERO_PHOTOS = {
  auth: '/images/cities/bali.webp',
  signup: '/images/cities/santorini.jpg',
  dashboard: '/images/cities/ahmedabad.jpg',
};
