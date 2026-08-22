'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from './ui';

export function DeleteTripInner({ id, name, onDeleted }: { id: string; name: string; onDeleted?: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [toast, showToast] = useToast();

  const del = async () => {
    if (!confirm(`Delete trip “${name}”? This removes all its stops and activities.`)) return;
    setBusy(true);
    await fetch(`/api/trips/${id}`, { method: 'DELETE' });
    showToast('Trip deleted');
    onDeleted?.();
    router.refresh();
  };

  return (
    <button className="btn btn-danger btn-sm" onClick={del} disabled={busy}>
      {busy ? '…' : 'Delete'}
    </button>
  );
}
