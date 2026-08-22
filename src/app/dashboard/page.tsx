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
    <div className="container">
      <div className="hero" style={{ marginBottom: 22 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_PHOTOS.dashboard} alt="" className="hero-photo" />
        <div className="hero-scrim" />
        <div className="flex items-center justify-between wrap gap-16">
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, opacity: 0.85 }}>{fmtDateFull(today)} · {session.language.toUpperCase()}</p>
            <h1 style={{ fontSize: 34, marginTop: 6 }}>
              <span className="float-emoji">{hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙'}</span> {greeting}, {session.name.split(' ')[0]}
            </h1>
            <p style={{ marginTop: 8, opacity: 0.92, maxWidth: 540, fontSize: 15 }}>
              {upcoming.length
                ? `You have ${upcoming.length} upcoming trip${upcoming.length > 1 ? 's' : ''} — ${upcoming[0].name} starts on ${fmtDateFull(upcoming[0].startDate)}.`
                : 'The map is blank — time to plan something unforgettable.'}
            </p>
          </div>
          <Link href="/trips/new" className="btn btn-accent btn-lg">＋ Plan New Trip</Link>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 22 }}>
        <Reveal><div className="card card-pad card-hover">
          <div className="stat-num"><CountUp value={upcoming.length} /></div>
          <div className="stat-label">Upcoming trips</div>
        </div></Reveal>
        <Reveal delay={80}><div className="card card-pad card-hover">
          <div className="stat-num"><CountUp value={totalStops} /></div>
          <div className="stat-label">Cities on your horizon</div>
        </div></Reveal>
        <Reveal delay={160}><div className="card card-pad card-hover">
          <div className="stat-num"><CountUp value={plannedSpend} money /></div>
          <div className="stat-label">Estimated upcoming spend</div>
        </div></Reveal>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 22 }}>
        <div>
          <div className="flex items-center justify-between mb-16">
            <h2 style={{ fontSize: 20 }}>Your trips</h2>
            <Link href="/trips" className="faint" style={{ fontWeight: 700 }}>View all →</Link>
          </div>
          {trips.length === 0 ? (
            <Reveal>
              <div className="card">
                <div className="empty">
                  <div className="big">🧭</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>No trips yet</div>
                  <p className="muted mt-8">Start with a name, a few dates and a dream.</p>
                  <div className="mt-16" style={{ textAlign: 'center' }}>
                    <Link href="/trips/new" className="btn btn-primary">Create your first trip</Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="grid" style={{ gap: 16 }}>
              {trips.slice(0, 3).map((t, i) => {
                const firstPhoto = t.stops[0] ? cityPhoto(t.stops[0].city.name) : null;
                return (
                  <Reveal key={t.id} delay={i * 90}>
                    <Link href={`/trips/${t.id}`} className="card card-hover" style={{ display: 'flex', gap: 16, padding: 16, alignItems: 'center' }}>
                      <div className="photo-frame" style={{ width: 84, height: 84, borderRadius: 14, flexShrink: 0, background: `linear-gradient(135deg, ${t.coverColor}, ${t.coverColor}bb)`, display: 'grid', placeItems: 'center', fontSize: 34, overflow: 'hidden' }}>
                        {firstPhoto ? <CityPhoto src={firstPhoto} alt={t.stops[0].city.name} sizes="84px" /> : t.coverEmoji || '🧳'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>{t.name}</div>
                        <div className="faint mt-8" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                          <span>📅 {fmtRange(t.startDate, t.endDate)}</span>
                          <span>🏙️ {t.stops.length} cities</span>
                          {t.isPublic && <span>🔗 shared</span>}
                        </div>
                        <div className="flex gap-8 mt-8" style={{ flexWrap: 'wrap' }}>
                          {t.stops.slice(0, 5).map((s) => (
                            <span key={s.id} className="badge">{s.city.emoji} {s.city.name}</span>
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
          <div className="flex items-center justify-between mb-16">
            <h2 style={{ fontSize: 20 }}>Trending destinations</h2>
            <Link href="/cities" className="faint" style={{ fontWeight: 700 }}>Explore →</Link>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {popular.map((c, i) => {
              const photo = cityPhoto(c.name);
              return (
                <Reveal key={c.id} delay={i * 80}>
                  <Link href={`/cities?q=${encodeURIComponent(c.name)}`} className="city-tile" style={{ ['--c1' as string]: c.color, ['--c2' as string]: `${c.color}aa`, minHeight: 150 }}>
                    {photo && <CityPhoto src={photo} alt={c.name} sizes="200px" />}
                    <div className="scrim" />
                    <div className="tile-body">
                      <div className="name">{c.name}</div>
                      <div className="country">{c.country} · ★ {c.popularity}</div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={200}>
            <div className="card card-pad mt-16 card-hover">
              <h3 style={{ fontSize: 15, marginBottom: 8 }}>💡 Pro tip</h3>
              <p className="muted" style={{ fontSize: 13.5 }}>
                Add stops, then assign activities day by day — GlobeTrotter estimates stay, meals, transport and inter-city travel automatically and flags over-budget days.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
