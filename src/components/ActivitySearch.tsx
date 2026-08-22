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
    showToast(data.message || 'Activity added to trip');
    setAddFor(null);
    router.push(`/trips/${selTrip}/builder`);
    router.refresh();
  };

  return (
    <div className="container-wide py-8 space-y-8">
      
      {/* Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title text-3xl md:text-4xl font-black font-display text-slate-900">Activity & Experience Finder</h1>
          <p className="page-sub text-slate-500 text-sm mt-1">{all.length} curated experiences — sightseeing, food, culture, outdoors & adventure.</p>
        </div>
      </div>

      {/* Glassmorphic Filter Hero Card */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-950 text-white shadow-2xl border border-teal-500/30 space-y-6">
        
        <div className="flex items-center justify-between border-b border-teal-800/40 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider">
            <i className="bi bi-funnel-fill text-amber-400"></i> Smart Filter Engine
          </div>
          {(city || q || type || maxCost || maxDur) && (
            <button
              onClick={() => { setCity(''); setQ(''); setType(''); setMaxCost(''); setMaxDur(''); }}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <i className="bi bi-x-circle-fill"></i> Reset Filters
            </button>
          )}
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">City Destination</label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="">All Cities ({cities.length})</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Search Query</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search museum, tour, food..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Max Budget ($)</label>
            <select
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="">Any Budget</option>
              <option value="15">Under $15 (Free / Low Cost)</option>
              <option value="30">Under $30</option>
              <option value="60">Under $60</option>
              <option value="100">Under $100</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Max Duration (Hours)</label>
            <select
              value={maxDur}
              onChange={(e) => setMaxDur(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="">Any Duration</option>
              <option value="2">Up to 2 Hours</option>
              <option value="4">Up to 4 Hours</option>
              <option value="8">Full Day (8h)</option>
            </select>
          </div>

        </div>

        {/* Category Pills Bar */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">Category Types</label>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setType('')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                type === ''
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              ✨ All Types
            </button>

            {TYPES.map((t) => {
              const tm = TYPE_META[t];
              const selected = type === t;
              return (
                <button
                  key={t}
                  onClick={() => setType(selected ? '' : t)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                    selected
                      ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30 scale-105'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <span>{tm.emoji}</span>
                  <span>{tm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Showing Counter */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
        <span>Showing {list.length} experiences</span>
        {list.length > 0 && <span className="text-teal-700 font-mono">LIVE MATCHES</span>}
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((a, i) => {
          const tm = typeMeta(a.type);
          return (
            <Reveal key={a.id} delay={(i % 2) * 70}>
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-2xl hover:border-teal-400 transition-all duration-300 flex flex-col justify-between h-full space-y-4 group">
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-amber-50 border border-slate-100 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0">
                        {a.emoji}
                      </div>

                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900 font-display group-hover:text-teal-700 transition-colors">
                          {a.name}
                        </h3>
                        <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
                          <i className="bi bi-geo-alt-fill text-amber-500"></i>
                          <span>{a.city.emoji} {a.city.name}, {a.city.country}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-teal-50 text-teal-800 font-bold text-[11px] rounded-full border border-teal-200 shrink-0">
                      {tm.label}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed font-normal min-h-[40px]">
                    {a.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1">
                      ⏱ {a.duration}h
                    </span>
                    <span className="px-3 py-1.5 bg-amber-50 text-amber-800 font-extrabold text-xs rounded-xl border border-amber-200">
                      {fmtMoney(a.cost)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
                      onClick={() => setQuick(a)}
                    >
                      Quick View
                    </button>
                    
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all hover:scale-105 flex items-center gap-1.5"
                      onClick={() => openAdd(a)}
                    >
                      <i className="bi bi-plus-circle-fill"></i>
                      <span>Add to Trip</span>
                    </button>
                  </div>
                </div>

              </div>
            </Reveal>
          );
        })}
      </div>

      {list.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="text-5xl">🔭</div>
          <h3 className="text-xl font-bold text-slate-900 font-display">No experiences match your filter</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">Try clearing search terms, selecting another city, or adjusting the budget slider.</p>
        </div>
      )}

      {quick && (
        <Modal title={quick.name} onClose={() => setQuick(null)}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-3xl border border-teal-200 shadow-sm shrink-0">
              {quick.emoji}
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">{quick.city.emoji} {quick.city.name}, {quick.city.country}</div>
              <div className="flex gap-2 mt-1">
                <span className="badge badge-teal">{typeMeta(quick.type).label}</span>
                <span className="badge badge-blue">⏱ {quick.duration}h</span>
                <span className="badge badge-amber">{fmtMoney(quick.cost)}</span>
              </div>
            </div>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">{quick.description}</p>
          <div className="mt-6 flex justify-end">
            <button className="btn btn-primary" onClick={() => { openAdd(quick); setQuick(null); }}>
              ＋ Add to Trip
            </button>
          </div>
        </Modal>
      )}

      {addFor && (
        <Modal title={`Add “${addFor.name}”`} onClose={() => setAddFor(null)}>
          <p className="text-slate-600 text-xs mb-4">
            This activity will be attached to a stop in <b>{addFor.city.name}</b>. If your trip has no {addFor.city.name} stop yet, we’ll add one for you automatically.
          </p>
          <div className="field">
            <label className="label">Select Target Trip</label>
            <select className="select bg-white" value={selTrip} onChange={(e) => setSelTrip(e.target.value)}>
              <option value="">Select a trip…</option>
              {(trips ?? []).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {trips && trips.length === 0 && <p className="form-hint">You have no trips yet — create one from the dashboard.</p>}
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <button className="btn btn-ghost" onClick={() => setAddFor(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitAdd} disabled={busy || !selTrip}>
              {busy ? 'Adding…' : 'Confirm Add'}
            </button>
          </div>
        </Modal>
      )}

      <Toast message={toast} />
    </div>
  );
}
