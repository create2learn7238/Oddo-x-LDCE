import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { getTripsForUser } from '@/lib/data';
import { fmtRange } from '@/lib/dates';
import { cityPhoto } from '@/lib/photos';
import { Empty } from '@/components/ui';
import { Reveal } from '@/components/Anim';

export const dynamic = 'force-dynamic';

export default async function TripsPage() {
  const session = await requireUser();
  const trips = await getTripsForUser(session.userId);

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1 className="page-title">My Trips</h1>
          <p className="page-sub">{trips.length} trip{trips.length !== 1 && 's'} · {trips.reduce((s, t) => s + t.stops.length, 0)} cities planned</p>
        </div>
        <Link href="/trips/new" className="btn btn-primary btn-lg">＋ Plan New Trip</Link>
      </div>

      {trips.length === 0 ? (
        <div className="card">
          <Empty
            emoji="🧭"
            title="No trips yet"
            sub="Every journey starts with a name and a date."
            action={<Link href="/trips/new" className="btn btn-primary">Create your first trip</Link>}
          />
        </div>
      ) : (
        <div className="grid grid-3">
          {trips.map((t, i) => {
            const firstPhoto = t.coverImage || (t.stops[0] ? cityPhoto(t.stops[0].city.name) : null);
            return (
            <Reveal key={t.id} delay={(i % 3) * 90}>
            <div className="card card-hover" style={{ overflow: 'hidden', height: '100%' }}>
              <Link href={`/trips/${t.id}`} className="photo-frame" style={{ display: 'block' }}>
                {firstPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={firstPhoto} alt="" className="photo-img" style={{ height: 110 }} />
                ) : (
                  <div
                    style={{
                      height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44,
                      background: `linear-gradient(135deg, ${t.coverColor}, ${t.coverColor}bb)`,
                    }}
                  >
                    {t.coverEmoji || '🧳'}
                  </div>
                )}
              </Link>
              <div style={{ padding: 16 }}>
                <Link href={`/trips/${t.id}`} style={{ fontWeight: 800, fontSize: 16, display: 'block', marginBottom: 4 }}>
                  {t.name}
                </Link>
                <p className="faint">📅 {fmtRange(t.startDate, t.endDate)} · 🏙️ {t.stops.length} cities</p>
                <div className="flex gap-8 mt-8 wrap">
                  {t.isPublic && <span className="badge badge-teal">🔗 Shared</span>}
                  {t.budgetTotal && <span className="badge badge-amber">💵 ${t.budgetTotal.toLocaleString()}</span>}
                </div>
                <div className="divider" />
                <div className="flex gap-8">
                  <Link href={`/trips/${t.id}/itinerary`} className="btn btn-ghost btn-sm grow">View plan</Link>
                  <Link href={`/trips/${t.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                  <DeleteTripButton id={t.id} name={t.name} />
                </div>
              </div>
            </div>
            </Reveal>
          );
          })}
        </div>
      )}
    </div>
  );
}

function DeleteTripButton({ id, name }: { id: string; name: string }) {
  return <DeleteTripInner id={id} name={name} />;
}

import { DeleteTripInner } from '@/components/DeleteTrip';
