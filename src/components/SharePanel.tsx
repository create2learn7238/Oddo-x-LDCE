'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Modal, useToast } from './ui';

export function SharePanel({ trip }: { trip: { id: string; name: string; isPublic: boolean; shareToken: string | null } }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, showToast] = useToast();
  const [state, setState] = useState({ isPublic: trip.isPublic, shareToken: trip.shareToken });

  // Absolute URL is resolved client-side only, so SSR HTML and hydration always match.
  const [shareUrl, setShareUrl] = useState('');
  useEffect(() => {
    if (state.shareToken && typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/share/${state.shareToken}`);
    } else {
      setShareUrl('');
    }
  }, [state.shareToken]);

  const setPublic = async (isPublic: boolean) => {
    setBusy(true);
    const res = await fetch(`/api/trips/${trip.id}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      showToast(data.error || 'Could not update sharing');
      return;
    }
    setState({ isPublic: data.isPublic, shareToken: data.shareToken });
    router.refresh();
    showToast(isPublic ? 'Trip is now public' : 'Trip is private again');
  };

  const rotate = async () => {
    setBusy(true);
    const res = await fetch(`/api/trips/${trip.id}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newToken: true }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      showToast(data.error || 'Could not update link');
      return;
    }
    setState({ isPublic: data.isPublic, shareToken: data.shareToken });
    showToast('New link generated');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard');
    } catch {
      showToast(shareUrl);
    }
  };

  const share = async () => {
    const text = `Check out my trip “${trip.name}” on GlobeTrotter!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: trip.name, text, url: shareUrl });
      } catch {
        /* cancelled */
      }
    } else {
      copyLink();
    }
  };

  return (
    <>
      <button className="btn" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }} onClick={() => setOpen(true)}>
        🔗 Share
      </button>
      {open && (
        <Modal title="Share this trip" onClose={() => setOpen(false)}>
          <p className="muted mb-16" style={{ fontSize: 14 }}>
            Anyone with the link can view a read-only version of “{trip.name}” — and copy it into their own trips.
          </p>

          <div className="flex items-center justify-between card-pad" style={{ border: '1px solid var(--line)', borderRadius: 12, marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>Public access</div>
              <div className="faint">{state.isPublic ? 'Anyone with the link can view' : 'Only you can view'}</div>
            </div>
            <button
              onClick={() => setPublic(!state.isPublic)}
              disabled={busy}
              aria-label="Toggle public"
              style={{
                width: 50, height: 28, borderRadius: 999, border: 'none', position: 'relative',
                background: state.isPublic ? 'var(--primary)' : '#cbd5e1', transition: 'background 0.2s',
              }}
            >
              <span
                style={{
                  position: 'absolute', top: 3, left: state.isPublic ? 25 : 3, width: 22, height: 22,
                  borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </button>
          </div>

          {state.isPublic && state.shareToken && (
            <>
              <div className="field">
                <label className="label">Public link</label>
                <div className="flex gap-8">
                  <input className="input" readOnly value={shareUrl || `…/share/${state.shareToken}`} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
                  <button className="btn btn-ghost" onClick={copyLink}>Copy</button>
                </div>
              </div>
              <div className="flex gap-8 wrap">
                <button className="btn btn-primary" onClick={share}>📤 Share…</button>
                <button className="btn btn-ghost" onClick={rotate} disabled={busy}>🔄 New link</button>
              </div>
            </>
          )}
          <Toast message={toast} />
        </Modal>
      )}
    </>
  );
}

import { Toast } from './ui';
