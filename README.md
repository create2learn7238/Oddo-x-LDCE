# 🦁 GlobeTrotter — Smart Multi-City Travel Planning Platform (India & Gujarat Edition)

> **Dream it. Plan it. Share it.**  
> An intelligent, full-stack multi-city travel planning application featuring interactive itinerary builders, day-by-day scheduling, automatic **Indian Rupee (₹ INR)** cost calculations, 3D animated canvas backgrounds, and a comprehensive travel smart tools suite.

---

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma 6](https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-dev.db-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)
[![Currency](https://img.shields.io/badge/Currency-INR_(₹)-0d9488?style=for-the-badge)](#)

---

## 🌟 Key Features & Innovations

### 🦁 1. India & Gujarat Heritage Circuits (Priority Focus)
- **Gujarat Golden Trail**: Ahmedabad (UNESCO World Heritage), Kevadia (Statue of Unity & Laser Show), and Dhordo (White Rann of Kutch & Rann Utsav).
- **Curated Indian Destinations**: Delhi, Jaipur, Udaipur, Goa, Mumbai, Varanasi, Bangalore.
- **Complete INR (₹) Engine**: Every price, accommodation tier, activity entry fee, train fare, and budget breakdown is modeled realistically in **Indian Rupees (₹)**.

### 🧠 2. GlobeTrotter Smart Suite & Travel Co-Pilot
Accessible from the top navigation and floating action button across all pages:
- 🤖 **Smart AI Travel Co-Pilot**: Instant custom recommendations for itineraries, budget hacks, and culinary secrets.
- 💱 **Real-Time Multi-Currency Converter**: Live converter between INR (₹), USD ($), EUR (€), GBP (£), AED, and JPY.
- 🌤️ **Destination Climate & Gear Advisor**: Simulated weather forecast and dynamic packing checklist.
- 🚆 **Route & Transit Visualizer**: Haversine distance calculator with flight, train, and road duration/fare estimations.
- 🧮 **Group Expense & Bill Splitter**: Equal per-person calculation with emergency buffer allocations.
- 🏆 **Gamified Trophy Vault**: Unlockable glowing badges earned through itinerary planning.
- 🎧 **Ambient Travel Soundscapes**: High-quality relaxing sound players (Goa Waves, Kutch Night Winds, Parisian Cafe Rain).
- 🛡️ **Global Emergency Vault**: 24/7 helpline directory for police, medical, and tourist consulates.
- 📝 **Digital Travel Journal**: In-app diary for preserving daily memories.

### 🌐 3. 3D & Dynamic Motion System
- **Interactive Node Graph Background**: 45 floating nodes with continuous glowing energy pulses traveling between random nodes and mouse parallax response.
- **Interactive 3D Revolving Globe**: Canvas globe that rotates and reacts to cursor movement.
- **Handcrafted Zero-Dependency SVG Charts**: Donut category breakdowns and animated daily spending bar charts.
- **Drag-and-Drop Calendar**: HTML5 DnD support to reschedule activities between days in real time.

### ⚡ 4. 1-Click Demo Login System
No typing needed — test the app with 3 pre-seeded accounts loaded with rich multi-city itineraries:

| Profile | Role | Credentials | Seeded Data & Itineraries |
|---|---|---|---|
| **🦁 Aarav Sharma** | Gujarat Explorer | `demo@globetrotter.app` / `demo123` | **3 Detailed Trips** (Vibrant Gujarat Circuit with 12 activities, Golden Triangle, Goa Coastal Sunsets) + 6 Saved Cities |
| **🎒 Priya Patel** | Solo Backpacker | `priya@globetrotter.app` / `demo123` | **2 Detailed Trips** (Spiritual Varanasi & Ganga Ghats Trail, Rajasthan Backpacking) + 5 Saved Cities |
| **👑 Globe Admin** | Administrator | `admin@globetrotter.app` / `admin123` | **Full Admin Dashboard Access** (`/admin`), platform analytics, system stats & Grand Pan-India Expedition |

---

## 📱 Application Screens & Routes

| # | Screen | Route | Description |
|---|---|---|---|
| 1 | **Home / Landing** | `/` | Hero presentation, interactive simulator, features showcase, and CTA |
| 2 | **Login & 1-Click Demo** | `/login` | Split-screen card layout with instant 1-click accounts and credentials |
| 3 | **Sign Up** | `/signup` | Responsive account registration |
| 4 | **Dashboard** | `/dashboard` | Greeting banner, active trips, 3 stat counters, and trending destinations |
| 5 | **My Trips** | `/trips` | Grid of planned journeys with quick actions |
| 6 | **Create Trip** | `/trips/new` | Multi-step trip creator with dates, covers, and budget caps |
| 7 | **Itinerary Builder** | `/trips/[id]/builder` | Add/reorder stops, assign activities day-by-day, view budgets |
| 8 | **Day-by-Day Itinerary** | `/trips/[id]/itinerary` | Chronological itinerary breakdown with cost summaries |
| 9 | **Trip Budget & Costs** | `/trips/[id]/budget` | Handcrafted SVG Donut chart, daily bar charts, over-budget indicators |
| 10 | **Trip Calendar & DnD** | `/trips/[id]/calendar` | Interactive visual calendar with drag-and-drop activity scheduling |
| 11 | **City Discovery** | `/cities` | Filter 20+ destinations by region/country with glassmorphic cards |
| 12 | **Activity Explorer** | `/activities` | Search 34+ activities by budget, duration, and category tags |
| 13 | **Public Shared Trip** | `/share/[token]` | Read-only shared trip view with 1-click "Copy Trip" feature |
| 14 | **Profile & Settings** | `/profile` | Manage account preferences, saved cities, and language settings |
| 15 | **Admin & Analytics** | `/admin` | Real-time platform metrics, user management, and top destination stats |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components & Client Islands, TypeScript)
- **Database & ORM**: [SQLite](https://www.sqlite.org/) with [Prisma 6](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Handcrafted CSS Design Tokens (`DESIGN_SYSTEM.md`)
- **Icons**: [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Authentication**: JWT (`jose`, HS256) stored in `httpOnly` secure cookies with bcryptjs password hashing
- **Charts**: Custom hand-rolled SVG charts with mount draw animations (0 third-party chart bloat)
- **Motion**: Custom IntersectionObserver reveals, staggered count-up tickers, and HTML5 Canvas engines

---

## 🗄️ Relational Data Model

```
User (1) ──── (N) Trip (1) ──── (N) Stop (1) ──── (N) StopActivity (N) ──── (1) Activity
 │                                   │                                         │
 │                                   └────────────── (N) City (1) ─────────────┘
 └─────────────────────── (N) SavedCity (N) ──────────┘
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18.x or 20.x installed
- npm / yarn / pnpm

### 2. Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/create2learn7238/Oddo-x-LDCE.git
cd Oddo-x-LDCE

# 2. Install dependencies (runs prisma generate automatically)
npm install

# 3. Push the Prisma database schema to SQLite
npx prisma db push

# 4. Seed the database with 20 cities, 34 activities, and 3 demo accounts
node prisma/seed.js

# 5. Start the development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & set JWT cookie |
| `POST` | `/api/auth/signup` | Register new user account |
| `POST` | `/api/auth/logout` | Clear session cookie |
| `GET`  | `/api/auth/stale` | Safety redirect & cookie cleanup for reset sessions |
| `GET`  | `/api/trips/mine` | Fetch logged-in user's trips |
| `POST` | `/api/trips` | Create a new trip |
| `PATCH`/`DELETE` | `/api/trips/[id]` | Edit details or delete a trip |
| `POST` | `/api/trips/[id]/share` | Toggle public visibility and generate share token |
| `POST` | `/api/trips/[id]/copy` | Deep-clone a public trip into user's account |
| `POST` | `/api/stops` | Add a city destination stop to a trip |
| `PATCH`/`DELETE` | `/api/stops/[id]` | Update dates/notes or delete stop |
| `POST` | `/api/stops/for-activity` | Attach an activity to trip (auto-creates stop if needed) |
| `POST` | `/api/stop-activities` | Schedule an activity on a specific day |
| `PATCH`/`DELETE` | `/api/stop-activities/[id]` | Reschedule, adjust time, or remove activity |
| `POST` | `/api/cities/[id]/save` | Toggle city in user's saved list |
| `PATCH`/`DELETE` | `/api/profile` | Update profile information or delete account |
| `DELETE` | `/api/admin/users` | Admin account removal |

---

## 👥 Contributors & Hackathon Team

- **Event**: Odoo x LDCE Hackathon 2026
- **Repository**: [https://github.com/create2learn7238/Oddo-x-LDCE](https://github.com/create2learn7238/Oddo-x-LDCE)

---
*Built with ❤️ for wanderers, travelers, and dreamers.*
