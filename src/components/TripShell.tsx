import Link from 'next/link';
import type { ReactNode } from 'react';
import type { TripFull, TripCosts } from '@/lib/estimates';
import { fmtRange, fmtMoney } from '@/lib/dates';
import { cityPhoto } from '@/lib/photos';
import { SharePanel } from './SharePanel';
import { DeleteTripInner } from './DeleteTrip';

const TABS = [
  { key: 'overview', label: 'Overview', href: '' },
  { key: 'builder', label: 'Builder', href: '/builder' },
  { key: 'itinerary', label: 'Itinerary', href: '/itinerary' },
  { key: 'budget', label: 'Budget', href: '/budget' },
  { key: 'calendar', label: 'Calendar', href: '/calendar' },
];

export function TripShell({ trip, costs, active, children }: { trip: TripFull; costs: TripCosts; active: string; children: ReactNode }) {
  const sortedStops = [...trip.stops].sort((a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime());
  const heroPhoto = trip.coverImage || (sortedStops[0] ? cityPhoto(sortedStops[0].city.name) : null);
  return (
    <div className="container-wide">
      <div
        className="hero"
        style={{
          background: `linear-gradient(120deg, ${trip.coverColor}, ${trip.coverColor}99)`,
          marginBottom: 20,
        }}
      >
        {heroPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroPhoto} alt="" className="hero-photo" style={{ opacity: 0.55 }} />
        )}
        <div className="hero-scrim" style={{ background: `linear-gradient(110deg, ${trip.coverColor}f2 0%, ${trip.coverColor}c9 45%, rgba(15,23,42,0.62) 100%)` }} />
        <div className="flex items-center justify-between wrap gap-16">
          <div className="flex items-center gap-16" style={{ minWidth: 0 }}>
            <div style={{ fontSize: 46, lineHeight: 1 }}>{trip.coverEmoji || '🧳'}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 28, color: '#fff' }}>{trip.name}</h1>
                {trip.isPublic && <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}>🔗 Public</span>}
              </div>
              <p style={{ opacity: 0.92, marginTop: 4, fontSize: 14.5, fontWeight: 600 }}>
                📅 {fmtRange(trip.startDate, trip.endDate)} · 🏙️ {trip.stops.length} cities · 💰 est. {fmtMoney(costs.totals.total)}
                {trip.budgetTotal && ` / ${fmtMoney(trip.budgetTotal)}`}
              </p>
              <div className="flex gap-8 mt-8 wrap">
                {trip.stops.map((s, i) => (
                  <Link key={s.id} href={`/cities?q=${encodeURIComponent(s.city.name)}`} className="badge" style={{ background: 'rgba(255,255,255,0.22)', color: '#fff' }}>
                    {i + 1}. {s.city.emoji} {s.city.name}
                  </Link>
                ))}
                {trip.stops.length === 0 && <span className="badge" style={{ background: 'rgba(255,255,255,0.22)', color: '#fff' }}>No stops yet</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-8 wrap">
            <SharePanel trip={{ id: trip.id, name: trip.name, isPublic: trip.isPublic, shareToken: trip.shareToken }} />
            <Link href={`/trips/${trip.id}/edit`} className="btn" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }}>
              ✏️ Edit
            </Link>
            <CopyTripButton id={trip.id} />
            <DeleteTripInner id={trip.id} name={trip.name} />
          </div>
        </div>
      </div>

      <div className="tabstrip mb-16" style={{ marginBottom: 20 }}>
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/trips/${trip.id}${t.href}`}
            className={`tab ${active === t.key ? 'active' : ''}`}
            style={active !== t.key ? { textDecoration: 'none' } : undefined}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}

import { CopyTripButton } from './CopyTripButton';
