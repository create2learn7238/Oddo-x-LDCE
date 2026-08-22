import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { getTripFull } from '@/lib/data';
import { computeTripCosts, CATEGORY_META } from '@/lib/estimates';
import { daysBetween, fmtDateShort, fmtMoney } from '@/lib/dates';
import { TripShell } from '@/components/TripShell';
import { CityThumbX, Empty } from '@/components/ui';
import { CountUp, Reveal } from '@/components/Anim';

export const dynamic = 'force-dynamic';

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireUser();
  const trip = await getTripFull(id);
  if (!trip) notFound();
  if (trip.userId !== session.userId && !session.isAdmin) notFound();

  const costs = computeTripCosts(trip);
  const days = daysBetween(trip.startDate, trip.endDate) + 1;
  const stops = [...trip.stops].sort((a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime());

  return (
    <TripShell trip={trip} costs={costs} active="overview">
      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <Reveal><div className="card card-pad card-hover">
          <div className="stat-num"><CountUp value={days} /></div>
          <div className="stat-label">Days</div>
        </div></Reveal>
        <Reveal delay={70}><div className="card card-pad card-hover">
          <div className="stat-num"><CountUp value={stops.length} /></div>
          <div className="stat-label">Cities</div>
        </div></Reveal>
        <Reveal delay={140}><div className="card card-pad card-hover">
          <div className="stat-num"><CountUp value={costs.totals.total} money /></div>
          <div className="stat-label">Estimated total</div>
        </div></Reveal>
        <Reveal delay={210}><div className="card card-pad card-hover">
          <div className="stat-num"><CountUp value={costs.avgPerDay} money /></div>
          <div className="stat-label">Per day (avg)</div>
        </div></Reveal>
      </div>

      {stops.length === 0 ? (
        <div className="card">
          <Empty
            emoji="🗺️"
            title="No stops on this route yet"
            sub="Add your first city and start shaping the journey."
            action={<Link href={`/trips/${trip.id}/builder`} className="btn btn-primary">Open itinerary builder</Link>}
          />
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1.7fr 1fr', gap: 20, alignItems: 'start' }}>
          <div className="card card-pad">
            <h2 style={{ fontSize: 18, marginBottom: 14 }}>Route overview</h2>
            <div style={{ display: 'grid', gap: 0 }}>
              {stops.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', gap: 14, position: 'relative', paddingBottom: 18, paddingLeft: 4, animation: `fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${i * 110}ms` }}>
                  {i < stops.length - 1 && (
                    <span style={{ position: 'absolute', left: 25, top: 46, bottom: 0, width: 2, background: 'var(--line)' }} />
                  )}
                  <CityThumbX city={s.city} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-8 wrap">
                      <Link href={`/trips/${trip.id}/builder`} style={{ fontWeight: 800, fontSize: 15.5 }}>{s.city.name}</Link>
                      <span className="faint">{s.city.country}</span>
                      <span className="faint right">{fmtDateShort(s.arrivalDate)} → {fmtDateShort(s.departureDate)}</span>
                    </div>
                    {s.notes && <p className="faint mt-8">📝 {s.notes}</p>}
                    <div className="flex gap-8 mt-8 wrap">
                      <span className="badge">{s.activities.length} activities</span>
                      {s.activities.length > 0 && (
                        <span className="badge badge-amber">
                          {s.activities.map((a) => a.activity.emoji).join(' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div className="flex gap-8 wrap">
              <Link href={`/trips/${trip.id}/builder`} className="btn btn-primary">＋ Add / edit stops</Link>
              <Link href={`/trips/${trip.id}/itinerary`} className="btn btn-ghost">View day-by-day →</Link>
            </div>
          </div>

          <div className="grid gap-20" style={{ gap: 20 }}>
            <div className="card card-pad">
              <h2 style={{ fontSize: 16, marginBottom: 12 }}>💸 Estimated cost mix</h2>
              {CATEGORY_META.map((c) => {
                const v = costs.totals[c.key];
                const pct = costs.totals.total ? Math.round((v / costs.totals.total) * 100) : 0;
                return (
                  <div key={c.key} style={{ marginBottom: 12 }}>
                    <div className="flex items-center justify-between" style={{ fontSize: 13.5, marginBottom: 5 }}>
                      <span style={{ fontWeight: 600 }}>{c.emoji} {c.label}</span>
                      <span className="muted">{fmtMoney(v)} · {pct}%</span>
                    </div>
                    <div className="progress">
                      <i style={{ width: `${pct}%`, background: c.color }} />
                    </div>
                  </div>
                );
              })}
              {trip.budgetTotal && (
                <p className={`faint mt-8`} style={{ color: costs.budgetLeft !== null && costs.budgetLeft < 0 ? 'var(--danger)' : undefined, fontWeight: 700 }}>
                  {costs.budgetLeft !== null && costs.budgetLeft < 0
                    ? `⚠️ Over budget by ${fmtMoney(-costs.budgetLeft!)}`
                    : `✅ ${fmtMoney(costs.budgetLeft!)} under budget`}
                </p>
              )}
              <Link href={`/trips/${trip.id}/budget`} className="faint" style={{ fontWeight: 700, display: 'inline-block', marginTop: 10 }}>
                Full breakdown →
              </Link>
            </div>

            <div className="card card-pad">
              <h2 style={{ fontSize: 16, marginBottom: 10 }}>🗓️ At a glance</h2>
              <p className="muted" style={{ fontSize: 13.5 }}>
                {fmtDateShort(trip.startDate)} – {fmtDateShort(trip.endDate)} · {days} days, {stops.length} cities.
              </p>
              {costs.overBudgetDays > 0 ? (
                <p className="mt-8" style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>
                  ⚠️ {costs.overBudgetDays} day{costs.overBudgetDays > 1 && 's'} look over budget
                </p>
              ) : (
                trip.budgetTotal && (
                  <p className="mt-8" style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--primary)' }}>
                    ✅ Every day fits your daily target
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </TripShell>
  );
}
