'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { Toast, useToast } from './ui';

const DEMO_ACCOUNTS = [
  {
    id: 'aarav',
    name: 'Aarav Sharma',
    role: 'Gujarat Explorer',
    badge: '3 Trips',
    emoji: '🦁',
    email: 'demo@globetrotter.app',
    password: 'demo123',
    color: 'from-teal-600 to-emerald-700',
    border: 'hover:border-teal-500 hover:bg-teal-50/40',
  },
  {
    id: 'priya',
    name: 'Priya Patel',
    role: 'Solo Backpacker',
    badge: '2 Trips',
    emoji: '🎒',
    email: 'priya@globetrotter.app',
    password: 'demo123',
    color: 'from-amber-600 to-orange-700',
    border: 'hover:border-amber-500 hover:bg-amber-50/40',
  },
  {
    id: 'admin',
    name: 'Globe Admin',
    role: 'Administrator',
    badge: 'Admin Access',
    emoji: '👑',
    email: 'admin@globetrotter.app',
    password: 'admin123',
    color: 'from-indigo-600 to-purple-700',
    border: 'hover:border-indigo-500 hover:bg-indigo-50/40',
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
    <div className="space-y-5">
      
      {/* 1-Click Demo Logins Section (Displayed Prominently on Login) */}
      {mode === 'login' && (
        <div className="space-y-2.5 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <i className="bi bi-lightning-charge-fill text-amber-500 text-sm"></i>
              <span>Instant 1-Click Demo Logins</span>
            </span>
            <span className="text-[10px] text-teal-700 font-bold px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200">
              Pre-loaded Data
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handle1ClickLogin(acc.email, acc.password, acc.name)}
                disabled={busy}
                className={`p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left group ${acc.border}`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${acc.color} text-white flex items-center justify-center text-base shadow-sm group-hover:scale-110 transition-transform`}>
                    {acc.emoji}
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {acc.badge}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-black text-slate-900 leading-tight group-hover:text-teal-700 transition-colors">
                    {acc.name.split(' ')[0]}
                  </div>
                  <div className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                    {acc.role}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="relative flex items-center justify-center my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative px-3 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Or with credentials
            </span>
          </div>
        </div>
      )}

      {/* Main Form Fields */}
      <form ref={formRef} onSubmit={submit} className="space-y-3.5">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Name</label>
            <input
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              name="name"
              placeholder="Aarav Sharma"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
          <input
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        {mode !== 'forgot' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Password</label>
            <input
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              name="password"
              type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              minLength={mode === 'signup' ? 6 : undefined}
              required
            />
          </div>
        )}

        {error && (
          <p className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-1.5">
            <i className="bi bi-exclamation-circle-fill"></i> {error}
          </p>
        )}
        
        {info && (
          <p className="p-2.5 rounded-xl bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200 flex items-center gap-1.5">
            <i className="bi bi-check-circle-fill"></i> {info}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
          disabled={busy}
        >
          {busy ? (
            <span>Please wait…</span>
          ) : mode === 'login' ? (
            <>
              <i className="bi bi-box-arrow-in-right text-sm"></i>
              <span>Log In</span>
            </>
          ) : mode === 'signup' ? (
            <>
              <i className="bi bi-person-plus-fill text-sm"></i>
              <span>Create Free Account</span>
            </>
          ) : (
            <span>Send Reset Link</span>
          )}
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
