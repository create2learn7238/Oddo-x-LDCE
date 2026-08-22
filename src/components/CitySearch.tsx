'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import type { City } from '@prisma/client';
import { cityPhoto } from '@/lib/photos';
import { CostDots, Modal, Toast, useToast } from './ui';
import { CityPhoto, Reveal } from './Anim';

export default function CitySearch(props: CitySearchProps) {
  return (
    <Suspense>
      <CitySearchInner {...props} />
    </Suspense>
  );
}

type CitySearchProps = {
  cities: City[];
  regions: string[];
  savedIds: string[];
  initialQ: string;
  trip: { id: string; name: string } | null;
};

function CitySearchInner({ cities, regions, savedIds: initialSaved, initialQ, trip: initialTrip }: CitySearchProps) {
  const router = useRouter();
  const [toast, showToast] = useToast();
  const [q, setQ] = useState(initialQ);
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set(initialSaved));
  const [trip, setTrip] = useState(initialTrip);
  const [trips, setTrips] = useState<{ id: string; name: string }[] | null>(null);
  const [addFor, setAddFor] = useState<City | null>(null);
  const [selTripId, setSelTripId] = useState('');
  const [arrDate, setArrDate] = useState('');
  const [depDate, setDepDate] = useState('');
  const [busy, setBusy] = useState(false);

  const countries = useMemo(() => Array.from(new Set(cities.map((c) => c.country))).sort(), [cities]);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return cities.filter(
      (c) =>
        (!query || c.name.toLowerCase().includes(query) || c.country.toLowerCase().includes(query) || c.region.toLowerCase().includes(query)) &&
        (!region || c.region === region) &&
        (!country || c.country === country)
    );
  }, [cities, q, region, country]);

  const toggleSave = async (c: City) => {
    const res = await fetch(`/api/cities/${c.id}/save`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) return showToast(data.error || 'Could not update');
    setSaved((s) => {
      const n = new Set(s);
      if (data.saved) n.add(c.id);
      else n.delete(c.id);
      return n;
    });
    showToast(data.saved ? `Saved ${c.name} to your list` : `Removed ${c.name}`);
  };

  const openAdd = async (c: City) => {
    setAddFor(c);
    const week = new Date(Date.now() + 7 * 86400000);
    const two = new Date(Date.now() + 9 * 86400000);
    setArrDate(week.toISOString().slice(0, 10));
    setDepDate(two.toISOString().slice(0, 10));
    if (!trip && !trips) {
      const res = await fetch('/api/trips/mine');
      if (res.ok) {
        const data = await res.json();
        setTrips(data.trips.map((t: { id: string; name: string }) => ({ id: t.id, name: t.name })));
      }
    }
  };

  const submitAdd = async () => {
    if (!addFor) return;
    if (!trip) return showToast('Pick a trip first');
    setBusy(true);
    const res = await fetch('/api/stops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: trip.id, cityId: addFor.id, arrivalDate: arrDate, departureDate: depDate }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return showToast(data.error || 'Could not add stop');
    setAddFor(null);
    showToast(`${addFor.name} added to “${trip.name}”`);
    router.push(`/trips/${trip.id}/builder`);
    router.refresh();
  };

  return (
    <div className="container-wide">
      {/* Header Bar */}
      <div className="page-head">
        <div>
          <h1 className="page-title">City Discovery & Exploration</h1>
          <p className="page-sub">{cities.length} global & regional destinations across {countries.length} countries.</p>
        </div>
        {trip && (
          <span className="badge badge-teal" style={{ padding: '10px 18px', fontSize: 14 }}>
            Active Trip: {trip.name}
          </span>
        )}
      </div>

      {/* Filter Card */}
      <div className="card card-pad mb-16" style={{ padding: 24, marginBottom: 24, borderRadius: 20 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: 16 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">Search Destinations</label>
            <input className="input" placeholder="Search city, country or region…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">Filter Region</label>
            <select className="select" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">All Regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">Filter Country</label>
            <select className="select" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 wrap">
          {regions.map((r) => (
            <button key={r} className={`chip ${region === r ? 'active' : ''}`} onClick={() => setRegion(region === r ? '' : r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <p className="faint mb-16" style={{ fontWeight: 700, color: '#475569' }}>Showing {list.length} destinations</p>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {list.map((c, i) => {
          const photo = cityPhoto(c.name);
          const isSaved = saved.has(c.id);
          return (
            <Reveal key={c.id} delay={(i % 4) * 70}>
              <div className="card card-hover flex flex-col h-full overflow-hidden rounded-3xl border border-slate-200 shadow-md">
                
                {/* Photo Top Frame */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900 flex-shrink-0">
                  {photo ? (
                    <CityPhoto src={photo} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" sizes="380px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-teal-700 to-amber-700">
                      {c.emoji}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 border border-white/20">
                      <span>{c.emoji}</span> {c.country}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() => toggleSave(c)}
                      title={isSaved ? 'Remove from saved' : 'Save city'}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-all ${
                        isSaved ? 'bg-amber-400 text-slate-900 shadow-md scale-110' : 'bg-slate-900/60 text-white backdrop-blur-md hover:bg-white hover:text-slate-900'
                      }`}
                    >
                      {isSaved ? '★' : '☆'}
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-extrabold text-teal-300 uppercase tracking-wider">{c.region}</span>
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      ★ {c.popularity}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold text-slate-900 font-display">{c.name}</h3>
                      <CostDots level={c.costIndex} />
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 min-h-[48px]">
                      {c.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      className="flex-1 py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                      onClick={() => openAdd(c)}
                    >
                      <i className="bi bi-plus-circle-fill"></i>
                      <span>Add to Trip</span>
                    </button>

                    <Link
                      href={`/activities?cityId=${c.id}`}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center"
                    >
                      Explore
                    </Link>
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
            <div style={{ fontWeight: 800, color: 'var(--ink)', fontSize: 18 }}>No destinations match your search</div>
            <p className="muted mt-8">Try adjusting your keywords or clearing the region/country filters.</p>
          </div>
        </div>
      )}

      {/* Add Stop Modal */}
      {addFor && (
        <Modal title={`Add ${addFor.name} to a trip`} onClose={() => setAddFor(null)}>
          <div className="field">
            <label className="label">Select Destination Trip</label>
            {trip ? (
              <div className="badge badge-teal" style={{ padding: '10px 14px', fontSize: 14 }}>{trip.name}</div>
            ) : trips ? (
              <select
                className="select"
                value={selTripId}
                onChange={(e) => {
                  setSelTripId(e.target.value);
                  const t = (trips as { id: string; name: string }[]).find((x) => x.id === e.target.value);
                  setTrip(t ?? null);
                }}
              >
                <option value="">Select a trip…</option>
                {(trips as { id: string; name: string }[]).map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            ) : (
              <p className="faint">Loading your trips…</p>
            )}
          </div>
          <div className="row2">
            <div className="field">
              <label className="label">Arrival Date</label>
              <input className="input" type="date" value={arrDate} onChange={(e) => setArrDate(e.target.value)} required />
            </div>
            <div className="field">
              <label className="label">Departure Date</label>
              <input className="input" type="date" value={depDate} onChange={(e) => setDepDate(e.target.value)} required />
            </div>
          </div>
          <div className="flex gap-8" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn-ghost" onClick={() => setAddFor(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitAdd} disabled={busy || !trip}>
              {busy ? 'Adding…' : 'Confirm & Add Stop'}
            </button>
          </div>
        </Modal>
      )}

      <Toast message={toast} />
    </div>
  );
}
