'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import type { Activity } from '@prisma/client';
import { fmtMoney } from '@/lib/dates';
import { Modal, Toast, TYPE_META, typeMeta, useToast } from './ui';
import { Reveal } from './Anim';

export default function ActivitySearch(props: ActivitySearchProps) {
  return (
    <Suspense>
      <ActivitySearchInner {...props} />
    </Suspense>
  );
}

type CityOpt = { id: string; name: string; country: string; emoji: string };
type ActRow = Activity & { city: { name: string; country: string; emoji: string } };

type ActivitySearchProps = {
  cities: CityOpt[];
  activities: ActRow[];
  initialCityId: string;
  initialQ: string;
};

const TYPES = Object.keys(TYPE_META);

function ActivitySearchInner({ cities, activities: all, initialCityId, initialQ }: ActivitySearchProps) {
  const router = useRouter();
  const [toast, showToast] = useToast();
  const [city, setCity] = useState(initialCityId);
  const [q, setQ] = useState(initialQ);
  const [type, setType] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [maxDur, setMaxDur] = useState('');
  const [quick, setQuick] = useState<ActRow | null>(null);
  const [addFor, setAddFor] = useState<ActRow | null>(null);
  const [trips, setTrips] = useState<{ id: string; name: string }[] | null>(null);
  const [selTrip, setSelTrip] = useState('');
  const [busy, setBusy] = useState(false);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return all.filter(
      (a) =>
        (!city || a.cityId === city) &&
        (!query || a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)) &&
        (!type || a.type === type) &&
        (!maxCost || a.cost <= Number(maxCost)) &&
        (!maxDur || a.duration <= Number(maxDur))
    );
  }, [all, city, q, type, maxCost, maxDur]);

  const loadTrips = async () => {
    if (trips) return trips;
    const res = await fetch('/api/trips/mine');
    if (res.ok) {
      const data = await res.json();
      setTrips(data.trips);
      return data.trips as { id: string; name: string }[];
    }
    setTrips([]);
    return [];
  };

  const openAdd = async (a: ActRow) => {
    setAddFor(a);
    setSelTrip('');
    const t = await loadTrips();
    if (t.length === 0) showToast('Create a trip first, then add activities');
  };

  const submitAdd = async () => {
    if (!addFor || !selTrip) return showToast('Pick a trip');
    setBusy(true);
    const res = await fetch('/api/stops/for-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: selTrip, activityId: addFor.id }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      showToast(data.error || 'Could not add activity');
      return;
    }
    showToast(data.message || 'Activity added');
    setAddFor(null);
    router.push(`/trips/${selTrip}/builder`);
    router.refresh();
  };

  return (
    <div className="container-wide">
      <div className="page-head">
        <div>
          <h1 className="page-title">Activity & Experience Finder</h1>
          <p className="page-sub">{all.length} experiences — sightseeing, culinary, culture, outdoor & adventure.</p>
        </div>
      </div>

      <div className="card card-pad mb-16" style={{ padding: 24, marginBottom: 24, borderRadius: 20 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">City</label>
            <select className="select" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">Search</label>
            <input className="input" placeholder="Activities…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">Max Cost</label>
            <select className="select" value={maxCost} onChange={(e) => setMaxCost(e.target.value)}>
              <option value="">Any Cost</option>
              <option value="15">Under $15</option>
              <option value="30">Under $30</option>
              <option value="60">Under $60</option>
              <option value="100">Under $100</option>
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">Max Duration</label>
            <select className="select" value={maxDur} onChange={(e) => setMaxDur(e.target.value)}>
              <option value="">Any Duration</option>
              <option value="2">Up to 2h</option>
              <option value="4">Up to 4h</option>
              <option value="8">Up to 8h</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 wrap mt-16" style={{ marginTop: 16 }}>
          <button className={`chip ${type === '' ? 'active' : ''}`} onClick={() => setType('')}>All types</button>
          {TYPES.map((t) => (
            <button key={t} className={`chip ${type === t ? 'active' : ''}`} onClick={() => setType(type === t ? '' : t)}>
              {TYPE_META[t].emoji} {TYPE_META[t].label}
            </button>
          ))}
        </div>
      </div>

      <p className="faint mb-16" style={{ fontWeight: 700, color: '#475569' }}>Showing {list.length} activities</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {list.map((a, i) => {
          const tm = typeMeta(a.type);
          return (
            <Reveal key={a.id} delay={(i % 2) * 80}>
              <div className="card card-pad card-hover flex flex-col justify-between h-full p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="act-emoji flex-shrink-0" style={{ background: `${tm.color}1a`, width: 48, height: 48, fontSize: 24, borderRadius: 14 }}>
                      {a.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="font-extrabold text-base text-slate-900 font-display">{a.name}</h3>
                        <span className="badge" style={{ background: `${tm.color}1a`, color: tm.color }}>{tm.label}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-semibold mt-1">
                        {a.city.emoji} {a.city.name}, {a.city.country}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">{a.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg">⏱ {a.duration}h</span>
                    <span className="text-amber-700 font-extrabold text-sm">{fmtMoney(a.cost)}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => setQuick(a)}>Quick view</button>
                    <button className="btn btn-primary btn-sm" onClick={() => openAdd(a)}>＋ Add to trip</button>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {list.length === 0 && (
        <div className="card card-pad mt-8">
          <div className="empty">
            <div className="big">🔭</div>
            <div style={{ fontWeight: 800, color: 'var(--ink)', fontSize: 18 }}>Nothing matches your filter</div>
            <p className="muted mt-8">Try clearing search terms or selecting another city.</p>
          </div>
        </div>
      )}

      {quick && (
        <Modal title={quick.name} onClose={() => setQuick(null)}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
            <div className="act-emoji" style={{ background: `${typeMeta(quick.type).color}1a`, width: 56, height: 56, fontSize: 28, borderRadius: 16 }}>{quick.emoji}</div>
            <div>
              <div className="faint">{quick.city.emoji} {quick.city.name}, {quick.city.country}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <span className="badge">{typeMeta(quick.type).label}</span>
                <span className="badge badge-blue">⏱ {quick.duration}h</span>
                <span className="badge badge-amber">{fmtMoney(quick.cost)}</span>
              </div>
            </div>
          </div>
          <p className="muted" style={{ fontSize: 14.5, leading: 1.6 }}>{quick.description}</p>
          <div className="mt-24 flex" style={{ justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-primary" onClick={() => { openAdd(quick); setQuick(null); }}>＋ Add to trip</button>
          </div>
        </Modal>
      )}

      {addFor && (
        <Modal title={`Add “${addFor.name}”`} onClose={() => setAddFor(null)}>
          <p className="muted mb-16" style={{ fontSize: 14, marginBottom: 16 }}>
            This activity will be attached to a stop in <b>{addFor.city.name}</b>. If your trip has no {addFor.city.name} stop yet, we’ll add one for you automatically.
          </p>
          <div className="field">
            <label className="label">Select Target Trip</label>
            <select className="select" value={selTrip} onChange={(e) => setSelTrip(e.target.value)}>
              <option value="">Select a trip…</option>
              {(trips ?? []).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {trips && trips.length === 0 && <p className="form-hint">You have no trips yet — create one from the dashboard.</p>}
          </div>
          <div className="flex gap-8" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn-ghost" onClick={() => setAddFor(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitAdd} disabled={busy || !selTrip}>{busy ? 'Adding…' : 'Confirm Add'}</button>
          </div>
        </Modal>
      )}

      <Toast message={toast} />
    </div>
  );
}
