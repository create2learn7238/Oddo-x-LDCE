'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Toast, useToast } from './ui';

const EMOJIS = ['🧳', '🌍', '🏔️', '🏖️', '🏙️', '', '🎡', '⛰️', '️', '🕌', '🗼', '🚂'];
const COLORS = ['#0f766e', '#f59e0b', '#6366f1', '#ef4444', '#0ea5e9', '#a855f7', '#14b8a6', '#f43f5e'];

export default function TripForm({
  initial,
  endpoint = '/api/trips',
  submitLabel = 'Create trip',
  afterId,
}: {
  initial?: { name: string; description?: string | null; startDate: string; endDate: string; coverEmoji?: string; coverColor?: string; coverImage?: string | null; budgetTotal?: number | null };
  endpoint?: string;
  submitLabel?: string;
  afterId?: (id: string) => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, showToast] = useToast();
  const today = new Date().toISOString().slice(0, 10);
  const weekAhead = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const p = Object.fromEntries(fd.entries()) as Record<string, string>;
    try {
      const res = await fetch(endpoint, {
        method: initial ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, budgetTotal: p.budgetTotal ? Number(p.budgetTotal) : null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }
      if (initial) {
        showToast('Trip updated');
        afterId?.(data.id);
      } else {
        showToast('Trip created — add your first stop!');
        afterId?.(data.id);
      }
    } catch {
      setError('Network error — please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="field">
        <label className="label">Trip name</label>
        <input className="input" name="name" defaultValue={initial?.name || ''} placeholder="e.g. India Explorer: North & Coast" required />
      </div>
      <div className="row2">
        <div className="field">
          <label className="label">Start date</label>
          <input className="input" name="startDate" type="date" defaultValue={initial?.startDate || weekAhead.slice(0, 10)} min={today} required />
        </div>
        <div className="field">
          <label className="label">End date</label>
          <input className="input" name="endDate" type="date" defaultValue={initial?.endDate || weekAhead.slice(0, 10)} min={today} required />
        </div>
      </div>
      <div className="field">
        <label className="label">Description <span className="faint">(optional)</span></label>
        <textarea className="textarea" name="description" placeholder="What’s this trip about? Vibe, purpose, people…" defaultValue={initial?.description || ''} />
      </div>
      <div className="field">
        <label className="label">Cover emoji</label>
        <div className="flex gap-8 wrap">
          {EMOJIS.map((e) => (
            <label key={e} style={{ position: 'relative', cursor: 'pointer' }}>
              <input
                type="radio"
                name="coverEmoji"
                value={e}
                defaultChecked={(initial?.coverEmoji || '🧳') === e}
                style={{ position: 'absolute', opacity: 0 }}
              />
              <span
                style={{
                  display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 11, fontSize: 20,
                  background: (initial?.coverEmoji || '🧳') === e ? 'var(--primary-soft)' : '#f1f5f9',
                  outline: (initial?.coverEmoji || '🧳') === e ? '2px solid var(--primary)' : 'none',
                }}
              >
                {e}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="field">
        <label className="label">Cover color</label>
        <div className="flex gap-8 wrap">
          {COLORS.map((c) => (
            <label key={c} style={{ position: 'relative', cursor: 'pointer' }}>
              <input
                type="radio"
                name="coverColor"
                value={c}
                defaultChecked={(initial?.coverColor || '#0f766e') === c}
                style={{ position: 'absolute', opacity: 0 }}
              />
              <span
                style={{
                  display: 'block', width: 30, height: 30, borderRadius: 9, background: c,
                  outline: (initial?.coverColor || '#0f766e') === c ? '3px solid var(--ink)' : 'none', outlineOffset: 2,
                }}
              />
            </label>
          ))}
        </div>
      </div>
      <div className="field">
        <label className="label">Cover image URL <span className="faint">(optional — otherwise the emoji & color are used)</span></label>
        <input className="input" name="coverImage" placeholder="https://example.com/photo.jpg" defaultValue={initial?.coverImage ?? ''} />
      </div>
      <div className="field">
        <label className="label">Budget (₹ INR) <span className="faint">(optional — used for over-budget alerts)</span></label>
        <input className="input" name="budgetTotal" type="number" min={0} placeholder="e.g. 2400" defaultValue={initial?.budgetTotal ?? ''} />
      </div>

      {error && <p className="err mb-16">{error}</p>}
      <div className="flex gap-12">
        <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button>
        <button type="button" className="btn btn-ghost btn-lg" onClick={() => router.back()}>Cancel</button>
      </div>
      <Toast message={toast} />
    </form>
  );
}
