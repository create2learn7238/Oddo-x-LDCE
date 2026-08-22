# GlobeTrotter AI & UI Design System Rules

This document outlines the master UI component rules, motion specs, and design system guidelines inspired by **Lovable**, **21st.dev**, **Uiverse**, **V0 by Vercel**, **Bolt.new**, and **UI Labs**.

## Color Tokens & Theme System

```css
/* Deep Teal / Emerald Blue-Green Primary */
--primary: #0d9488;
--primary-hover: #0f766e;
--primary-soft: #ccfbf1;
--primary-dark: #042f2e;

/* Lightbit Brown / Sand Terracotta Accent */
--accent: #d97706;
--accent-hover: #b45309;
--accent-soft: #fef3c7;
--accent-dark: #78350f;

/* Backgrounds & Text */
--bg: #f4f8f8;
--panel: #ffffff;
--ink: #0f172a;
--ink-2: #475569;
--line: #cbd5e1;
```

## Micro-Interactions & Animation Rules

1. **Card Elevation**:
   - Class: `.card-hover`
   - Effect: `translateY(-4px)` with high-contrast shadow `0 12px 35px -8px rgba(13, 148, 136, 0.22)`
2. **Buttons & Pills**:
   - Tactile press state: `transform: scale(0.97)` on active.
   - Ripple / Glow background hover with smooth `cubic-bezier(0.22, 1, 0.36, 1)` easing.
3. **Hero Photography (Ken Burns Effect)**:
   - Subtle image scaling `scale(1.08)` on photo frames for a breathing feel.
4. **SVG Charts & Donut Graphs**:
   - Staggered bar growth (`barGrow 0.9s`) and smooth donut ring transitions.

## UX Edge-Case Requirements

- **Empty States**: Every list (cities, activities, trips, itinerary days) MUST provide an explicit empty state component with animated emoji icon and quick recovery action button.
- **Loading Skeletons**: Use `SkeletonCard` animated pulse blocks for async data fetching instead of blank screens.
- **404 Handling**: Custom responsive error page at [`src/app/not-found.tsx`](file:///x:/LJ%20IET/Sem-4/Oddo%20x%20LDCE/src/app/not-found.tsx).
