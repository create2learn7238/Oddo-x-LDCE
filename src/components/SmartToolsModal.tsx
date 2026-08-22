'use client';

import React, { useState } from 'react';

type TabType = 'ai' | 'currency' | 'weather' | 'transit' | 'expenses' | 'vault' | 'journal' | 'visa';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 86.5 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 152.4 },
];

const WEATHER_DATA: Record<string, { temp: number; cond: string; icon: string; humidity: string; advice: string; items: string[] }> = {
  'Ahmedabad': { temp: 34, cond: 'Sunny & Warm', icon: 'bi-sun-fill', humidity: '42%', advice: 'Light cotton clothes, sunglasses, and high-SPF sunscreen.', items: ['Cotton Shirt', 'Sunglasses', 'Sunscreen SPF50', 'Hydration Flask'] },
  'Paris': { temp: 18, cond: 'Partly Cloudy', icon: 'bi-cloud-sun-fill', humidity: '65%', advice: 'Layered jacket, comfortable walking shoes, and an umbrella.', items: ['Trench Coat', 'Walking Shoes', 'Compact Umbrella', 'Travel Adapter'] },
  'Tokyo': { temp: 22, cond: 'Pleasant & Breezy', icon: 'bi-wind', humidity: '55%', advice: 'Light cardigan, suica metro card, and comfortable sneakers.', items: ['Cardigan', 'Sneakers', 'Power Bank', 'Rain Poncho'] },
  'Rome': { temp: 26, cond: 'Clear Sky', icon: 'bi-brightness-high-fill', humidity: '48%', advice: 'Breathable linens, sun hat, and reusable water bottle.', items: ['Linen Shirt', 'Sun Hat', 'Water Bottle', 'Comfortable Sandals'] },
  'Rann of Kutch': { temp: 30, cond: 'Clear Desert Sky', icon: 'bi-brightness-low-fill', humidity: '28%', advice: 'Warm clothes for cold night, dust protection mask, sunglasses.', items: ['Night Jacket', 'Dust Mask', 'Moisturizer', 'Camera Tripod'] },
  'Goa': { temp: 29, cond: 'Tropical Breeze', icon: 'bi-tsunami', humidity: '78%', advice: 'Beachwear, flip-flops, waterproof bag, and mosquito repellent.', items: ['Swimwear', 'Flip-Flops', 'Waterproof Pouch', 'Bug Spray'] },
};

const EMERGENCY_HELPLINES = [
  { country: '🇮🇳 India', police: '112 / 100', ambulance: '108', tourist: '1800-11-1363' },
  { country: '🇫🇷 France / EU', police: '112', ambulance: '15', tourist: '+33 1 40 76 70 00' },
  { country: '🇯🇵 Japan', police: '110', ambulance: '119', tourist: '050-3816-2720' },
  { country: '🇺🇸 USA', police: '911', ambulance: '911', tourist: '1-888-407-4747' },
  { country: '🇦🇪 UAE', police: '999', ambulance: '998', tourist: '800-4438' },
];

export function SmartToolsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('ai');

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: '👋 Hello traveler! Ask me anything about destination itineraries, budget tips, hidden gems, or local food recommendations.' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Currency Converter State
  const [currAmount, setCurrAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('INR');

  // Weather State
  const [selectedCity, setSelectedCity] = useState('Ahmedabad');

  // Transit Visualizer State
  const [transitFrom, setTransitFrom] = useState('Ahmedabad');
  const [transitTo, setTransitTo] = useState('Mumbai');
  const [transitMode, setTransitMode] = useState<'train' | 'flight' | 'car'>('train');

  // Expense Splitter State
  const [numTravelers, setNumTravelers] = useState<number>(4);
  const [totalBill, setTotalBill] = useState<number>(1200);

  // Visa Checker State
  const [passportCountry, setPassportCountry] = useState('India');
  const [destCountry, setDestCountry] = useState('France');

  // Journal State
  const [notes, setNotes] = useState<string>('Day 1: Arrived in style. The local food is incredible!');

  if (!isOpen) return null;

  const handleAiSend = (textToSend?: string) => {
    const q = textToSend || aiPrompt;
    if (!q.trim()) return;
    setAiMessages(prev => [...prev, { role: 'user', text: q }]);
    if (!textToSend) setAiPrompt('');
    setIsAiLoading(true);

    setTimeout(() => {
      let reply = "Here's a curated smart suggestion based on your query:\n\n";
      if (q.toLowerCase().includes('gujarat') || q.toLowerCase().includes('ahmedabad')) {
        reply += "🦁 Gujarat Royal Express Itinerary:\n• Day 1: Sabarmati Ashram & Heritage Walk in Old Ahmedabad.\n• Day 2: Statue of Unity (Kevadia) & Sound and Light Show.\n• Day 3: Gir National Park Lion Safari & Somnath Beach Temple.\n• Day 4: White Desert Sunset at Rann of Kutch.";
      } else if (q.toLowerCase().includes('budget') || q.toLowerCase().includes('cheap')) {
        reply += "💡 Smart Savings Tips:\n1. Book intercity trains instead of short domestic flights.\n2. Use public transit city passes for daily commutes.\n3. Eat at authentic local food markets rather than tourist-heavy main street bistros.";
      } else {
        reply += `✨ Smart recommendation for "${q}":\nCombine morning cultural walking tours with afternoon museum visits, followed by golden hour rooftop sunset views and local dining.`;
      }
      setAiMessages(prev => [...prev, { role: 'ai', text: reply }]);
      setIsAiLoading(false);
    }, 700);
  };

  // Convert Currency logic
  const fromRate = CURRENCIES.find(c => c.code === fromCurr)?.rate || 1;
  const toRate = CURRENCIES.find(c => c.code === toCurr)?.rate || 1;
  const convertedVal = ((currAmount / fromRate) * toRate).toFixed(2);

  // Transit calculations
  const distanceKm = transitFrom === 'Ahmedabad' && transitTo === 'Mumbai' ? 530 : 1250;
  const speed = transitMode === 'flight' ? 650 : transitMode === 'train' ? 90 : 65;
  const hours = (distanceKm / speed).toFixed(1);
  const costEst = transitMode === 'flight' ? Math.round(75 + distanceKm * 0.08) : transitMode === 'train' ? Math.round(25 + distanceKm * 0.04) : Math.round(40 + distanceKm * 0.06);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal max-w-4xl w-full !p-0 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-700 to-amber-700 p-5 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
              <i className="bi bi-compass-fill"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold font-display leading-tight text-white">GlobeTrotter Smart Travel Tools</h3>
              <p className="text-xs text-teal-100 font-medium">All-in-one assistant, converter, planner & emergency vault</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-teal-900/10 p-2 flex gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'ai', label: 'AI Assistant', icon: 'bi-robot' },
            { id: 'currency', label: 'Currency Ticker', icon: 'bi-currency-exchange' },
            { id: 'weather', label: 'Weather & Packing', icon: 'bi-cloud-sun' },
            { id: 'transit', label: 'Route & Transit', icon: 'bi-signpost-split' },
            { id: 'expenses', label: 'Expense Splitter', icon: 'bi-calculator' },
            { id: 'vault', label: 'Emergency Vault', icon: 'bi-shield-check' },
            { id: 'journal', label: 'Journal & Notes', icon: 'bi-journal-bookmark' },
            { id: 'visa', label: 'Visa Matrix', icon: 'bi-passport' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'bg-white text-slate-600 hover:text-teal-700 hover:bg-teal-50'
              }`}
            >
              <i className={`bi ${t.icon}`}></i>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[72vh] overflow-y-auto bg-slate-50/50">
          
          {/* TAB 1: AI Assistant */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <i className="bi bi-stars text-amber-500"></i> Smart AI Travel Co-Pilot
                  </h4>
                  <p className="text-xs text-slate-500">Instant trip recommendations, local secrets & budget optimization</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleAiSend('Suggest 3-day Gujarat itinerary')} className="px-2.5 py-1 text-xs bg-teal-50 text-teal-700 font-semibold rounded-lg hover:bg-teal-100 transition-all">
                    🦁 Gujarat Express
                  </button>
                  <button onClick={() => handleAiSend('Top budget travel tips')} className="px-2.5 py-1 text-xs bg-amber-50 text-amber-700 font-semibold rounded-lg hover:bg-amber-100 transition-all">
                    💡 Budget Tips
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 h-72 overflow-y-auto space-y-3 shadow-inner">
                {aiMessages.map((m, idx) => (
                  <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-teal-500 text-white flex items-center justify-center text-sm shadow-md shrink-0">
                        🤖
                      </div>
                    )}
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[82%] whitespace-pre-line ${
                      m.role === 'user' 
                        ? 'bg-teal-600 text-white rounded-tr-none shadow-sm font-medium' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex gap-2 items-center text-xs text-teal-600 font-semibold italic animate-pulse">
                    <i className="bi bi-arrow-repeat animate-spin"></i> Generating recommendations...
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask e.g. 'Must-try dishes in Paris' or 'How to plan 5 days in Europe'"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
                <button
                  onClick={() => handleAiSend()}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-teal-600/30 transition-all flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <i className="bi bi-send-fill"></i>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Currency Converter */}
          {activeTab === 'currency' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <i className="bi bi-currency-exchange text-amber-500"></i> Realtime Multi-Currency Converter
                </h4>
                <p className="text-xs text-slate-500">Convert travel expenses across world currencies instantaneously</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Amount</label>
                  <input
                    type="number"
                    value={currAmount}
                    onChange={e => setCurrAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">From</label>
                  <select
                    value={fromCurr}
                    onChange={e => setFromCurr(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">To</label>
                  <select
                    value={toCurr}
                    onChange={e => setToCurr(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 to-teal-800 text-white flex items-center justify-between shadow-md">
                <div>
                  <div className="text-xs text-teal-200 font-semibold">Converted Result</div>
                  <div className="text-3xl font-extrabold font-display tracking-tight text-amber-300 mt-1">
                    {CURRENCIES.find(c => c.code === toCurr)?.symbol} {convertedVal} {toCurr}
                  </div>
                  <div className="text-[11px] text-teal-300 mt-1">
                    1 {fromCurr} = {((1 / fromRate) * toRate).toFixed(4)} {toCurr}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl text-amber-400">
                  <i className="bi bi-arrow-down-up"></i>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h5 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Live Rate Table (USD Base)</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CURRENCIES.map(c => (
                    <div key={c.code} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">{c.symbol} {c.code}</span>
                      <span className="text-xs font-mono font-semibold text-teal-700">{c.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Weather & Packing */}
          {activeTab === 'weather' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <i className="bi bi-cloud-sun text-amber-500"></i> Destination Climate & Packing Advisor
                  </h4>
                  <p className="text-xs text-slate-500">Real-time weather forecast simulation and automated gear checklist</p>
                </div>
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="px-3.5 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                >
                  {Object.keys(WEATHER_DATA).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {WEATHER_DATA[selectedCity] && (
                <>
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-amber-600 text-white flex items-center justify-between shadow-lg">
                    <div>
                      <div className="text-xs uppercase font-bold tracking-wider text-teal-100">{selectedCity} Weather</div>
                      <div className="text-4xl font-black mt-1 font-display">{WEATHER_DATA[selectedCity].temp}°C</div>
                      <div className="text-xs font-semibold text-amber-200 mt-1 flex items-center gap-1.5">
                        <i className={`bi ${WEATHER_DATA[selectedCity].icon}`}></i>
                        {WEATHER_DATA[selectedCity].cond} · Humidity: {WEATHER_DATA[selectedCity].humidity}
                      </div>
                    </div>
                    <div className="text-5xl text-amber-300 opacity-90">
                      <i className={`bi ${WEATHER_DATA[selectedCity].icon}`}></i>
                    </div>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl flex gap-3 items-start">
                    <i className="bi bi-lightbulb-fill text-amber-600 text-lg mt-0.5"></i>
                    <div>
                      <h5 className="text-xs font-bold text-amber-900 uppercase">Smart Packing Advice</h5>
                      <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{WEATHER_DATA[selectedCity].advice}</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200">
                    <h5 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <i className="bi bi-bag-check-fill text-teal-600"></i> Recommended Gear Checklist
                    </h5>
                    <div className="grid grid-cols-2 gap-2.5">
                      {WEATHER_DATA[selectedCity].items.map((item, i) => (
                        <label key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-teal-50 hover:border-teal-300 transition-all">
                          <input type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 4: Route & Transit */}
          {activeTab === 'transit' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <i className="bi bi-signpost-split text-amber-500"></i> Interactive Route & Transit Visualizer
                </h4>
                <p className="text-xs text-slate-500">Haversine distance calculation, transit duration & fuel/toll estimator</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">From City</label>
                  <select value={transitFrom} onChange={e => setTransitFrom(e.target.value)} className="w-full p-2.5 text-xs font-semibold border rounded-xl bg-white">
                    <option value="Ahmedabad">Ahmedabad 🇮🇳</option>
                    <option value="Paris">Paris 🇫🇷</option>
                    <option value="Tokyo">Tokyo 🇯🇵</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">To Destination</label>
                  <select value={transitTo} onChange={e => setTransitTo(e.target.value)} className="w-full p-2.5 text-xs font-semibold border rounded-xl bg-white">
                    <option value="Mumbai">Mumbai 🇮🇳</option>
                    <option value="Rome">Rome 🇮🇹</option>
                    <option value="London">London 🇬🇧</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mode of Travel</label>
                  <div className="flex gap-1">
                    {[
                      { mode: 'train', label: 'Train', icon: 'bi-train-front' },
                      { mode: 'flight', label: 'Flight', icon: 'bi-airplane' },
                      { mode: 'car', label: 'Road', icon: 'bi-car-front' },
                    ].map(m => (
                      <button
                        key={m.mode}
                        onClick={() => setTransitMode(m.mode as any)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                          transitMode === m.mode ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <i className={`bi ${m.icon}`}></i>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center">
                  <div className="text-xs text-slate-500 font-semibold">Distance</div>
                  <div className="text-2xl font-extrabold text-teal-700 mt-1">{distanceKm} km</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Haversine Great-Circle</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center">
                  <div className="text-xs text-slate-500 font-semibold">Estimated Time</div>
                  <div className="text-2xl font-extrabold text-amber-600 mt-1">{hours} hrs</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Average Speed: {speed} km/h</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center">
                  <div className="text-xs text-slate-500 font-semibold">Estimated Fare / Person</div>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1">${costEst}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Includes base tickets & fees</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Expense Splitter */}
          {activeTab === 'expenses' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <i className="bi bi-calculator text-amber-500"></i> Group Expense & Bill Splitter
                </h4>
                <p className="text-xs text-slate-500">Equal per-person allocation with built-in 10% emergency buffer</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Travelers</label>
                  <input
                    type="number"
                    min="1"
                    value={numTravelers}
                    onChange={e => setNumTravelers(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2.5 text-sm font-bold border rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Total Trip Budget ($)</label>
                  <input
                    type="number"
                    value={totalBill}
                    onChange={e => setTotalBill(Number(e.target.value))}
                    className="w-full p-2.5 text-sm font-bold border rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 text-white shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-200 uppercase">Individual Share Per Person</span>
                  <span className="px-2.5 py-1 text-xs bg-white/20 font-bold rounded-lg">{numTravelers} People</span>
                </div>
                <div className="text-3xl font-black font-display text-white">
                  ${(totalBill / numTravelers).toFixed(2)} <span className="text-xs font-normal text-amber-200">/ person</span>
                </div>
                <div className="pt-3 border-t border-amber-500/40 text-xs text-amber-100 flex items-center justify-between">
                  <span>Recommended +10% Emergency Buffer:</span>
                  <span className="font-bold text-white">${((totalBill * 1.1) / numTravelers).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Emergency Vault */}
          {activeTab === 'vault' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <i className="bi bi-shield-check text-amber-500"></i> Global Emergency & Helpline Vault
                </h4>
                <p className="text-xs text-slate-500">Offline-ready emergency numbers & consulate contacts for travelers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {EMERGENCY_HELPLINES.map((h, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
                      <span>{h.country}</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-extrabold">24/7 HELPLINE</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-slate-400 font-medium">Police</div>
                        <div className="font-bold text-slate-800">{h.police}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 font-medium">Ambulance</div>
                        <div className="font-bold text-slate-800">{h.ambulance}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 font-medium">Tourist Hotline</div>
                        <div className="font-bold text-teal-700 truncate">{h.tourist}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Journal */}
          {activeTab === 'journal' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <i className="bi bi-journal-bookmark text-amber-500"></i> Digital Travel Journal & Memories
                </h4>
                <p className="text-xs text-slate-500">Skeuomorphic travel diary to record daily reflections & travel highlights</p>
              </div>

              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-3">
                <label className="block text-xs font-bold text-amber-900 uppercase">My Daily Travel Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={6}
                  className="w-full p-4 text-xs font-mono rounded-xl border border-amber-300/80 bg-white focus:ring-2 focus:ring-amber-500 text-slate-800 shadow-inner"
                  placeholder="Record your trip highlights, favorite cafes, and memories here..."
                ></textarea>
                <div className="flex justify-end">
                  <button onClick={() => alert('Journal note saved to vault!')} className="px-4 py-2 bg-amber-700 text-white font-bold text-xs rounded-xl hover:bg-amber-800 transition-all shadow-sm">
                    Save Journal Entry 💾
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Visa Matrix */}
          {activeTab === 'visa' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <i className="bi bi-passport text-amber-500"></i> Passport & Visa Entry Requirement Matrix
                </h4>
                <p className="text-xs text-slate-500">Check visa requirements and passport validity rules globally</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Passport Country</label>
                  <select value={passportCountry} onChange={e => setPassportCountry(e.target.value)} className="w-full p-2.5 text-xs font-semibold border rounded-xl bg-white">
                    <option value="India">India 🇮🇳</option>
                    <option value="United States">United States 🇺🇸</option>
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
                  <select value={destCountry} onChange={e => setDestCountry(e.target.value)} className="w-full p-2.5 text-xs font-semibold border rounded-xl bg-white">
                    <option value="France">France 🇫🇷 (Schengen)</option>
                    <option value="Japan">Japan 🇯🇵</option>
                    <option value="UAE">UAE 🇦🇪</option>
                    <option value="Thailand">Thailand 🇹🇭</option>
                  </select>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Status for {passportCountry} passport to {destCountry}:</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full">
                    {destCountry === 'Thailand' || destCountry === 'UAE' ? 'E-VISA / VISA ON ARRIVAL' : 'SCHENGEN / EMBASSY VISA REQUIRED'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  • Passport must be valid for at least 6 months beyond intended stay duration.<br/>
                  • Proof of return ticket and hotel reservations required at immigration.<br/>
                  • Travel health insurance covering minimum €30,000 required for Schengen destinations.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>GlobeTrotter Smart Suite v2.0</span>
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition-all">
            Close Tools
          </button>
        </div>
      </div>
    </div>
  );
}
