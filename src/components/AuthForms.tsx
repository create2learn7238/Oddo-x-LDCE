'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { Toast, useToast } from './ui';

const DEMO_ACCOUNTS = [
  {
    id: 'aarav',
    name: 'Aarav Sharma',
    role: 'Gujarat & Heritage Explorer',
    badge: '3 Trips Planned',
    emoji: '🦁',
    email: 'demo@globetrotter.app',
    password: 'demo123',
    color: 'from-teal-600 to-emerald-700',
    border: 'hover:border-teal-400',
  },
  {
    id: 'priya',
    name: 'Priya Patel',
    role: 'Solo Backpacker & Nature Nomad',
    badge: '2 Trips Planned',
    emoji: '🎒',
    email: 'priya@globetrotter.app',
    password: 'demo123',
    color: 'from-amber-600 to-orange-700',
    border: 'hover:border-amber-400',
  },
  {
    id: 'admin',
    name: 'Globe Admin',
    role: 'Platform Administrator',
    badge: 'Admin Access',
    emoji: '👑',
    email: 'admin@globetrotter.app',
    password: 'admin123',
    color: 'from-indigo-600 to-purple-700',
    border: 'hover:border-indigo-400',
  },
];

function AuthFormInner({ mode }: { mode: 'login' | 'signup' | 'forgot' }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next');
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [toast, showToast] = useToast();

  const handle1ClickLogin = async (emailVal: string, pwVal: string, userName: string) => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal, password: pwVal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
        setBusy(false);
        return;
      }
      showToast(`Welcome, ${userName}!`);
      router.push(next && next.startsWith('/') ? next : '/dashboard');
      router.refresh();
    } catch {
      setError('Network error — please try again.');
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setBusy(false);
        return;
      }
      if (mode === 'forgot') {
        setInfo(data.message);
        setBusy(false);
        return;
      }
      showToast(mode === 'login' ? 'Welcome back!' : 'Account created — welcome aboard!');
      router.push(next && next.startsWith('/') ? next : '/dashboard');
      router.refresh();
    } catch {
      setError('Network error — please try again.');
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <form ref={formRef} onSubmit={submit} className="space-y-4">
        {mode === 'signup' && (
          <div className="field">
            <label className="label text-xs font-bold uppercase tracking-wider text-slate-700">Full name</label>
            <input className="input" name="name" placeholder="Aarav Sharma" required />
          </div>
        )}
        <div className="field">
          <label className="label text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
          <input className="input" name="email" type="email" placeholder="you@example.com" required />
        </div>
        {mode !== 'forgot' && (
          <div className="field">
            <label className="label text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
            <input
              className="input"
              name="password"
              type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              minLength={mode === 'signup' ? 6 : undefined}
              required
            />
          </div>
        )}

        {error && <p className="err mb-4">{error}</p>}
        {info && (
          <p className="mb-4 p-3 rounded-2xl bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
            {info}
          </p>
        )}

        <button className="btn btn-primary btn-lg w-full" disabled={busy}>
          {busy ? 'Logging in…' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
        </button>

        <div className="flex items-center justify-between text-xs pt-1">
          {mode === 'login' ? (
            <>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); router.push('/forgot'); }}
                className="text-slate-500 hover:text-slate-800 font-semibold"
              >
                Forgot password?
              </a>
              <a href="/signup" className="font-bold text-teal-700 hover:underline">
                Create an account →
              </a>
            </>
          ) : mode === 'signup' ? (
            <p className="text-slate-500 text-xs w-full text-center">
              Already have an account? <a href="/login" className="font-bold text-teal-700 hover:underline">Log in</a>
            </p>
          ) : (
            <p className="text-slate-500 text-xs w-full text-center">
              <a href="/login" className="font-bold text-teal-700 hover:underline">← Back to login</a>
            </p>
          )}
        </div>
      </form>

      {/* 3 Dedicated 1-Click Demo Login Options */}
      {mode === 'login' && (
        <div className="pt-5 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <i className="bi bi-lightning-charge-fill text-amber-500"></i> Instant 1-Click Demo Logins
            </span>
            <span className="text-[11px] text-teal-700 font-bold">Loaded with Data</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handle1ClickLogin(acc.email, acc.password, acc.name)}
                disabled={busy}
                className={`w-full p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between text-left group ${acc.border}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${acc.color} text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform`}>
                    {acc.emoji}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 font-display flex items-center gap-1.5">
                      <span>{acc.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {acc.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">{acc.role}</div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-teal-50 group-hover:text-teal-700 text-slate-400 flex items-center justify-center text-xs transition-colors">
                  <i className="bi bi-arrow-right font-bold"></i>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}

export default function AuthForms({ mode }: { mode: 'login' | 'signup' | 'forgot' }) {
  return (
    <Suspense>
      <AuthFormInner mode={mode} />
    </Suspense>
  );
}
