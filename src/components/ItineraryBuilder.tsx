'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Activity, City } from '@prisma/client';
import type { StopFull, TripFull } from '@/lib/estimates';
import { daysBetween, fmtDateShort, fmtMoney } from '@/lib/dates';
import { CityThumbX, Modal, Toast, useToast, typeMeta } from './ui';

type MinCity = Pick<City, 'id' | 'name' | 'country' | 'region' | 'costIndex' | 'popularity' | 'emoji' | 'color' | 'description'>;

function keyOf(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function shiftD(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export default function ItineraryBuilder({
  trip,
  stops,
  allCities,
  cityActivities,
}: {
  trip: TripFull;
  stops: StopFull[];
  allCities: MinCity[];
  cityActivities: Record<string, Activity[]>;
}) {
  const router = useRouter();
  const [toast, showToast] = useToast();
  const [list, setList] = useState<StopFull[]>(stops);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<StopFull | null>(null);
  const [pickerFor, setPickerFor] = useState<StopFull | null>(null);

  const doFetch = async (url: string, opts?: RequestInit): Promise<boolean> => {
    try {
      const res = await fetch(url, opts);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) showToast(data.error || 'Something went wrong');
      return res.ok;
    } catch {
      showToast('Network error — please try again.');
      return false;
    }
  };
  const post = (url: string, body: unknown) => doFetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const patch = (url: string, body: unknown) => doFetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  /* ---------------- Add stop ---------------- */
  const [cityQuery, setCityQuery] = useState('');
  const [selCity, setSelCity] = useState<MinCity | null>(null);
  const [arrDate, setArrDate] = useState('');
  const [depDate, setDepDate] = useState('');
  const [notes, setNotes] = useState('');

  const filteredCities = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    const base = q
      ? allCities.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.region.toLowerCase().includes(q))
      : allCities;
    return base.slice(0, 30);
  }, [cityQuery, allCities]);

  const openAdd = () => {
    setCityQuery('');
    setSelCity(null);
    setNotes('');
    const sorted = [...list].sort((a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime());
    const last = sorted[sorted.length - 1];
    setArrDate(keyOf(last ? last.departureDate : shiftD(trip.startDate, 0)));
    setDepDate(keyOf(last ? shiftD(last.departureDate, 2) : shiftD(trip.startDate, 2)));
    setAddOpen(true);
  };

  const submitAdd = async () => {
    if (!selCity) return showToast('Pick a city first');
    const ok = await post('/api/stops', { tripId: trip.id, cityId: selCity.id, arrivalDate: arrDate, departureDate: depDate, notes });
    if (ok) {
      showToast(`${selCity.name} added to the route`);
      setAddOpen(false);
      router.refresh();
    }
  };

  /* ---------------- Edit stop (dates / notes) ---------------- */
  const [eArr, setEArr] = useState('');
  const [eDep, setEDep] = useState('');
  const [eNotes, setENotes] = useState('');
  const openEdit = (s: StopFull) => {
    setEArr(keyOf(s.arrivalDate));
    setEDep(keyOf(s.departureDate));
    setENotes(s.notes || '');
    setEditing(s);
  };
  const submitEdit = async () => {
    if (!editing) return;
    const ok = await patch(`/api/stops/${editing.id}`, { arrivalDate: eArr, departureDate: eDep, notes: eNotes });
    if (ok) {
      showToast('Stop updated');
      setEditing(null);
      router.refresh();
    }
  };

  /* ---------------- Reorder / delete ---------------- */
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[idx], next[j]] = [next[j], next[idx]];
    const id = next[j].id;
    setList(next);
    patch(`/api/stops/${id}`, { sequence: j });
  };

  /* ---------------- Activity picker ---------------- */
  const [pQuery, setPQuery] = useState('');
  const [pType, setPType] = useState('');
  const [pDay, setPDay] = useState(0);
  const [pTime, setPTime] = useState('10:00');

  const openPicker = (s: StopFull) => {
    setPQuery('');
    setPType('');
    setPDay(0);
    setPTime('10:00');
    setPickerFor(s);
  };

  const pickerList = useMemo(() => {
    if (!pickerFor) return [];
    const q = pQuery.trim().toLowerCase();
    return (cityActivities[pickerFor.cityId] || []).filter(
      (a) => (!pType || a.type === pType) && (!q || a.name.toLowerCase().includes(q))
    );
  }, [pickerFor, pQuery, pType, cityActivities]);

  const stopLen = (s: StopFull) => Math.max(1, daysBetween(s.arrivalDate, s.departureDate));

  return (
    <div>
      <div className="flex items-center justify-between mb-16 wrap gap-8">
        <div>
          <h2 style={{ fontSize: 19 }}>Itinerary builder</h2>
          <p className="page-sub">Add stops, order your cities, and assign activities day by day.</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={openAdd}>＋ Add Stop</button>
      </div>

      {list.length === 0 && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="empty">
            <div className="big">🗺️</div>
            <div style={{ fontWeight: 700, color: 'var(--ink)' }}>Your route is empty</div>
            <p className="muted mt-8">Add your first stop to start building the journey.</p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 14 }}>
        {list.map((s, i) => (
          <div key={s.id} className="card card-pad" style={{ borderLeft: `5px solid ${s.city.color}` }}>
            <div className="flex items-center gap-12 wrap">
              <CityThumbX city={s.city} size={48} />
              <div style={{ minWidth: 150 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{s.city.name}</div>
                <div className="faint">{s.city.country}</div>
              </div>
              <div style={{ minWidth: 185 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>📅 {fmtDateShort(s.arrivalDate)} → {fmtDateShort(s.departureDate)}</div>
                <div className="faint">{stopLen(s)} days in {s.city.name}</div>
              </div>
              <div className="flex gap-8 right wrap">
                <button className="icon-btn" title="Move earlier" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                <button className="icon-btn" title="Move later" onClick={() => move(i, 1)} disabled={i === list.length - 1}>↓</button>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>Edit dates</button>
                <button
                  className="icon-btn danger"
                  title="Remove stop"
                  onClick={async () => {
                    if (!confirm(`Remove ${s.city.name} from the route? Its activities will be removed too.`)) return;
                    const ok = await doFetch(`/api/stops/${s.id}`, { method: 'DELETE' });
                    if (ok) {
                      showToast(`${s.city.name} removed`);
                      setList((l) => l.filter((x) => x.id !== s.id));
                      router.refresh();
                    }
                  }}
                >
                  🗑
                </button>
              </div>
            </div>

            {s.notes && <p className="faint mt-8">📝 {s.notes}</p>}

            <div className="divider" />

            {s.activities.length === 0 ? (
              <p className="faint">No activities yet — enrich this stop with things to do.</p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {s.activities.map((sa) => {
                  const tm = typeMeta(sa.activity.type);
                  return (
                    <div key={sa.id} className="act-row" style={{ borderLeft: `4px solid ${tm.color}` }}>
                      <div className="act-emoji" style={{ background: `${tm.color}1a` }}>{sa.activity.emoji}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14.5 }}>
                          {sa.activity.name}
                          <span className="badge" style={{ marginLeft: 8 }}>{tm.label}</span>
                        </div>
                        <div className="faint">
                          Day {sa.dayOffset + 1}
                          {sa.startTime ? ` · ${sa.startTime}` : ''} · {sa.activity.duration}h
                        </div>
                      </div>
                      <span className="cost">{fmtMoney(sa.cost)}</span>
                      <button
                        className="icon-btn danger"
                        title="Remove activity"
                        onClick={async () => {
                          const ok = await doFetch(`/api/stop-activities/${sa.id}`, { method: 'DELETE' });
                          if (ok) {
                            showToast('Activity removed');
                            setList((l) => l.map((x) => (x.id === s.id ? { ...x, activities: x.activities.filter((y) => y.id !== sa.id) } : x)));
                            router.refresh();
                          }
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-16" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => openPicker(s)}>＋ Add activity in {s.city.name}</button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Add stop modal ---------- */}
      {addOpen && (
        <Modal title="Add a stop" onClose={() => setAddOpen(false)} wide>
          <div className="row2">
            <div className="field">
              <label className="label">Search city</label>
              <input className="input" placeholder="City, country or region…" value={cityQuery} onChange={(e) => setCityQuery(e.target.value)} autoFocus />
            </div>
            <div className="field">
              <label className="label">…or pick from the list</label>
              <div style={{ display: 'grid', gap: 6, maxHeight: 190, overflowY: 'auto', paddingRight: 6 }}>
                {filteredCities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelCity(c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10,
                      border: selCity?.id === c.id ? '2px solid var(--primary)' : '1px solid var(--line)',
                      background: selCity?.id === c.id ? 'var(--primary-soft)' : '#fff',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{c.emoji}</span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</span>
                    <span className="faint">{c.country}</span>
                    <span className="badge right">${c.costIndex}</span>
                  </button>
                ))}
                {filteredCities.length === 0 && <p className="faint">No cities match.</p>}
              </div>
            </div>
          </div>
          {selCity && (
            <p className="faint mb-16">
              {selCity.description}
              <span className="badge badge-teal" style={{ marginLeft: 6 }}>cost {selCity.costIndex}/5 · popularity {selCity.popularity}</span>
            </p>
          )}
          <div className="row2">
            <div className="field">
              <label className="label">Arrival date</label>
              <input className="input" type="date" value={arrDate} onChange={(e) => setArrDate(e.target.value)} required />
            </div>
            <div className="field">
              <label className="label">Departure date</label>
              <input className="input" type="date" value={depDate} onChange={(e) => setDepDate(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label className="label">Notes <span className="faint">(optional)</span></label>
            <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Arrive via international flight" />
          </div>
          <div className="flex gap-8" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitAdd}>Add stop</button>
          </div>
        </Modal>
      )}

      {/* ---------- Edit stop modal ---------- */}
      {editing && (
        <Modal title={`Edit ${editing.city.name}`} onClose={() => setEditing(null)}>
          <div className="row2">
            <div className="field">
              <label className="label">Arrival date</label>
              <input className="input" type="date" value={eArr} onChange={(e) => setEArr(e.target.value)} required />
            </div>
            <div className="field">
              <label className="label">Departure date</label>
              <input className="input" type="date" value={eDep} onChange={(e) => setEDep(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label className="label">Notes</label>
            <input className="input" value={eNotes} onChange={(e) => setENotes(e.target.value)} />
          </div>
          <div className="flex gap-8" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitEdit}>Save</button>
          </div>
        </Modal>
      )}

      {/* ---------- Activity picker modal ---------- */}
      {pickerFor && (
        <Modal title={`Add activities · ${pickerFor.city.name}`} onClose={() => setPickerFor(null)} wide>
          <div className="row2" style={{ marginBottom: 12 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Search</label>
              <input className="input" placeholder="Filter activities…" value={pQuery} onChange={(e) => setPQuery(e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Type</label>
              <select className="select" value={pType} onChange={(e) => setPType(e.target.value)}>
                <option value="">All types</option>
                {Object.entries(typeMeta).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {v.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row2" style={{ marginBottom: 14 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Day</label>
              <select className="select" value={pDay} onChange={(e) => setPDay(Number(e.target.value))}>
                {Array.from({ length: stopLen(pickerFor) }, (_, i) => (
                  <option key={i} value={i}>Day {i + 1}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Start time</label>
              <input className="input" type="time" value={pTime} onChange={(e) => setPTime(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
            {pickerList.map((a) => {
              const tm = typeMeta(a.type);
              return (
                <div key={a.id} className="act-row">
                  <div className="act-emoji" style={{ background: `${tm.color}1a` }}>{a.emoji}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                    <div className="faint">
                      {tm.emoji} {tm.label} · {a.duration}h · {a.description.slice(0, 56)}{a.description.length > 56 && '…'}
                    </div>
                  </div>
                  <span className="cost">{fmtMoney(a.cost)}</span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={async () => {
                      const ok = await post('/api/stop-activities', { stopId: pickerFor.id, activityId: a.id, dayOffset: pDay, startTime: pTime });
                      if (ok) {
                        showToast(`Added “${a.name}” — Day ${pDay + 1}, ${pTime}`);
                        setPickerFor(null);
                        router.refresh();
                      }
                    }}
                  >
                    ＋ Add
                  </button>
                </div>
              );
            })}
            {pickerList.length === 0 && <p className="faint" style={{ padding: 12 }}>No activities match those filters.</p>}
          </div>
        </Modal>
      )}

      <Toast message={toast} />
    </div>
  );
}
