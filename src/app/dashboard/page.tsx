import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getTripsForUser, getTripFull } from '@/lib/data';
import { computeTripCosts, type TripFull } from '@/lib/estimates';
import { fmtDateFull, fmtMoney, fmtRange } from '@/lib/dates';
import { cityPhoto, HERO_PHOTOS } from '@/lib/photos';
import { CountUp, Reveal } from '@/components/Anim';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await requireUser();
  const [trips, popular] = await Promise.all([
    getTripsForUser(session.userId),
    prisma.city.findMany({ orderBy: { popularity: 'desc' }, take: 4 }),
  ]);

  const today = new Date();
  const upcoming = trips.filter((t) => t.endDate >= today);
  const totalStops = upcoming.reduce((s, t) => s + t.stops.length, 0);
  const fullTrips: TripFull[] = [];
  for (const t of upcoming) {
    const f = await getTripFull(t.id);
    if (f) fullTrips.push(f);
  }
  const plannedSpend = fullTrips.reduce((s, f) => s + computeTripCosts(f).totals.total, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="container-wide py-8 space-y-10">
      
      {/* 1. Hero Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-amber-950 text-white p-10 shadow-2xl border border-teal-500/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_PHOTOS.dashboard} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay animate-pulse-slow pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/90 via-slate-950/80 to-transparent"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <span>{fmtDateFull(today).toUpperCase()}</span> · <span>{session.language.toUpperCase()}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              <span className="inline-block animate-bounce mr-2">{hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙'}</span> 
              {greeting}, {session.name.split(' ')[0]}
            </h1>
            <p className="text-slate-300 text-sm md:text-base font-normal leading-relaxed">
              {upcoming.length
                ? `You have ${upcoming.length} upcoming trip${upcoming.length > 1 ? 's' : ''} — ${upcoming[0].name} starts on ${fmtDateFull(upcoming[0].startDate)}.`
                : 'Your map is open — initiate your next multi-city adventure.'}
            </p>
          </div>

          <Link
            href="/trips/new"
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm rounded-2xl shadow-xl shadow-amber-600/30 hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <i className="bi bi-plus-lg text-lg"></i>
            <span>Plan New Trip</span>
          </Link>
        </div>
      </div>

      {/* 2. Stat Counter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Reveal>
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:border-teal-400 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600">Active Itineraries</span>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl">
                <i className="bi bi-briefcase-fill"></i>
              </div>
            </div>
            <div className="text-4xl font-black font-display text-slate-900">
              <CountUp value={upcoming.length} />
            </div>
            <p className="text-xs text-slate-500 font-semibold">Upcoming multi-city trips</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">City Stops</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
            </div>
            <div className="text-4xl font-black font-display text-slate-900">
              <CountUp value={totalStops} />
            </div>
            <p className="text-xs text-slate-500 font-semibold">Destinations on your schedule</p>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-400 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">Estimated Budget</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                <i className="bi bi-currency-dollar"></i>
              </div>
            </div>
            <div className="text-4xl font-black font-display text-slate-900">
              <CountUp value={plannedSpend} money />
            </div>
            <p className="text-xs text-slate-500 font-semibold">Total calculated spend</p>
          </div>
        </Reveal>
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Your Trips */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-slate-900 font-display">Your Trips</h2>
            <Link href="/trips" className="text-teal-700 font-bold text-xs hover:underline flex items-center gap-1">
              <span>View all trips</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="text-5xl">🧭</div>
              <h3 className="text-xl font-bold text-slate-900 font-display">No trips planned yet</h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto">Start with a trip name, dates, and select your favorite destination stops.</p>
              <Link href="/trips/new" className="px-6 py-3 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md inline-block">
                Create First Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.slice(0, 4).map((t, i) => {
                const firstPhoto = t.stops[0] ? cityPhoto(t.stops[0].city.name) : null;
                return (
                  <Reveal key={t.id} delay={i * 90}>
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all space-y-4">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-600 to-amber-600 flex items-center justify-center text-3xl text-white shadow-md flex-shrink-0">
                            {firstPhoto ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={firstPhoto} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span>{t.coverEmoji || '🧳'}</span>
                            )}
                          </div>
                          
                          <div>
                            <Link href={`/trips/${t.id}`} className="text-xl font-extrabold text-slate-900 font-display hover:text-teal-700 transition-colors">
                              {t.name}
                            </Link>
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-1">
                              <span>📅 {fmtRange(t.startDate, t.endDate)}</span>
                              <span>🏙️ {t.stops.length} stops</span>
                              {t.isPublic && <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-bold rounded-md">Public</span>}
                            </div>
                          </div>
                        </div>

                        {/* Quick Navigation Buttons */}
                        <div className="flex items-center gap-2">
                          <Link href={`/trips/${t.id}/builder`} className="px-3.5 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold rounded-xl transition-all">
                            Builder
                          </Link>
                          <Link href={`/trips/${t.id}/itinerary`} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all">
                            View Plan
                          </Link>
                        </div>
                      </div>

                      {/* City Badges List */}
                      {t.stops.length > 0 && (
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                          {t.stops.map((s) => (
                            <span key={s.id} className="px-3 py-1 bg-amber-50 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 flex items-center gap-1.5">
                              <span>{s.city.emoji}</span> {s.city.name}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Trending Destinations (Overlay Glass Card Layout) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-slate-900 font-display">Trending Destinations</h2>
            <Link href="/cities" className="text-teal-700 font-bold text-xs hover:underline flex items-center gap-1">
              <span>Explore</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {popular.map((c, i) => {
              const photo = cityPhoto(c.name);
              return (
                <Reveal key={c.id} delay={i * 80}>
                  <Link
                    href={`/cities?q=${encodeURIComponent(c.name)}`}
                    className="group relative h-40 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-5 border border-slate-200 block"
                  >
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-amber-700"></div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    <div className="relative z-10 flex items-end justify-between">
                      <div>
                        <div className="text-xs font-bold text-teal-300 uppercase tracking-wider">{c.country}</div>
                        <h3 className="text-xl font-black text-white font-display flex items-center gap-1.5">
                          <span>{c.emoji}</span> {c.name}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-500/90 text-white font-black text-xs rounded-full shadow-md">
                        ★ {c.popularity}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-2">
            <h3 className="text-sm font-extrabold text-amber-900 flex items-center gap-2">
              <i className="bi bi-lightbulb-fill text-amber-600"></i> Pro Travel Tip
            </h3>
            <p className="text-slate-700 text-xs leading-relaxed">
              Add stops, then assign activities day by day — GlobeTrotter estimates stay, meals, transport and inter-city travel automatically and flags over-budget days.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
