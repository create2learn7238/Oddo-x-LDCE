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

  const save = async () => {
    setBusy(true);
    setError(null);
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, photo: photo.trim() || null, email, language, password: password || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || 'Could not save changes');
      return;
    }
    setPassword('');
    showToast('Profile updated successfully');
    router.refresh();
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
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
    <div className="space-y-6">
      {/* Edit Form Card */}
      <div className="card p-8 bg-white rounded-3xl border border-slate-200 shadow-md space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 font-display pb-4 border-b border-slate-100 flex items-center gap-2">
          <i className="bi bi-person-gear text-teal-600"></i> Account Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="field">
            <label className="label">Full Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aarav Sharma" />
          </div>

          <div className="field">
            <label className="label">Email Address</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label className="label">
            Custom Profile Image URL <span className="faint font-normal">(optional — leave blank for auto initials avatar)</span>
          </label>
          <input
            className="input"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="field">
            <label className="label">Language Preference</label>
            <select className="select bg-white" value={language} onChange={(e) => setLanguage(e.target.value)}>
              {languages.map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">
              New Password <span className="faint font-normal">(leave blank to keep current)</span>
            </label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
        </div>

        {error && <p className="err">{error}</p>}

        <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
          <button className="btn btn-primary btn-lg" onClick={save} disabled={busy}>
            <i className="bi bi-check-circle-fill"></i>
            <span>{busy ? 'Saving...' : 'Save Changes'}</span>
          </button>

          <button className="btn btn-ghost" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="card p-6 bg-red-50/50 rounded-3xl border border-red-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-red-700 flex items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill"></i> Danger Zone
        </h3>
        <p className="text-slate-600 text-xs leading-relaxed">
          Deleting your account permanently removes all your planned trips, activities, and saved preferences.
        </p>
        <button className="btn btn-danger text-xs font-bold" onClick={delAccount}>
          Delete Account Permanently
        </button>
      </div>

      <Toast message={toast} />
    </div>
  );
}
