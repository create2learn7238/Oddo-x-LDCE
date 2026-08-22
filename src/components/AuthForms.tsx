'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { Toast, useToast } from './ui';

const DEMO_EMAIL = 'demo@globetrotter.app';
const DEMO_PASSWORD = 'demo123';
const ADMIN_EMAIL = 'admin@globetrotter.app';
const ADMIN_PASSWORD = 'admin123';

function AuthFormInner({ mode }: { mode: 'login' | 'signup' | 'forgot' }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next');
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [toast, showToast] = useToast();

  /** Fill the form with a demo account and (optionally) submit it. */
  const fillDemo = (submitNow: boolean, account: 'demo' | 'admin') => {
    const f = formRef.current;
    if (!f) return;
    const email = f.querySelector<HTMLInputElement>('input[name="email"]');
    const pw = f.querySelector<HTMLInputElement>('input[name="password"]');
    const creds = account === 'demo' ? { e: DEMO_EMAIL, p: DEMO_PASSWORD } : { e: ADMIN_EMAIL, p: ADMIN_PASSWORD };
    if (email) email.value = creds.e;
    if (pw) pw.value = creds.p;
    setError(null);
    setInfo(null);
    if (submitNow) f.requestSubmit();
    else showToast(`Filled ${account} credentials — press Log in`);
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
        return;
      }
      if (mode === 'forgot') {
        setInfo(data.message);
        return;
      }
      showToast(mode === 'login' ? 'Welcome back!' : 'Account created — welcome aboard!');
      router.push(next && next.startsWith('/') ? next : '/dashboard');
      router.refresh();
    } catch {
      setError('Network error — please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={submit}>
      {mode === 'signup' && (
        <div className="field">
          <label className="label">Full name</label>
          <input className="input" name="name" placeholder="Aarav Sharma" required />
        </div>
      )}
      <div className="field">
        <label className="label">Email</label>
        <input className="input" name="email" type="email" placeholder="you@example.com" required />
      </div>
      {mode !== 'forgot' && (
        <div className="field">
          <label className="label">Password</label>
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

      {error && <p className="err mb-16">{error}</p>}
      {info && (
        <p className="mb-16" style={{ background: 'var(--primary-soft)', color: 'var(--primary)', padding: '10px 14px', borderRadius: 11, fontSize: 14, fontWeight: 600 }}>
          {info}
        </p>
      )}

      <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={busy}>
        {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
      </button>

      {mode === 'login' && (
        <>
          <button
            type="button"
            className="btn btn-ghost btn-lg"
            style={{ width: '100%', marginTop: 10 }}
            onClick={() => fillDemo(true, 'demo')}
            disabled={busy}
          >
            ✨ Use demo account (autofill & login)
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ width: '100%', marginTop: 8, fontSize: 13 }}
            onClick={() => fillDemo(false, 'admin')}
            disabled={busy}
            title="Fills the admin account — press Log in"
          >
            📊 Fill admin credentials
          </button>
          <div className="divider" />
          <div className="flex items-center justify-between" style={{ fontSize: 13.5 }}>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); router.push('/forgot'); }} style={{ fontWeight: 600, color: 'var(--ink-2)' }}>
              Forgot password?
            </a>
            <a href="/signup" style={{ fontWeight: 700, color: 'var(--primary)' }}>Create an account →</a>
          </div>
        </>
      )}
      {mode === 'signup' && (
        <p className="faint" style={{ textAlign: 'center', marginTop: 14 }}>
          Already planning trips? <a href="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>Log in</a>
        </p>
      )}
      {mode === 'forgot' && (
        <p className="faint" style={{ textAlign: 'center', marginTop: 14 }}>
          <a href="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>← Back to login</a>
        </p>
      )}
      <Toast message={toast} />
    </form>
  );
}

export default function AuthForms({ mode }: { mode: 'login' | 'signup' | 'forgot' }) {
  return (
    <Suspense>
      <AuthFormInner mode={mode} />
    </Suspense>
  );
}
