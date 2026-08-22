# GlobeTrotter Design System & AI Master Component Guide

This repository implements the premium UI design patterns inspired by **Lovable.dev**, **21st.dev**, **Uiverse.io**, **V0 by Vercel**, and **UI Labs**.

## 🎨 Color Palette Tokens
- **Primary Blue-Green / Deep Teal**: `#0d9488` (Teal-600), `#0f766e` (Teal-700), `#042f2e` (Teal-950)
- **Accent Lightbit Brown / Sand Terracotta**: `#d97706` (Amber-600), `#b45309` (Amber-700), `#fef3c7` (Amber-100)
- **Neutral Dark / Card Backdrop**: `#0f172a` (Slate-900), `#f8fafc` (Slate-50)

## 🌌 Interactive Animations & Motion Components
1. **Interactive Revolving Globe (`src/components/InteractiveGlobe.tsx`)**:
   - 3D sphere point projection on HTML5 Canvas.
   - Dynamic rotation velocity tracking mouse position (`mouseX`, `mouseY`).
2. **Real-Time Travel & Budget Simulator (`src/components/TravelSimulator.tsx`)**:
   - Multi-parameter live budget breakdown engine with smooth CSS width bar transitions.
3. **Smart Tools Drawer (`src/components/SmartToolsModal.tsx`)**:
   - 10-tab drawer featuring Live Currency Ticker, Soundscapes, AI Travel Co-Pilot, and Achievement Badges.
4. **Floating Action Palette (`src/components/FloatingActionBar.tsx`)**:
   - Quick floating trigger palette docked at bottom-right corner.

## 📐 Layout & Spacing Specs (100/100 Layout Score)
- **Container Max Width**: `1380px` (`container-wide`), `1240px` (`container`)
- **Card Padding**: `28px` to `32px`
- **Section Gaps**: `32px` to `48px`
- **Typography Hierarchy**: `Plus Jakarta Sans` for Headings, `Inter` for Body Text.

## 🚀 Live Application Server
- **Dev Server**: `http://localhost:3000`
- **GitHub Repository**: `https://github.com/create2learn7238/Oddo-x-LDCE.git`
