import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicTrip } from '@/lib/data';
import { computeTripCosts, CATEGORY_META } from '@/lib/estimates';
import { daysBetween, fmtRange, fmtMoney } from '@/lib/dates';
import { cityPhoto } from '@/lib/photos';
import { DayRow } from '@/components/ItineraryView';
import { Empty } from '@/components/ui';
import { CopyTripButton } from '@/components/CopyTripButton';
import { readSession } from '@/lib/auth';
import { CountUp, Reveal } from '@/components/Anim';

export const dynamic = 'force-dynamic';

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const trip = await getPublicTrip(token);
  const session = await readSession();
  if (!trip) notFound();
  if (!trip.isPublic) {
    return (
      <div className="container">
        <div className="card">
          <Empty emoji="🔒" title="This trip is private" sub="The owner has not made this itinerary public." action={<Link href="/" className="btn btn-primary">Go to GlobeTrotter</Link>} />
        </div>
      </div>
    );
  }

  const costs = computeTripCosts(trip);
  const days = daysBetween(trip.startDate, trip.endDate) + 1;
  const isOwner = session?.userId === trip.userId;
  const sortedStops = [...trip.stops].sort((a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime());
  const heroPhoto = trip.coverImage || (sortedStops[0] ? cityPhoto(sortedStops[0].city.name) : null);

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-16 wrap gap-8">
        <Link href="/" className="brand" style={{ color: 'var(--ink)' }}>
          <span className="brand-mark">✈️</span> GlobeTrotter
        </Link>
        <span className="badge">🔗 Shared itinerary</span>
      </div>

      <div className="hero" style={{ background: `linear-gradient(120deg, ${trip.coverColor}, ${trip.coverColor}99)` }}>
        {heroPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroPhoto} alt="" className="hero-photo" style={{ opacity: 0.55 }} />
        )}
        <div className="hero-scrim" style={{ background: `linear-gradient(110deg, ${trip.coverColor}f2 0%, ${trip.coverColor}c9 45%, rgba(15,23,42,0.62) 100%)` }} />
        <div className="flex items-center justify-between wrap gap-16">
          <div className="flex items-center gap-16">
            <div style={{ fontSize: 46 }}>{trip.coverEmoji || '🧳'}</div>
            <div>
              <h1 style={{ fontSize: 28, color: '#fff' }}>{trip.name}</h1>
              <p style={{ opacity: 0.92, marginTop: 4, fontSize: 14.5, fontWeight: 600 }}>
                by {trip.user.name} · 📅 {fmtRange(trip.startDate, trip.endDate)} · 🏙️ {trip.stops.length} cities
              </p>
              {trip.description && <p style={{ opacity: 0.85, marginTop: 8, fontSize: 14, maxWidth: 560 }}>{trip.description}</p>}
            </div>
          </div>
          <div className="flex gap-8 wrap">
            <ShareButtons name={trip.name} token={token} />
            {session ? (
              isOwner ? (
                <Link href={`/trips/${trip.id}`} className="btn" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }}>
                  ✏️ Manage trip
                </Link>
              ) : (
                <CopyTripButton id={trip.id} />
              )
            ) : (
              <Link href="/login" className="btn" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }}>
                Log in to copy
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <Reveal><div className="card card-pad card-hover"><div className="stat-num"><CountUp value={days} /></div><div className="stat-label">Days</div></div></Reveal>
        <Reveal delay={70}><div className="card card-pad card-hover"><div className="stat-num"><CountUp value={trip.stops.length} /></div><div className="stat-label">Cities</div></div></Reveal>
        <Reveal delay={140}><div className="card card-pad card-hover"><div className="stat-num"><CountUp value={costs.totals.total} money /></div><div className="stat-label">Est. total</div></div></Reveal>
        <Reveal delay={210}><div className="card card-pad card-hover"><div className="stat-num"><CountUp value={costs.avgPerDay} money /></div><div className="stat-label">Per day</div></div></Reveal>
      </div>

      <div className="card card-pad mb-16" style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, marginBottom: 10 }}>Estimated cost mix</h3>
        <div className="flex gap-8 wrap">
          {CATEGORY_META.map((c) => {
            const v = costs.totals[c.key];
            const pct = costs.totals.total ? Math.round((v / costs.totals.total) * 100) : 0;
            return (
              <span key={c.key} className="badge" style={{ padding: '7px 12px' }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: c.color, display: 'inline-block' }} />
                {c.emoji} {c.label} · {fmtMoney(v)} ({pct}%)
              </span>
            );
          })}
        </div>
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Day by day</h2>
      {trip.stops.length === 0 ? (
        <div className="card"><Empty emoji="🗺️" title="No stops yet" sub="The owner hasn’t added stops to this trip." /></div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {costs.days.map((d) => (
            <DayRow key={d.key} day={d} />
          ))}
        </div>
      )}

      <div className="card card-pad mt-24" style={{ textAlign: 'center', background: 'linear-gradient(120deg, #0f766e12, #f59e0b12)' }}>
        <div style={{ fontSize: 26, marginBottom: 6 }}>🌍</div>
        <b style={{ fontSize: 15 }}>Inspired? Copy this trip and make it yours.</b>
        <p className="muted mt-8" style={{ fontSize: 13.5 }}>
          {session ? 'One click creates a full copy in your own trips.' : 'Log in to copy it into your GlobeTrotter account.'}
        </p>
      </div>
    </div>
  );
}

function ShareButtons({ name, token }: { name: string; token: string }) {
  return (
    <span className="flex gap-8">
      <ShareCopy token={token} name={name} />
    </span>
  );
}

import { ShareCopy } from '@/components/ShareCopy';
