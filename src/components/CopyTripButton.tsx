'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from './ui';

export function CopyTripButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [toast, showToast] = useToast();

  const copy = async () => {
    setBusy(true);
    const res = await fetch(`/api/trips/${id}/copy`, { method: 'POST' });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      showToast(data.error || 'Could not copy trip');
      return;
    }
    showToast('Trip copied to your trips');
    router.push(`/trips/${data.id}`);
    router.refresh();
  };

  return (
    <button className="btn" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }} onClick={copy} disabled={busy}>
      {busy ? 'Copying…' : '📋 Copy trip'}
    </button>
  );
}
