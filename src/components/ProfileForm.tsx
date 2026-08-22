'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Toast, useToast } from './ui';

export default function ProfileForm({
  initial,
  languages,
}: {
  initial: { name: string; email: string; photo: string | null; language: string; savedIds: string[] };
  languages: [string, string][];
}) {
  const router = useRouter();
  const [toast, showToast] = useToast();
  const [name, setName] = useState(initial.name);
  const [photo, setPhoto] = useState(initial.photo || '');
  const [email, setEmail] = useState(initial.email);
  const [language, setLanguage] = useState(initial.language);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(initial.savedIds));

  const save = async () => {
    setBusy(true);
    setError(null);
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, photo: photo || null, email, language, password: password || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || 'Could not save changes');
      return;
    }
    setPassword('');
    showToast('Profile updated');
    router.refresh();
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const removeSaved = async (id: string) => {
    await fetch(`/api/cities/${id}/save`, { method: 'POST' });
    setSavedIds((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
    router.refresh();
  };

  const delAccount = async () => {
    if (!confirm('Delete your account? This removes all your trips, stops and activities. This cannot be undone.')) return;
    if (!confirm('Are you absolutely sure?')) return;
    await fetch('/api/profile', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className="card card-pad">
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>Edit profile</h3>
        <div className="field">
          <label className="label">Full name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Photo URL <span className="faint">(optional — or leave the initials avatar)</span></label>
          <input className="input" value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://…" />
        </div>
        <div className="field">
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Language preference</label>
          <select className="select" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label">New password <span className="faint">(leave blank to keep current)</span></label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <p className="err mb-16">{error}</p>}
        <div className="flex gap-8">
          <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
          <button className="btn btn-ghost" onClick={logout}>Log out</button>
        </div>
      </div>

      <div className="card card-pad" style={{ border: '1px solid #fecaca' }}>
        <h3 style={{ fontSize: 15, marginBottom: 10, color: 'var(--danger)' }}>Danger zone</h3>
        <p className="muted" style={{ fontSize: 13.5, marginBottom: 12 }}>
          Deleting your account removes everything you’ve planned.
        </p>
        <button className="btn btn-danger" onClick={delAccount}>Delete account</button>
      </div>

      <Toast message={toast} />
    </div>
  );
}
