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
    <div className="container">
      <div className="page-head">
        <div>
          <h1 className="page-title">City search</h1>
          <p className="page-sub">{cities.length} destinations across {countries.length} countries — find your next stop.</p>
        </div>
        {trip && (
          <span className="badge badge-teal" style={{ padding: '8px 14px', fontSize: 13 }}>
            Adding to: {trip.name}
          </span>
        )}
      </div>

      <div className="card card-pad mb-16" style={{ marginBottom: 18 }}>
        <div className="row2" style={{ marginBottom: 12 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">Search</label>
            <input className="input" placeholder="Search city, country or region…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="row2">
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Region</label>
              <select className="select" value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="">All regions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Country</label>
              <select className="select" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">All countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-8 wrap">
          {regions.map((r) => (
            <button key={r} className={`chip ${region === r ? 'active' : ''}`} onClick={() => setRegion(region === r ? '' : r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <p className="faint mb-16">{list.length} cities shown</p>

      <div className="grid grid-3">
        {list.map((c, i) => {
          const photo = cityPhoto(c.name);
          const isSaved = saved.has(c.id);
          return (
            <Reveal key={c.id} delay={(i % 3) * 80}>
              <div className="card card-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="city-tile" style={{ minHeight: 160, borderRadius: 0, boxShadow: 'none', ['--c1' as string]: c.color, ['--c2' as string]: `${c.color}aa` }}>
                  {photo && <CityPhoto src={photo} alt={c.name} sizes="320px" />}
                  <div className="scrim" />
                  <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 3 }}>
                    <button
                      onClick={() => toggleSave(c)}
                      title={isSaved ? 'Remove from saved' : 'Save city'}
                      className="icon-btn"
                      style={{
                        background: isSaved ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        animation: isSaved ? 'popIn 0.45s cubic-bezier(0.22,1,0.36,1) both' : undefined,
                      }}
                    >
                      {isSaved ? '⭐' : '☆'}
                    </button>
                  </div>
                  <div className="tile-body">
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{c.emoji}</div>
                    <div className="name">{c.name}</div>
                    <div className="country">{c.country} · {c.region}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <CostDots level={c.costIndex} light />
                      <span style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.95 }}>★ {c.popularity}</span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p className="muted" style={{ fontSize: 13, minHeight: 40 }}>{c.description}</p>
                  <div className="flex gap-8" style={{ marginTop: 'auto' }}>
                    <button className="btn btn-primary btn-sm grow" onClick={() => openAdd(c)}>＋ Add to trip</button>
                    <Link href={`/activities?cityId=${c.id}`} className="btn btn-ghost btn-sm">
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
        <div className="card">
          <div className="empty">
            <div className="big">🔭</div>
            <div style={{ fontWeight: 700, color: 'var(--ink)' }}>No cities match</div>
            <p className="muted mt-8">Try a different search or clear the filters.</p>
          </div>
        </div>
      )}

      {addFor && (
        <Modal title={`Add ${addFor.name} to a trip`} onClose={() => setAddFor(null)}>
          <div className="field">
            <label className="label">Trip</label>
            {trip ? (
              <div className="badge badge-teal" style={{ padding: '8px 12px', fontSize: 13.5 }}>{trip.name}</div>
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
              <label className="label">Arrival</label>
              <input className="input" type="date" value={arrDate} onChange={(e) => setArrDate(e.target.value)} required />
            </div>
            <div className="field">
              <label className="label">Departure</label>
              <input className="input" type="date" value={depDate} onChange={(e) => setDepDate(e.target.value)} required />
            </div>
          </div>
          <div className="flex gap-8" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setAddFor(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitAdd} disabled={busy || !trip}>
              {busy ? 'Adding…' : 'Add stop'}
            </button>
          </div>
        </Modal>
      )}

      <Toast message={toast} />
    </div>
  );
}
