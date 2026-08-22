import Link from 'next/link';
import { readSession } from '@/lib/auth';
import { InteractiveGlobe } from '@/components/InteractiveGlobe';
import { TravelSimulator } from '@/components/TravelSimulator';

export default async function Home() {
  const session = await requireUserSession();

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      
      {/* Hero Section with Interactive Rotating Background Globe */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 text-white py-32 px-8">
        
        {/* Interactive Revolving Canvas Globe Background */}
        <InteractiveGlobe />

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/60 via-transparent to-slate-950/90 pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-10">
          
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-inner animate-pulse-slow">
            <i className="bi bi-compass text-amber-400 text-base"></i> Next-Gen Multi-City Travel Planner & Co-Pilot
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-tight max-w-5xl mx-auto">
            Dream it. Plan it. <br />
            <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-400 bg-clip-text text-transparent">
              Explore Without Boundaries.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-normal">
            Personalized itineraries, automated cost engines, drag-and-drop calendars, and real-time travel intelligence for Gujarat, India & Global destinations.
          </p>

          <div className="flex flex-wrap justify-center gap-5 pt-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-10 py-5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-teal-500/40 hover:scale-105 transition-all flex items-center gap-3"
              >
                <i className="bi bi-speedometer2 text-xl"></i> Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-10 py-5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-teal-500/40 hover:scale-105 transition-all flex items-center gap-3"
                >
                  <i className="bi bi-box-arrow-in-right text-xl"></i> Log In / Demo Access
                </Link>
                <Link
                  href="/share/india-explorer"
                  className="px-10 py-5 bg-amber-600/90 hover:bg-amber-600 text-white font-bold text-lg rounded-2xl border border-amber-400/40 shadow-xl shadow-amber-600/30 hover:scale-105 transition-all flex items-center gap-3 backdrop-blur-md"
                >
                  <i className="bi bi-eye text-xl"></i> View Public Demo Trip
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto pt-16">
            {[
              { num: '31+', label: 'Global Cities', icon: 'bi-geo-alt-fill', color: 'text-teal-400' },
              { num: '135+', label: 'Curated Activities', icon: 'bi-ticket-perforated-fill', color: 'text-amber-400' },
              { num: '100%', label: 'Budget Precision', icon: 'bi-pie-chart-fill', color: 'text-emerald-400' },
              { num: '24/7', label: 'Smart Tools Suite', icon: 'bi-shield-check', color: 'text-cyan-400' },
            ].map((s, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 text-center shadow-lg hover:border-teal-400/50 transition-all">
                <i className={`bi ${s.icon} ${s.color} text-3xl mb-2 block`}></i>
                <div className="text-3xl font-black font-display text-white">{s.num}</div>
                <div className="text-xs text-slate-300 font-semibold mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Spacious Content Layout */}
      <main className="max-w-7xl mx-auto px-8 py-20 space-y-24">
        
        {/* Real-Time Travel Simulator Section */}
        <section>
          <TravelSimulator />
        </section>

        {/* Featured Destinations Section */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-teal-600 mb-2">Curated Destinations</div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display">Featured Travel Hotspots</h2>
            </div>
            <Link href="/cities" className="px-6 py-3 rounded-2xl border border-teal-600 text-teal-700 font-bold text-xs hover:bg-teal-50 transition-all flex items-center gap-2">
              <span>Explore All 31 Cities</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Ahmedabad', country: 'Gujarat, India', img: '/images/cities/ahmedabad.jpg', emoji: '🦁', cost: 'Heritage' },
              { name: 'Rann of Kutch', country: 'Gujarat, India', img: '/images/cities/rann-of-kutch.jpg', emoji: '🐪', cost: 'Desert' },
              { name: 'Statue of Unity', country: 'Gujarat, India', img: '/images/cities/statue-of-unity.jpg', emoji: '🗿', cost: 'Landmark' },
              { name: 'Paris', country: 'France', img: '/images/cities/paris.jpg', emoji: '🗼', cost: 'Luxury' },
            ].map((c, i) => (
              <div key={i} className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-96 flex flex-col justify-end p-8 border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                
                <div className="relative z-10 space-y-1">
                  <span className="px-3.5 py-1 bg-amber-500/90 text-white font-extrabold text-[10px] rounded-full uppercase tracking-wider mb-2 inline-block shadow-md">
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

        {/* Feature Showcase Grid */}
        <section className="bg-slate-900 text-white p-12 rounded-3xl space-y-12 border border-slate-800 shadow-2xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display">Engineered For Travel Perfection</h2>
            <p className="text-slate-400 text-sm leading-relaxed">Spacious layouts, precise calculation engines, and interactive visual timelines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-800/90 border border-slate-700/80 hover:border-teal-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-3xl font-bold">
                <i className="bi bi-map-fill"></i>
              </div>
              <h3 className="text-2xl font-bold font-display">Itinerary Builder</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Add stops, set travel dates, assign day-by-day activities, and calculate intercity travel costs automatically.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/90 border border-slate-700/80 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl font-bold">
                <i className="bi bi-calculator-fill"></i>
              </div>
              <h3 className="text-2xl font-bold font-display">Smart Cost Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Per-person daily estimates for accommodation, meals, local transit, and activities with real-time budget alert warnings.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-3xl font-bold">
                <i className="bi bi-calendar-week-fill"></i>
              </div>
              <h3 className="text-2xl font-bold font-display">Drag & Drop Calendar</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Visualize your full trip on an interactive calendar grid. Move activities effortlessly between days.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-800 px-8 text-center">
        <p>© 2026 GlobeTrotter — Built with Next.js 15, Prisma & Tailwind CSS. Premium Travel Engine.</p>
      </footer>
    </div>
  );
}

async function requireUserSession() {
  const { readSession } = await import('@/lib/auth');
  return await readSession();
}
