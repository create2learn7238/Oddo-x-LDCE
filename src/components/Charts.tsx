'use client';

import { useEffect, useState } from 'react';
import type { TripCosts } from '@/lib/estimates';
import { CATEGORY_META } from '@/lib/estimates';
import { fmtMoney } from '@/lib/dates';

function useMounted(delay = 80) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return on;
}

export function DonutChart({ costs }: { costs: TripCosts }) {
  const on = useMounted(150);
  const size = 190;
  const r = 68;
  const cx = size / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  const segs = CATEGORY_META.map((m) => {
    const v = costs.totals[m.key];
    const frac = costs.totals.total ? v / costs.totals.total : 0;
    const seg = { ...m, frac, offset: acc };
    acc += frac;
    return seg;
  }).filter((s) => s.frac > 0.004);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Cost breakdown by category" style={{ overflow: 'visible' }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#eef1f5" strokeWidth={26} />
      {segs.map((s) => (
        <circle
          key={s.key}
          className="donut-seg"
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={26}
          strokeDasharray={`${on ? s.frac * c : 0} ${c}`}
          strokeDashoffset={-s.offset * c}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      ))}
      <text x={cx} y={cx - 4} textAnchor="middle" style={{ font: '800 19px Inter, sans-serif', fill: 'var(--ink)' }}>
        {fmtMoney(costs.totals.total)}
      </text>
      <text x={cx} y={cx + 16} textAnchor="middle" style={{ font: '600 11px Inter, sans-serif', fill: 'var(--ink-3)' }}>
        estimated total
      </text>
    </svg>
  );
}

export function DayBars({ costs }: { costs: TripCosts }) {
  const on = useMounted(200);
  const W = 520;
  const H = 170;
  const pad = 8;
  const max = Math.max(...costs.days.map((d) => d.costs.total), 1);
  const bw = (W - pad * 2) / costs.days.length;
  const targetY = costs.dailyTarget ? H - (costs.dailyTarget / max) * (H - 24) : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }} role="img" aria-label="Daily spend bar chart">
      {targetY !== null && (
        <line x1={pad} x2={W - pad} y1={targetY} y2={targetY} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="5 4" opacity={on ? 1 : 0} style={{ transition: 'opacity 0.8s ease 0.9s' }} />
      )}
      {costs.days.map((d, i) => {
        const h = (d.costs.total / max) * (H - 24);
        const x = pad + i * bw;
        const color = d.overBudget ? '#dc2626' : d.stop?.city.color ?? '#0f766e';
        return (
          <g key={d.key} className="bar-grow" style={{ animationDelay: `${i * 45}ms` }}>
            <rect
              x={x + bw * 0.12}
              y={on ? H - 14 - h : H - 14}
              width={bw * 0.76}
              height={on ? h : 0}
              rx={4}
              fill={color}
              opacity={0.9}
              style={{ transition: 'y 0.8s cubic-bezier(0.22,1,0.36,1), height 0.8s cubic-bezier(0.22,1,0.36,1)', transitionDelay: `${i * 45}ms` }}
            >
              <title>{`Day ${d.dayNum + 1}: ${fmtMoney(d.costs.total)}${d.stop ? ` in ${d.stop.city.name}` : ''}`}</title>
            </rect>
            {costs.days.length <= 16 && (
              <text x={x + bw / 2} y={H - 2} textAnchor="middle" style={{ font: '700 9.5px Inter, sans-serif', fill: 'var(--ink-3)' }}>
                {d.dayNum + 1}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
