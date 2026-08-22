'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function AdminUserActions({ user, isSelf }: { user: { id: string; name: string; isAdmin: boolean }; isSelf: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (isSelf) return <span className="faint">you</span>;

  const remove = async () => {
    if (!confirm(`Remove ${user.name} and all their trips?`)) return;
    setBusy(true);
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  };

  return (
    <button className="btn btn-danger btn-sm" onClick={remove} disabled={busy} style={user.isAdmin ? { opacity: 0.5, cursor: 'not-allowed' } : undefined} title={user.isAdmin ? 'Cannot remove another admin in demo mode' : 'Remove user'}>
      {busy ? '…' : 'Remove'}
    </button>
  );
}
