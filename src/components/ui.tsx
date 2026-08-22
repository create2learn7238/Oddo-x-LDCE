'use client';

import React, { useEffect } from 'react';
import { cityPhoto } from '@/lib/photos';
import { CityPhoto } from './Anim';

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={wide ? { maxWidth: 720 } : undefined}>
        <div className="flex items-center justify-between mb-16">
          <h3 style={{ fontSize: 18 }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}

export function useToast(): [string | null, (m: string) => void] {
  const [msg, setMsg] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (m: string) => {
    setMsg(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 2600);
  };
  return [msg, show];
}

export function CostDots({ level, max = 5, light = false }: { level: number; max?: number; light?: boolean }) {
  return (
    <span className="cost-dots" title={`Cost index ${level}/${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <i key={i} className={i < level ? 'on' : ''} style={light ? undefined : { background: i < level ? 'var(--primary)' : 'var(--line)' }} />
      ))}
    </span>
  );
}

export function Badge({ children, tone = 'gray', className }: { children: React.ReactNode; tone?: 'gray' | 'teal' | 'amber' | 'red' | 'blue'; className?: string }) {
  const cls = { gray: 'badge', teal: 'badge badge-teal', amber: 'badge badge-amber', red: 'badge badge-red', blue: 'badge badge-blue' }[tone];
  return <span className={`${cls}${className ? ` ${className}` : ''}`}>{children}</span>;
}

export function Empty({ emoji, title, sub, action }: { emoji: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="empty">
      <div className="big">{emoji}</div>
      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{title}</div>
      {sub && <p className="muted mt-8" style={{ fontSize: 14 }}>{sub}</p>}
      {action && <div className="mt-16" style={{ display: 'flex', justifyContent: 'center' }}>{action}</div>}
    </div>
  );
}

export function CityThumb({ name, color, emoji, size = 44 }: { name: string; color: string; emoji?: string; size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        display: 'grid', placeItems: 'center', fontSize: size * 0.45,
      }}
      title={name}
    >
      {emoji || name[0]}
    </div>
  );
}

/** City thumbnail that prefers a real photo, falling back to the color/emoji tile. */
export function CityThumbX({ city, size = 44 }: { city: { name: string; color: string; emoji?: string }; size?: number }) {
  const photo = cityPhoto(city.name);
  return (
    <div
      className="city-thumb-photo"
      style={{
        width: size, height: size, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(135deg, ${city.color}, ${city.color}cc)`,
        display: 'grid', placeItems: 'center', fontSize: size * 0.45, overflow: 'hidden',
      }}
      title={city.name}
    >
      {photo ? <CityPhoto src={photo} alt={city.name} sizes={`${size}px`} /> : city.emoji || city.name[0]}
    </div>
  );
}

export const TYPE_META: Record<string, { label: string; emoji: string; color: string }> = {
  sightseeing: { label: 'Sightseeing', emoji: '📸', color: '#6366f1' },
  food: { label: 'Food & Drink', emoji: '🍜', color: '#f59e0b' },
  culture: { label: 'Culture', emoji: '🏛️', color: '#a855f7' },
  adventure: { label: 'Adventure', emoji: '🧗', color: '#ef4444' },
  shopping: { label: 'Shopping', emoji: '🛍️', color: '#ec4899' },
  nightlife: { label: 'Nightlife', emoji: '🌙', color: '#3b82f6' },
  outdoors: { label: 'Outdoors', emoji: '🌿', color: '#14b8a6' },
};

export function typeMeta(t: string) {
  return TYPE_META[t] ?? { label: t, emoji: '✨', color: '#64748b' };
}
