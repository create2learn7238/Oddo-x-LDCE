import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { getTripFull } from '@/lib/data';
import { computeTripCosts, CATEGORY_META } from '@/lib/estimates';
import { fmtMoney } from '@/lib/dates';
import { TripShell } from '@/components/TripShell';
import { Badge, Empty } from '@/components/ui';
import { DonutChart, DayBars } from '@/components/Charts';
import { CountUp, Reveal } from '@/components/Anim';

export const dynamic = 'force-dynamic';

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireUser();
  const trip = await getTripFull(id);
  if (!trip) notFound();
  if (trip.userId !== session.userId && !session.isAdmin) notFound();

  const costs = computeTripCosts(trip);
  const overDays = costs.days.filter((d) => d.overBudget);
  const pct = trip.budgetTotal ? Math.min(100, Math.round((costs.totals.total / trip.budgetTotal) * 100)) : 0;

  return (
    <TripShell trip={trip} costs={costs} active="budget">
      <h2 style={{ fontSize: 19, marginBottom: 4 }}>Trip budget & cost breakdown</h2>
      <p className="page-sub mb-16">
        Estimates per person: stay, meals & local transport scale with each city’s cost index; inter-city travel is estimated from route distance.
      </p>

      {trip.stops.length === 0 ? (
        <div className="card">
          <Empty emoji="💸" title="No costs yet" sub="Add stops to see the full financial picture." action={<Link href={`/trips/${trip.id}/builder`} className="btn btn-primary">Open builder</Link>} />
        </div>
      ) : (
        <>
          <div className="grid grid-4" style={{ marginBottom: 20 }}>
            <Reveal><div className="card card-pad card-hover">
              <div className="stat-num"><CountUp value={costs.totals.total} money /></div>
              <div className="stat-label">Estimated total</div>
            </div></Reveal>
            <Reveal delay={70}><div className="card card-pad card-hover">
              <div className="stat-num"><CountUp value={costs.avgPerDay} money /></div>
              <div className="stat-label">Average per day</div>
            </div></Reveal>
            <Reveal delay={140}><div className="card card-pad card-hover">
              <div className="stat-num" style={{ color: trip.budgetTotal && costs.budgetLeft !== null && costs.budgetLeft < 0 ? 'var(--danger)' : 'var(--primary)' }}>
                {trip.budgetTotal ? <CountUp value={trip.budgetTotal} money /> : '—'}
              </div>
              <div className="stat-label">
                Budget set
                {trip.budgetTotal && costs.budgetLeft !== null && (
                  <div className="progress" style={{ marginTop: 8, background: costs.budgetLeft < 0 ? 'var(--danger-soft)' : undefined }}>
                    <i style={{ width: `${pct}%`, background: costs.budgetLeft < 0 ? 'var(--danger)' : 'var(--primary)' }} />
                  </div>
                )}
              </div>
            </div></Reveal>
            <Reveal delay={210}><div className="card card-pad card-hover">
              <div className="stat-num" style={{ color: overDays.length ? 'var(--danger)' : 'var(--primary)' }}>
                <CountUp value={overDays.length} />
              </div>
              <div className="stat-label">Over-budget days</div>
            </div></Reveal>
          </div>

          <div className="grid grid-2" style={{ marginBottom: 20, alignItems: 'stretch' }}>
            <Reveal><div className="card card-pad card-hover">
              <h3 style={{ fontSize: 16, marginBottom: 14 }}>Cost by category</h3>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <DonutChart costs={costs} />
                <div style={{ display: 'grid', gap: 10, minWidth: 190, flex: 1 }}>
                  {CATEGORY_META.map((c) => {
                    const v = costs.totals[c.key];
                    const share = costs.totals.total ? Math.round((v / costs.totals.total) * 100) : 0;
                    return (
                      <div key={c.key} className="flex items-center gap-8">
                        <span style={{ width: 11, height: 11, borderRadius: 4, background: c.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1 }}>{c.emoji} {c.label}</span>
                        <span className="faint">{share}%</span>
                        <span style={{ fontSize: 13.5, fontWeight: 800, minWidth: 62, textAlign: 'right' }}>{fmtMoney(v)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div></Reveal>

            <Reveal delay={90}><div className="card card-pad card-hover">
              <h3 style={{ fontSize: 16, marginBottom: 14 }}>Daily spend</h3>
              <DayBars costs={costs} />
              {costs.dailyTarget && (
                <p className="faint mt-8" style={{ fontSize: 12.5 }}>
                  ┄┄ daily target {fmtMoney(costs.dailyTarget)} (budget ÷ {costs.totalDays} days)
                </p>
              )}
            </div></Reveal>
          </div>

          {overDays.length > 0 && (
            <div className="card card-pad" style={{ border: '1px solid #fecaca', background: '#fffafa' }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>⚠️ Over-budget days</h3>
              <div className="grid grid-3">
                {overDays.map((d) => (
                  <div key={d.key} className="card card-pad" style={{ background: '#fff' }}>
                    <div className="flex items-center justify-between">
                      <b>Day {d.dayNum + 1}</b>
                      <Badge tone="red">{fmtMoney(d.costs.total)}</Badge>
                    </div>
                    <p className="faint mt-8">
                      {d.stop?.city.name} · target {fmtMoney(costs.dailyTarget!)}
                      {d.travel ? ` · includes ${d.travel.mode} to ${d.travel.to.name}` : ''}
                    </p>
                  </div>
                ))}
              </div>
              <p className="faint mt-16" style={{ fontSize: 13 }}>
                Tips: shift pricey activities to cheaper cities, tighten the stay choice, or set a higher budget in trip settings.
              </p>
            </div>
          )}
        </>
      )}
    </TripShell>
  );
}
