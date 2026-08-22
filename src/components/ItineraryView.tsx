'use client';

import { useState } from 'react';
import type { TripFull, TripCosts, DayPlan } from '@/lib/estimates';
import { fmtDate, fmtDateShort, fmtMoney } from '@/lib/dates';
import { Badge, CityThumbX, typeMeta } from './ui';
import { Reveal } from './Anim';

export default function ItineraryView({ trip, costs }: { trip: TripFull; costs: TripCosts }) {
  const [mode, setMode] = useState<'list' | 'city'>('list');
  const stops = [...trip.stops].sort((a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-16 wrap gap-8">
        <div>
          <h2 style={{ fontSize: 19 }}>Itinerary</h2>
          <p className="page-sub">
            {costs.totalDays} days · {stops.length} cities · est. {fmtMoney(costs.totals.total)}
          </p>
        </div>
        <div className="tabstrip">
          <button className={`tab ${mode === 'list' ? 'active' : ''}`} onClick={() => setMode('list')}>📋 Day-wise</button>
          <button className={`tab ${mode === 'city' ? 'active' : ''}`} onClick={() => setMode('city')}>🏙️ By city</button>
        </div>
      </div>

      {stops.length === 0 ? (
        <div className="card"><div className="empty"><div className="big">🗺️</div><div style={{ fontWeight: 700, color: 'var(--ink)' }}>Nothing planned yet</div><p className="muted mt-8">Add stops in the builder to see your day-by-day plan.</p></div></div>
      ) : mode === 'list' ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {costs.days.map((d, i) => (
            <Reveal key={d.key} delay={Math.min(i, 6) * 70}>
              <DayRow day={d} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {stops.map((s, i) => (
            <Reveal key={s.id} delay={i * 90}>
            <div className="card card-pad" style={{ borderLeft: `5px solid ${s.city.color}` }}>
              <div className="flex items-center gap-12 mb-16 wrap">
                <CityThumbX city={s.city} size={46} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>
                    Stop {i + 1} · {s.city.name}, {s.city.country}
                  </div>
                  <div className="faint">{fmtDateShort(s.arrivalDate)} → {fmtDateShort(s.departureDate)}</div>
                </div>
                <span className="right"><Badge tone="amber">{s.activities.length} activities</Badge></span>
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {s.activities.map((sa) => {
                  const tm = typeMeta(sa.activity.type);
                  return (
                    <div key={sa.id} className="act-row" style={{ borderLeft: `4px solid ${tm.color}` }}>
                      <div className="act-emoji" style={{ background: `${tm.color}1a` }}>{sa.activity.emoji}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14.5 }}>{sa.activity.name}</div>
                        <div className="faint">
                          Day {sa.dayOffset + 1} of {s.city.name}
                          {sa.startTime ? ` · ${sa.startTime}` : ''} · {sa.activity.duration}h
                        </div>
                      </div>
                      <span className="cost">{fmtMoney(sa.cost)}</span>
                    </div>
                  );
                })}
                {s.activities.length === 0 && <p className="faint">No activities assigned in {s.city.name}.</p>}
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

export function DayRow({ day }: { day: DayPlan }) {
  const c = day.costs;
  return (
    <div className="day-block" style={day.overBudget ? { outline: '2px solid #fecaca' } : undefined}>
      <div className="day-side">
        <div className="faint" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>Day {day.dayNum + 1}</div>
        <div style={{ fontWeight: 800, fontSize: 14.5, marginTop: 4 }}>{fmtDate(day.date)}</div>
        {day.stop && (
          <div className="flex items-center gap-8 mt-8">
            <CityThumbX city={day.stop.city} size={30} />
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>{day.stop.city.name}</span>
          </div>
        )}
        <div className="mt-8" style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-2)' }}>{fmtMoney(c.total)}</div>
        {day.overBudget && <Badge tone="red" className="mt-8">over budget</Badge>}
      </div>
      <div className="day-main" style={{ display: 'grid', gap: 8 }}>
        {day.travel && (
          <div className="travel-strip">
            {day.travel.mode === 'flight' ? '✈️' : '🚆'} Travel to {day.travel.to.emoji} {day.travel.to.name}
            <span className="faint" style={{ fontWeight: 600 }}>
              ({day.travel.km.toLocaleString()} km · est. {fmtMoney(day.travel.cost)})
            </span>
          </div>
        )}
        {day.activities.map((sa) => {
          const tm = typeMeta(sa.activity.type);
          return (
            <div key={sa.id} className="act-row" style={{ borderLeft: `4px solid ${tm.color}` }}>
              <div className="act-emoji" style={{ background: `${tm.color}1a` }}>{sa.activity.emoji}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{sa.activity.name}</div>
                <div className="faint">{tm.label} · {sa.activity.duration}h</div>
              </div>
              {sa.startTime && <span className="time" style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--ink-2)', fontSize: 13 }}>{sa.startTime}</span>}
              <span className="cost">{fmtMoney(sa.cost)}</span>
            </div>
          );
        })}
        {day.activities.length === 0 && !day.travel && <p className="faint" style={{ padding: '4px 2px' }}>A free day — rest, wander, or add activities from the builder.</p>}
      </div>
    </div>
  );
}
