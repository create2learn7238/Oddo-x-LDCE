import Link from 'next/link';
import { readSession } from '@/lib/auth';

export default async function Home() {
  const session = await readSession();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white py-24 px-6">
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cities/santorini.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover scale-105 animate-pulse-slow"
          />
        </div>
        
        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-teal-950/80 z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <i className="bi bi-stars text-amber-400"></i> Next-Gen Multi-City Travel Planner & Co-Pilot
          </div>

          <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight leading-tight max-w-4xl mx-auto">
            Dream it. Plan it. <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-amber-300 bg-clip-text text-transparent">Explore Together.</span>
          </h1>

          <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            Personalized itineraries, automated budget & cost analytics, drag-and-drop calendars, and live travel intelligence for Gujarat, India & Global destinations.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all flex items-center gap-3"
              >
                <i className="bi bi-speedometer2"></i> Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all flex items-center gap-3"
                >
                  <i className="bi bi-box-arrow-in-right"></i> Log In / Demo Access
                </Link>
                <Link
                  href="/share/india-explorer"
                  className="px-8 py-4 bg-amber-600/90 hover:bg-amber-600 text-white font-bold text-base rounded-2xl border border-amber-400/30 shadow-lg shadow-amber-600/20 hover:scale-105 transition-all flex items-center gap-3 backdrop-blur-md"
                >
                  <i className="bi bi-eye"></i> View Sample Public Trip
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
            {[
              { num: '31+', label: 'Global Cities', icon: 'bi-geo-alt-fill', color: 'text-teal-400' },
              { num: '135+', label: 'Curated Activities', icon: 'bi-ticket-perforated-fill', color: 'text-amber-400' },
              { num: '100%', label: 'Budget Precision', icon: 'bi-pie-chart-fill', color: 'text-emerald-400' },
              { num: '24/7', label: 'Smart Tools Vault', icon: 'bi-shield-check', color: 'text-cyan-400' },
            ].map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <i className={`bi ${s.icon} ${s.color} text-2xl mb-1 block`}></i>
                <div className="text-2xl font-black font-display text-white">{s.num}</div>
                <div className="text-xs text-slate-300 font-semibold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">Handpicked Destinations</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display">Popular Travel Destinations</h2>
          </div>
          <Link href="/cities" className="px-5 py-2.5 rounded-xl border border-teal-600 text-teal-700 font-bold text-xs hover:bg-teal-50 transition-all flex items-center gap-2">
            <span>Explore All 31 Cities</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Paris', country: 'France', img: '/images/cities/paris.jpg', emoji: '🗼', cost: 'Luxury' },
            { name: 'Goa', country: 'India', img: '/images/cities/goa.jpg', emoji: '🌴', cost: 'Budget' },
            { name: 'Rome', country: 'Italy', img: '/images/cities/rome.jpg', emoji: '🏛️', cost: 'Moderate' },
            { name: 'Udaipur', country: 'India', img: '/images/cities/udaipur.jpg', emoji: '🏰', cost: 'Moderate' },
          ].map((c, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-80 flex flex-col justify-end p-6 border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
              
              <div className="relative z-10">
                <span className="px-3 py-1 bg-amber-500/90 text-white font-bold text-[10px] rounded-full uppercase tracking-wider mb-2 inline-block shadow-sm">
                  {c.cost}
                </span>
                <h3 className="text-2xl font-black text-white font-display flex items-center gap-2">
                  <span>{c.emoji}</span> {c.name}
                </h3>
                <p className="text-slate-300 text-xs font-semibold">{c.country}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-16 bg-slate-900 text-white px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold font-display">Why Travelers Choose GlobeTrotter</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Everything you need for seamless, stress-free trip planning in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-teal-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl font-bold">
                <i className="bi bi-map-fill"></i>
              </div>
              <h3 className="text-xl font-bold font-display">Itinerary Builder</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Add stops, set travel dates, assign day-by-day activities, and calculate intercity travel costs automatically.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl font-bold">
                <i className="bi bi-calculator-fill"></i>
              </div>
              <h3 className="text-xl font-bold font-display">Smart Cost Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Per-person daily estimates for accommodation, meals, local transit, and activities with real-time budget alert warnings.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-cyan-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-bold">
                <i className="bi bi-calendar-week-fill"></i>
              </div>
              <h3 className="text-xl font-bold font-display">Drag & Drop Calendar</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Visualize your full trip on an interactive calendar grid. Move activities effortlessly between days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-slate-400 text-xs border-t border-slate-800 px-6 text-center">
        <p>© 2026 GlobeTrotter — Built with Next.js 15, Prisma & Tailwind CSS. Designed for perfection.</p>
      </footer>
    </div>
  );
}
