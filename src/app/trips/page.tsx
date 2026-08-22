import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { getTripsForUser } from '@/lib/data';
import { fmtRange } from '@/lib/dates';
import { cityPhoto } from '@/lib/photos';
import { Empty } from '@/components/ui';
import { Reveal } from '@/components/Anim';
import { DeleteTripInner } from '@/components/DeleteTrip';

export const dynamic = 'force-dynamic';

export default async function TripsPage() {
  const session = await requireUser();
  const trips = await getTripsForUser(session.userId);

  return (
    <div className="container-wide">
      <div className="page-head">
        <div>
          <h1 className="page-title">My Travel Itineraries</h1>
          <p className="page-sub">{trips.length} trip{trips.length !== 1 && 's'} · {trips.reduce((s, t) => s + t.stops.length, 0)} cities planned</p>
        </div>
        <Link href="/trips/new" className="btn btn-primary btn-lg">＋ Plan New Trip</Link>
      </div>

      {trips.length === 0 ? (
        <div className="card card-pad">
          <Empty
            emoji="🧭"
            title="No trips planned yet"
            sub="Every journey starts with a name, a date, and a destination."
            action={<Link href="/trips/new" className="btn btn-primary btn-lg">Create your first trip</Link>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((t, i) => {
            const firstPhoto = t.coverImage || (t.stops[0] ? cityPhoto(t.stops[0].city.name) : null);
            return (
              <Reveal key={t.id} delay={(i % 3) * 90}>
                <div className="card card-hover flex flex-col justify-between h-full overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
                  <div>
                    <Link href={`/trips/${t.id}`} className="photo-frame block relative h-36 w-full overflow-hidden bg-slate-900">
                      {firstPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={firstPhoto} alt="" className="photo-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-4xl text-white"
                          style={{ background: `linear-gradient(135deg, ${t.coverColor}, ${t.coverColor}bb)` }}
                        >
                          {t.coverEmoji || '🧳'}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    </Link>
                    
                    <div className="p-5 space-y-3">
                      <Link href={`/trips/${t.id}`} className="font-extrabold text-lg text-slate-900 font-display block hover:text-teal-700 transition-colors">
                        {t.name}
                      </Link>
                      
                      <div className="text-xs text-slate-500 font-semibold space-y-1">
                        <div>📅 {fmtRange(t.startDate, t.endDate)}</div>
                        <div>🏙️ {t.stops.length} stops planned</div>
                      </div>

                      <div className="flex gap-2 wrap pt-1">
                        {t.isPublic && <span className="badge badge-teal">🔗 Shared</span>}
                        {t.budgetTotal && <span className="badge badge-amber">💵 ${t.budgetTotal.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="divider my-3" />
                    <div className="flex gap-2">
                      <Link href={`/trips/${t.id}/itinerary`} className="btn btn-ghost btn-sm grow text-xs font-bold">View Plan</Link>
                      <Link href={`/trips/${t.id}/edit`} className="btn btn-ghost btn-sm text-xs font-bold">Edit</Link>
                      <DeleteTripInner id={t.id} name={t.name} />
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
