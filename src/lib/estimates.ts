import type { Activity, City, Stop, StopActivity, Trip } from '@prisma/client';
import { addDays, daysBetween } from './dates';

export type StopFull = Stop & {
  city: City;
  activities: (StopActivity & { activity: Activity })[];
};
export type TripFull = Trip & { stops: StopFull[] };

/** Per-person, per-day rates in INR by city cost index (1 = budget … 5 = luxury) */
export const STAY_RATES = [800, 1800, 3500, 7000, 15000];
export const MEALS_RATES = [350, 650, 1200, 2500, 5000];
export const LOCAL_RATES = [150, 300, 600, 1200, 2500];

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)));
}

export type Intercity = { mode: 'train' | 'flight'; km: number; cost: number };

export function intercityCost(from: City, to: City): Intercity {
  const km = haversineKm(from, to);
  if (km < 500) return { mode: 'train', km, cost: Math.round(500 + 2.5 * km) };
  if (km < 1500) return { mode: 'flight', km, cost: Math.round(2500 + 3.5 * km) };
  return { mode: 'flight', km, cost: Math.round(6000 + 6 * km) };
}

export type DayPlan = {
  key: string;
  date: Date;
  dayNum: number; // 0-based
  stop: StopFull | null;
  travel: (Intercity & { from: City; to: City }) | null;
  costs: { stay: number; meals: number; local: number; travel: number; activities: number; total: number };
  activities: (StopActivity & { activity: Activity })[];
  overBudget: boolean;
};

export type TripCosts = {
  days: DayPlan[];
  totalDays: number;
  totals: { stay: number; meals: number; local: number; travel: number; activities: number; total: number };
  avgPerDay: number;
  dailyTarget: number | null;
  overBudgetDays: number;
  budgetLeft: number | null;
};

export function computeTripCosts(trip: TripFull): TripCosts {
  const stops = [...trip.stops].sort((a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime());
  const totalDays = Math.max(1, daysBetween(trip.startDate, trip.endDate) + 1);
  const dailyTarget = trip.budgetTotal ? trip.budgetTotal / totalDays : null;

  const totals = { stay: 0, meals: 0, local: 0, travel: 0, activities: 0, total: 0 };
  const days: DayPlan[] = [];
  let overBudgetDays = 0;

  for (let i = 0; i < totalDays; i++) {
    const date = addDays(trip.startDate, i);
    const findStop = (d: Date) =>
      stops.find((s) => d.getTime() >= s.arrivalDate.getTime() && d.getTime() < s.departureDate.getTime()) ??
      stops[stops.length - 1] ?? null;
    const stop = findStop(date);
    const prevDate = i > 0 ? addDays(trip.startDate, i - 1) : null;
    const prevStop = prevDate ? findStop(prevDate) : null;

    const travel =
      stop && prevStop && prevStop.id !== stop.id ? { ...intercityCost(prevStop.city, stop.city), from: prevStop.city, to: stop.city } : null;

    const ci = stop ? stop.city.costIndex : 1;
    const stays = !!stop && date.getTime() < stop.departureDate.getTime();
    const dayActivities = stop ? stop.activities.filter((a) => date.getTime() === addDays(stop.arrivalDate, a.dayOffset).getTime()) : [];

    const costs = {
      stay: stays ? STAY_RATES[ci - 1] : 0,
      meals: MEALS_RATES[ci - 1],
      local: LOCAL_RATES[ci - 1],
      travel: travel?.cost ?? 0,
      activities: dayActivities.reduce((s, a) => s + a.cost, 0),
      total: 0,
    };
    costs.total = costs.stay + costs.meals + costs.local + costs.travel + costs.activities;
    const overBudget = !!dailyTarget && costs.total > dailyTarget * 1.25;
    if (overBudget) overBudgetDays++;

    for (const k of Object.keys(totals) as (keyof typeof totals)[]) totals[k] += costs[k];

    days.push({
      key: date.toISOString().slice(0, 10),
      date,
      dayNum: i,
      stop,
      travel,
      costs,
      activities: dayActivities,
      overBudget,
    });
  }

  return {
    days,
    totalDays,
    totals,
    avgPerDay: totals.total / totalDays,
    dailyTarget,
    overBudgetDays,
    budgetLeft: trip.budgetTotal ? trip.budgetTotal - totals.total : null,
  };
}

export const CATEGORY_META: { key: keyof TripCosts['totals']; label: string; color: string; emoji: string }[] = [
  { key: 'stay', label: 'Stay', color: '#6366f1', emoji: '🏨' },
  { key: 'meals', label: 'Meals', color: '#f59e0b', emoji: '🍜' },
  { key: 'local', label: 'Local transport', color: '#14b8a6', emoji: '🚕' },
  { key: 'travel', label: 'Inter-city travel', color: '#ef4444', emoji: '✈️' },
  { key: 'activities', label: 'Activities', color: '#a855f7', emoji: '🎯' },
];
