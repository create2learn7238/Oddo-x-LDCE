'use client';

import { useState } from 'react';
import { useToast } from './ui';

export function ShareCopy({ token, name }: { token: string; name: string }) {
  const [toast, showToast] = useToast();
  const url = typeof window !== 'undefined' ? `${window.location.origin}/share/${token}` : `/share/${token}`;

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: name, text: `Check out my trip “${name}” on GlobeTrotter!`, url });
      } catch {
        /* cancelled */
      }
    } else {
      copy();
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied!');
    } catch {
      showToast(url);
    }
  };

  return (
    <>
      <button className="btn" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }} onClick={share}>
        📤 Share
      </button>
      <button className="btn" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }} onClick={copy}>
        🔗 Copy link
      </button>
      <span>{toast && <ToastMsg m={toast} />}</span>
    </>
  );
}

function ToastMsg({ m }: { m: string }) {
  return <span className="toast">{m}</span>;
}
