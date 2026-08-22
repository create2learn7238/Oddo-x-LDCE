'use client';

import React, { useState } from 'react';

const DESTINATIONS = [
  { id: 'gujarat', name: 'Gujarat Heritage Express 🦁', dailyBase: 3500, cities: ['Ahmedabad', 'Statue of Unity', 'Rann of Kutch'] },
  { id: 'rajasthan', name: 'Rajasthan Royal Circuit 🏰', dailyBase: 4500, cities: ['Jaipur', 'Udaipur', 'Jaisalmer'] },
  { id: 'southindia', name: 'South India Coastal & Backwaters 🌴', dailyBase: 4000, cities: ['Goa', 'Kochi', 'Munnar'] },
  { id: 'europe', name: 'Europe Grand Tour 🇪🇺', dailyBase: 12000, cities: ['Paris', 'Rome', 'Amsterdam', 'Barcelona'] },
];

export function TravelSimulator() {
  const [travelers, setTravelers] = useState<number>(2);
  const [days, setDays] = useState<number>(7);
  const [destId, setDestId] = useState<string>('gujarat');
  const [tier, setTier] = useState<'budget' | 'comfort' | 'luxury'>('comfort');
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'packed'>('balanced');

  const dest = DESTINATIONS.find((d) => d.id === destId) || DESTINATIONS[0];
  const tierMultiplier = tier === 'budget' ? 0.6 : tier === 'comfort' ? 1.0 : 2.2;
  const paceMultiplier = pace === 'relaxed' ? 0.8 : pace === 'balanced' ? 1.0 : 1.4;

  const stayPerDay = Math.round(dest.dailyBase * 0.45 * tierMultiplier);
  const mealsPerDay = Math.round(dest.dailyBase * 0.3 * tierMultiplier);
  const transitTotal = Math.round(2500 * travelers * (dest.cities.length - 1));
  const activitiesTotal = Math.round(1200 * days * travelers * paceMultiplier);

  const stayTotal = stayPerDay * days * travelers;
  const mealsTotal = mealsPerDay * days * travelers;

  const totalCost = stayTotal + mealsTotal + transitTotal + activitiesTotal;
  const perPersonCost = Math.round(totalCost / travelers);
  const dailyPerPerson = Math.round(perPersonCost / days);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-8 my-12 backdrop-blur-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
            <i className="bi bi-cpu-fill"></i> Live Interactive Travel Simulator (INR ₹)
          </div>
          <h3 className="text-2xl md:text-3xl font-black font-display text-slate-900">
            Real-Time India & Gujarat Budget Simulator
          </h3>
          <p className="text-xs text-slate-500">Adjust parameters to simulate live budget, daily spend & transit metrics in Rupees (₹)</p>
        </div>

        <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white p-4 rounded-2xl flex items-center gap-6 shadow-lg">
          <div>
            <div className="text-[11px] font-semibold text-teal-200 uppercase tracking-wider">Simulated Total Cost</div>
            <div className="text-3xl font-black font-display text-amber-300">₹{totalCost.toLocaleString('en-IN')}</div>
          </div>
          <div className="border-l border-teal-700 pl-6 text-right">
            <div className="text-[11px] font-semibold text-teal-200">Per Person / Day</div>
            <div className="text-lg font-bold text-white">₹{dailyPerPerson.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Column */}
        <div className="space-y-6">
          {/* Destination Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">1. Choose Travel Circuit</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DESTINATIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDestId(d.id)}
                  className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                    destId === d.id
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/30 scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-800">Travelers: {travelers}</label>
                <span className="text-[11px] text-teal-700 font-bold">{travelers} People</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-800">Duration: {days} Days</label>
                <span className="text-[11px] text-amber-700 font-bold">{days} Nights</span>
              </div>
              <input
                type="range"
                min="1"
                max="21"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Hotel Tier & Pace */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Stay Category</label>
              <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
                {[
                  { id: 'budget', label: 'Budget' },
                  { id: 'comfort', label: 'Comfort' },
                  { id: 'luxury', label: 'Luxury' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTier(t.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      tier === t.id ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Itinerary Pace</label>
              <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
                {[
                  { id: 'relaxed', label: 'Relaxed' },
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'packed', label: 'High Pace' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPace(p.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      pace === p.id ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulation Breakdown Column */}
        <div className="space-y-4 bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <h4 className="text-base font-bold font-display flex items-center justify-between border-b border-slate-800 pb-3">
              <span>Live Rupee Breakdown</span>
              <span className="text-xs text-teal-400 font-mono">INR ENGINE (₹)</span>
            </h4>

            {/* Category Bars */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-300">🏨 Accommodation & Stay</span>
                  <span className="font-mono text-teal-300">₹{stayTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (stayTotal / totalCost) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-300">🍜 Food & Dining</span>
                  <span className="font-mono text-amber-300">₹{mealsTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (mealsTotal / totalCost) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-300">🚆 Inter-City Rail / Road</span>
                  <span className="font-mono text-cyan-300">₹{transitTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (transitTotal / totalCost) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-300">🎯 Experiences & Activities</span>
                  <span className="font-mono text-emerald-300">₹{activitiesTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (activitiesTotal / totalCost) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Cities Route Badges */}
          <div className="pt-4 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-400 mb-2">Simulated Circuit:</div>
            <div className="flex flex-wrap gap-2">
              {dest.cities.map((c, i) => (
                <span key={c} className="px-3 py-1 bg-slate-800 text-teal-300 font-bold text-xs rounded-xl border border-slate-700">
                  {i + 1}. {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
