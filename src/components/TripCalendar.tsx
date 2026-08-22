'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { TripFull, TripCosts } from '@/lib/estimates';
import { dateKey, fmtDate, fmtMoney, monthLabel } from '@/lib/dates';
import { Toast, useToast, typeMeta } from './ui';
import { Reveal } from './Anim';

export default function TripCalendar({ trip, costs }: { trip: TripFull; costs: TripCosts }) {
  const router = useRouter();
  const [toast, showToast] = useToast();
  const [view, setView] = useState(() => {
    const d = new Date(trip.startDate);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  // Set after mount so SSR HTML and client hydration always agree (local-timezone date).
  const [todayKey, setTodayKey] = useState('');
  useEffect(() => {
    setTodayKey(dateKey(new Date()));
  }, []);

  const byKey = useMemo(() => new Map(costs.days.map((d) => [d.key, d])), [costs.days]);

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const startPad = first.getDay();
    const grid: (string | null)[] = Array.from({ length: startPad }, () => null);
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(view.getFullYear(), view.getMonth(), d);
      grid.push(dateKey(dt));
    }
    return grid;
  }, [view]);

  const shiftMonth = (n: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1));

  const dropOn = async (saId: string, dayKey: string) => {
    const day = byKey.get(dayKey);
    if (!day?.stop) return;
    const sa = day.stop.activities.find((a) => a.id === saId);
    const sourceDay = sa ? costs.days.find((d) => d.activities.some((a) => a.id === saId)) : undefined;
    if (sourceDay && sourceDay.key === dayKey) return; // dropped on its own day
    const offset = Math.round((new Date(dayKey + 'T00:00:00').getTime() - day.stop.arrivalDate.getTime()) / 86400000);
    const res = await fetch(`/api/stop-activities/${saId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayOffset: offset }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(data.error || 'Could not move activity');
      return;
    }
    showToast('Activity moved');
    router.refresh();
  };

  const setTime = async (saId: string, time: string) => {
    const res = await fetch(`/api/stop-activities/${saId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startTime: time }),
    });
    if (res.ok) {
      showToast('Time updated');
      router.refresh();
    }
  };

  const selDay = selected ? byKey.get(selected) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-16 wrap gap-8">
        <div>
          <h2 style={{ fontSize: 19 }}>Trip calendar</h2>
          <p className="page-sub">Drag activities between days to re-plan · click a day for details</p>
        </div>
        <div className="flex items-center gap-8">
          <button className="icon-btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">←</button>
          <span style={{ fontWeight: 800, fontSize: 15.5, minWidth: 150, textAlign: 'center' }}>{monthLabel(view)}</span>
          <button className="icon-btn" onClick={() => shiftMonth(1)} aria-label="Next month">→</button>
        </div>
      </div>

      <Reveal>
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <div className="cal-grid" key={monthLabel(view)}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="cal-dow">{d}</div>
          ))}
          {cells.map((key, i) => {
            if (!key) return <div key={`e${i}`} className="cal-cell empty" />;
            const day = byKey.get(key);
            const isSel = selected === key;
            const isOver = dragOver === key;
            return (
              <div
                key={key}
                className={`cal-cell cell-pop ${key === todayKey ? 'today' : ''} ${isOver ? 'drag-target' : ''}`}
                style={{
                  animationDelay: `${i * 14}ms`,
                  ...(day
                    ? { background: `${day.stop?.city.color}14`, borderColor: `${day.stop?.city.color}66` }
                    : {}),
                }}
                onClick={() => day && setSelected(isSel ? null : key)}
                onDragOver={(e) => {
                  if (day?.stop) {
                    e.preventDefault();
                    setDragOver(key);
                  }
                }}
                onDragLeave={() => setDragOver((d) => (d === key ? null : d))}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  const id = e.dataTransfer.getData('text/plain');
                  if (id && day?.stop) dropOn(id, key);
                }}
              >
                <span className={`num ${isSel ? '' : ''}`} style={isSel ? { color: 'var(--primary)' } : undefined}>{Number(key.slice(8))}</span>
                {day && day.stop && (
                  <>
                    <span className="cal-city" style={{ background: day.stop.city.color }}>{day.stop.city.name}</span>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 'auto' }}>
                      {day.activities.slice(0, 4).map((a) => (
                        <span key={a.id} title={a.activity.name} style={{ fontSize: 11 }}>{a.activity.emoji}</span>
                      ))}
                      {day.activities.length > 4 && <span className="faint" style={{ fontSize: 10 }}>+{day.activities.length - 4}</span>}
                    </div>
                  </>
                )}
                {day && day.overBudget && <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 11 }}>⚠️</span>}
              </div>
            );
          })}
        </div>
      </div>
      </Reveal>

      {selDay && selDay.stop && (
        <div className="card card-pad" style={{ animation: 'modalIn 0.4s cubic-bezier(0.22,1,0.36,1) both' }} key={selDay.key}>
          <div className="flex items-center justify-between mb-16">
            <h3 style={{ fontSize: 16 }}>
              Day {selDay.dayNum + 1} · {fmtDate(selDay.date)} · {selDay.stop.city.emoji} {selDay.stop.city.name}
              {selDay.overBudget && <span className="badge badge-red" style={{ marginLeft: 8 }}>over budget</span>}
            </h3>
            <span style={{ fontWeight: 800 }}>{fmtMoney(selDay.costs.total)}</span>
          </div>
          {selDay.travel && (
            <div className="travel-strip" style={{ marginBottom: 10 }}>
              {selDay.travel.mode === 'flight' ? '✈️' : '🚆'} Travel to {selDay.travel.to.emoji} {selDay.travel.to.name} · {fmtMoney(selDay.travel.cost)}
            </div>
          )}
          <div style={{ display: 'grid', gap: 8 }}>
            {selDay.activities
              .slice()
              .sort((a, b) => (a.startTime || '99:99').localeCompare(b.startTime || '99:99'))
              .map((sa) => {
                const tm = typeMeta(sa.activity.type);
                return (
                  <div
                    key={sa.id}
                    className="act-row"
                    style={{ borderLeft: `4px solid ${tm.color}`, cursor: 'grab' }}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', sa.id)}
                  >
                    <div className="act-emoji" style={{ background: `${tm.color}1a` }}>{sa.activity.emoji}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14.5 }}>{sa.activity.name}</div>
                      <div className="faint">{tm.label} · {sa.activity.duration}h · {fmtMoney(sa.cost)}</div>
                    </div>
                    <input
                      className="input"
                      type="time"
                      style={{ width: 108, padding: '6px 10px' }}
                      defaultValue={sa.startTime || ''}
                      placeholder="time"
                      onBlur={(e) => e.target.value !== (sa.startTime || '') && setTime(sa.id, e.target.value)}
                    />
                  </div>
                );
              })}
            {selDay.activities.length === 0 && <p className="faint">Nothing planned for this day.</p>}
          </div>
          <p className="faint mt-16" style={{ fontSize: 12.5 }}>
            Tip: drag a row onto another day in the calendar above to move it.
          </p>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
