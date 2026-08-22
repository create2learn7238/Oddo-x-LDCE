import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getTripsForUser, getTripFull } from '@/lib/data';
import { computeTripCosts, type TripFull } from '@/lib/estimates';
import { fmtDateFull, fmtMoney, fmtRange } from '@/lib/dates';
import { cityPhoto, HERO_PHOTOS } from '@/lib/photos';
import { CountUp, Reveal, CityPhoto } from '@/components/Anim';

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
    <div className="container-wide">
      {/* Spacious Hero Section */}
      <div className="hero" style={{ marginBottom: 32, padding: '48px 40px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_PHOTOS.dashboard} alt="" className="hero-photo" />
        <div className="hero-scrim" />
        <div className="flex items-center justify-between wrap gap-16">
          <div>
            <p style={{ fontWeight: 700, fontSize: 14.5, opacity: 0.9, letterSpacing: '0.05em' }}>
              {fmtDateFull(today).toUpperCase()} · {session.language.toUpperCase()}
            </p>
            <h1 style={{ fontSize: 38, marginTop: 8, color: '#fff' }}>
              <span className="float-emoji">{hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙'}</span> {greeting}, {session.name.split(' ')[0]}
            </h1>
            <p style={{ marginTop: 12, opacity: 0.94, maxWidth: 620, fontSize: 16.5, leading: 1.6 }}>
              {upcoming.length
                ? `You have ${upcoming.length} upcoming trip${upcoming.length > 1 ? 's' : ''} — ${upcoming[0].name} starts on ${fmtDateFull(upcoming[0].startDate)}.`
                : 'The map is blank — time to plan an extraordinary trip.'}
            </p>
          </div>
          <Link href="/trips/new" className="btn btn-accent btn-lg" style={{ padding: '16px 30px', fontSize: 16, borderRadius: 16 }}>
            ＋ Plan New Trip
          </Link>
        </div>
      </div>

      {/* Spacious Stat Cards Grid */}
      <div className="grid grid-3" style={{ marginBottom: 32, gap: 28 }}>
        <Reveal>
          <div className="card card-pad card-hover" style={{ padding: 32 }}>
            <div className="stat-num" style={{ fontSize: 42, color: '#0d9488' }}>
              <CountUp value={upcoming.length} />
            </div>
            <div className="stat-label" style={{ fontSize: 15, marginTop: 6, fontWeight: 700 }}>
              Upcoming trips
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card card-pad card-hover" style={{ padding: 32 }}>
            <div className="stat-num" style={{ fontSize: 42, color: '#d97706' }}>
              <CountUp value={totalStops} />
            </div>
            <div className="stat-label" style={{ fontSize: 15, marginTop: 6, fontWeight: 700 }}>
              Cities on your horizon
            </div>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div className="card card-pad card-hover" style={{ padding: 32 }}>
            <div className="stat-num" style={{ fontSize: 42, color: '#042f2e' }}>
              <CountUp value={plannedSpend} money />
            </div>
            <div className="stat-label" style={{ fontSize: 15, marginTop: 6, fontWeight: 700 }}>
              Estimated upcoming spend
            </div>
          </div>
        </Reveal>
      </div>

      {/* Main Content Grid with Spacing */}
      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 32 }}>
        <div>
          <div className="flex items-center justify-between mb-16" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 24, color: '#042f2e' }}>Your Trips</h2>
            <Link href="/trips" className="faint" style={{ fontWeight: 700, fontSize: 14.5, color: '#0d9488' }}>
              View all →
            </Link>
          </div>
          {trips.length === 0 ? (
            <Reveal>
              <div className="card" style={{ padding: 40 }}>
                <div className="empty">
                  <div className="big">🧭</div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>No trips planned yet</div>
                  <p className="muted mt-8" style={{ fontSize: 15 }}>
                    Start with a destination, travel dates and your dream stops.
                  </p>
                  <div className="mt-16" style={{ textAlign: 'center' }}>
                    <Link href="/trips/new" className="btn btn-primary btn-lg">
                      Create your first trip
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="grid" style={{ gap: 20 }}>
              {trips.slice(0, 4).map((t, i) => {
                const firstPhoto = t.stops[0] ? cityPhoto(t.stops[0].city.name) : null;
                return (
                  <Reveal key={t.id} delay={i * 90}>
                    <Link href={`/trips/${t.id}`} className="card card-hover" style={{ display: 'flex', gap: 24, padding: 24, alignItems: 'center', borderRadius: 20 }}>
                      <div
                        className="photo-frame"
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 18,
                          flexShrink: 0,
                          background: `linear-gradient(135deg, ${t.coverColor}, ${t.coverColor}bb)`,
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 40,
                          overflow: 'hidden',
                          boxShadow: '0 8px 20px -6px rgba(15,23,42,0.2)',
                        }}
                      >
                        {firstPhoto ? <CityPhoto src={firstPhoto} alt={t.stops[0]?.city.name || ''} sizes="100px" /> : t.coverEmoji || '🧳'}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 18, color: '#042f2e' }}>{t.name}</div>
                        <div className="faint mt-8" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13.5 }}>
                          <span>📅 {fmtRange(t.startDate, t.endDate)}</span>
                          <span>🏙️ {t.stops.length} cities</span>
                          {t.isPublic && <span className="badge badge-teal">🔗 public</span>}
                        </div>
                        <div className="flex gap-8 mt-8" style={{ flexWrap: 'wrap', marginTop: 12 }}>
                          {t.stops.slice(0, 5).map((s) => (
                            <span key={s.id} className="badge badge-amber">
                              {s.city.emoji} {s.city.name}
                            </span>
                          ))}
                          {t.stops.length > 5 && <span className="badge">+{t.stops.length - 5}</span>}
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-16" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 24, color: '#042f2e' }}>Trending Destinations</h2>
            <Link href="/cities" className="faint" style={{ fontWeight: 700, fontSize: 14.5, color: '#0d9488' }}>
              Explore →
            </Link>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {popular.map((c, i) => {
              const photo = cityPhoto(c.name);
              return (
                <Reveal key={c.id} delay={i * 80}>
                  <Link
                    href={`/cities?q=${encodeURIComponent(c.name)}`}
                    className="city-tile"
                    style={{ ['--c1' as string]: c.color, ['--c2' as string]: `${c.color}aa`, minHeight: 175, borderRadius: 20 }}
                  >
                    {photo && <CityPhoto src={photo} alt={c.name} sizes="220px" />}
                    <div className="scrim" />
                    <div className="tile-body" style={{ padding: 20 }}>
                      <div className="name" style={{ fontSize: 20 }}>{c.name}</div>
                      <div className="country" style={{ fontSize: 13 }}>{c.country} · ★ {c.popularity}</div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={200}>
            <div className="card card-pad mt-16 card-hover" style={{ padding: 28, marginTop: 24, borderRadius: 20 }}>
              <h3 style={{ fontSize: 17, marginBottom: 10, color: '#042f2e', fontWeight: 800 }}>💡 Pro Tip</h3>
              <p className="muted" style={{ fontSize: 14.5, leading: 1.6 }}>
                Add stops, then assign activities day by day — GlobeTrotter estimates stay, meals, transport and inter-city travel automatically and flags over-budget days.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
