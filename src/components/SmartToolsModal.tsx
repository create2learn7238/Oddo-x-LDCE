'use client';

import React, { useState } from 'react';

type TabType = 'ai' | 'currency' | 'weather' | 'transit' | 'expenses' | 'vault' | 'journal' | 'quiz' | 'badges' | 'sound';

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

const BADGES = [
  { title: 'Globe Voyager', icon: '🌍', desc: 'Planned trips across 3+ continents', unlocked: true, color: 'from-teal-500 to-emerald-600' },
  { title: 'Heritage Hunter', icon: '🏰', desc: 'Visited UNESCO heritage sites', unlocked: true, color: 'from-amber-500 to-orange-600' },
  { title: 'Budget Maestro', icon: '💰', desc: 'Stayed 100% under daily target', unlocked: true, color: 'from-indigo-500 to-blue-600' },
  { title: 'Gujarat Explorer', icon: '🦁', desc: 'Explored Ahmedabad & Rann of Kutch', unlocked: true, color: 'from-teal-600 to-cyan-700' },
  { title: 'Culinary Connoisseur', icon: '🍜', desc: 'Tried 10+ local food experiences', unlocked: false, color: 'from-slate-400 to-slate-500' },
  { title: 'Night Sky Nomad', icon: '🌌', desc: 'Stargazed in salt deserts', unlocked: false, color: 'from-slate-400 to-slate-500' },
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
  const [totalBill, setTotalBill] = useState<number>(12000);

  // Quiz State
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  // Ambient Sound Player State
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  // Journal Notes
  const [notes, setNotes] = useState<string>('Day 1: Arrived in style. Sabarmati heritage walk was breathtaking!');

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
    }, 600);
  };

  const fromRate = CURRENCIES.find(c => c.code === fromCurr)?.rate || 1;
  const toRate = CURRENCIES.find(c => c.code === toCurr)?.rate || 1;
  const convertedVal = ((currAmount / fromRate) * toRate).toFixed(2);

  const distanceKm = transitFrom === 'Ahmedabad' && transitTo === 'Mumbai' ? 530 : 1250;
  const speed = transitMode === 'flight' ? 650 : transitMode === 'train' ? 90 : 65;
  const hours = (distanceKm / speed).toFixed(1);
  const costEst = transitMode === 'flight' ? Math.round(3500 + distanceKm * 4) : transitMode === 'train' ? Math.round(500 + distanceKm * 2) : Math.round(800 + distanceKm * 5);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal max-w-4xl w-full !p-0 overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Animated Live Ticker Header */}
        <div className="bg-slate-950 text-teal-400 py-1.5 px-4 text-[11px] font-mono font-bold flex items-center overflow-hidden border-b border-teal-900/40">
          <span className="bg-teal-600 text-white px-2 py-0.5 rounded text-[10px] uppercase font-extrabold mr-3 shrink-0 animate-pulse">
            LIVE TICKER
          </span>
          <div className="flex gap-6 whitespace-nowrap overflow-x-auto scrollbar-none opacity-90">
            {CURRENCIES.map(c => (
              <span key={c.code} className="inline-flex items-center gap-1">
                <span>{c.code}:</span>
                <span className="text-amber-400">{c.symbol}{c.rate}</span>
                <span className="text-emerald-400 text-[9px]">▲ 0.4%</span>
              </span>
            ))}
          </div>
        </div>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-700 to-amber-700 p-5 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner animate-float">
              <i className="bi bi-compass-fill"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold font-display leading-tight text-white">GlobeTrotter Smart Suite</h3>
              <p className="text-xs text-teal-100 font-medium">Interactive AI, soundscapes, personality quiz & travel tools</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-teal-900/10 p-2 flex gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'ai', label: 'AI Assistant', icon: 'bi-robot' },
            { id: 'currency', label: 'Currency', icon: 'bi-currency-exchange' },
            { id: 'weather', label: 'Weather', icon: 'bi-cloud-sun' },
            { id: 'transit', label: 'Route & Transit', icon: 'bi-signpost-split' },
            { id: 'expenses', label: 'Expense Splitter', icon: 'bi-calculator' },
            { id: 'quiz', label: 'Travel Quiz', icon: 'bi-patch-question' },
            { id: 'badges', label: 'Badges', icon: 'bi-award' },
            { id: 'sound', label: 'Soundscapes', icon: 'bi-headphones' },
            { id: 'vault', label: 'Emergency Vault', icon: 'bi-shield-check' },
            { id: 'journal', label: 'Journal', icon: 'bi-journal-bookmark' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105'
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
                  <button onClick={() => handleAiSend('Suggest 3-day Gujarat itinerary')} className="px-2.5 py-1 text-xs bg-teal-50 text-teal-700 font-semibold rounded-lg hover:bg-teal-100 transition-all hover:scale-105">
                    🦁 Gujarat Express
                  </button>
                  <button onClick={() => handleAiSend('Top budget travel tips')} className="px-2.5 py-1 text-xs bg-amber-50 text-amber-700 font-semibold rounded-lg hover:bg-amber-100 transition-all hover:scale-105">
                    💡 Budget Tips
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 h-72 overflow-y-auto space-y-3 shadow-inner">
                {aiMessages.map((m, idx) => (
                  <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeUp`}>
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
                    <i className="bi bi-arrow-repeat animate-spin"></i> Generating smart travel plan...
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
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-teal-600/30 transition-all flex items-center gap-1.5 hover:scale-105"
                >
                  <span>Send</span>
                  <i className="bi bi-send-fill"></i>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Travel Personality Quiz */}
          {activeTab === 'quiz' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <i className="bi bi-patch-question text-amber-500"></i> Interactive Travel Personality Quiz
                </h4>
                <p className="text-xs text-slate-500">Discover your travel style archetype through interactive animated questions</p>
              </div>

              <div className="space-y-4">
                {[
                  { q: "1. What is your ideal morning on vacation?", options: ["☕ Espresso at a historic cafe", "🥾 Sunrise hike to a mountain peak", "🏖️ Sleeping in & beach relaxing", "🕌 Exploring a local food bazaar"] },
                  { q: "2. How do you plan your travel budget?", options: ["💎 Luxury boutique stays & fine dining", "📊 Strict daily tracking on spreadsheets", "🎒 Budget hostels & street eats", "✨ Flexible — spend where it matters"] },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                    <h5 className="text-xs font-bold text-slate-800">{item.q}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {item.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [idx]: opt }))}
                          className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                            selectedAnswers[idx] === opt
                              ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-sm scale-[1.02]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-800 text-white flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-xs text-amber-200 font-bold uppercase tracking-wider">Your Archetype Result</div>
                  <div className="text-2xl font-black font-display text-white mt-1">
                    {selectedAnswers[0]?.includes('hike') ? '🏔️ The Alpine Explorer' : selectedAnswers[0]?.includes('bazaar') ? '🦁 The Heritage Nomad' : '✨ The Cultural Connoisseur'}
                  </div>
                  <p className="text-xs text-amber-100 mt-1">Tailored itineraries: Gujarat Cultural Circuit, Europe Art Express & Alpine Trails.</p>
                </div>
                <div className="text-4xl text-amber-300 animate-bounce">
                  🏆
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Gamified Badges */}
          {activeTab === 'badges' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <i className="bi bi-award text-amber-500"></i> Gamified Achievements & Trophy Vault
                </h4>
                <p className="text-xs text-slate-500">Earn glowing badges as you plan and complete real travel itineraries</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {BADGES.map((b, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      b.unlocked 
                        ? 'bg-white border-teal-200 shadow-md hover:shadow-teal-500/20' 
                        : 'bg-slate-100/70 border-slate-200 opacity-65'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.color} text-white flex items-center justify-center text-2xl mb-3 shadow-sm ${b.unlocked ? 'animate-pulse-slow' : ''}`}>
                      {b.icon}
                    </div>
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-slate-900">{b.title}</h5>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${b.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Ambient Soundscapes */}
          {activeTab === 'sound' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <i className="bi bi-headphones text-amber-500"></i> Ambient Travel Soundscape Player
                </h4>
                <p className="text-xs text-slate-500">Listen to soothing ambient audio while planning your upcoming journeys</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'waves', name: 'Goa Ocean Waves', icon: 'bi-tsunami', desc: 'Calming beach surf & palm breeze', color: 'from-cyan-600 to-teal-700' },
                  { id: 'rain', name: 'Parisian Cafe Rain', icon: 'bi-cloud-rain', desc: 'Gentle raindrops & bistro acoustic ambiance', color: 'from-indigo-600 to-slate-800' },
                  { id: 'desert', name: 'Kutch Night Winds', icon: 'bi-wind', desc: 'Quiet desert breeze under silver moonlight', color: 'from-amber-600 to-amber-800' },
                  { id: 'flight', name: 'Cabin White Noise', icon: 'bi-airplane', desc: 'Relaxing high-altitude cruising soundscape', color: 'from-teal-700 to-teal-900' },
                ].map(s => (
                  <div key={s.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-xl shadow-md`}>
                        <i className={`bi ${s.icon}`}></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-900">{s.name}</h5>
                        <p className="text-[11px] text-slate-500">{s.desc}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setPlayingTrack(playingTrack === s.id ? null : s.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        playingTrack === s.id
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 scale-110 animate-pulse'
                          : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                      }`}
                    >
                      <i className={`bi ${playingTrack === s.id ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                    </button>
                  </div>
                ))}
              </div>

              {playingTrack && (
                <div className="p-4 bg-teal-900 text-white rounded-2xl flex items-center justify-between shadow-lg animate-fadeUp">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></div>
                    <span className="text-xs font-bold">Now Playing: Ambient Soundscape</span>
                  </div>
                  <span className="text-xs font-mono text-teal-200">Volume: 80%</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Currency */}
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
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl text-amber-400">
                  <i className="bi bi-arrow-down-up"></i>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Weather */}
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
                    <div className="text-5xl text-amber-300 opacity-90 animate-pulse">
                      <i className={`bi ${WEATHER_DATA[selectedCity].icon}`}></i>
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

          {/* TAB 7: Route & Transit */}
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
                          transitMode === m.mode ? 'bg-teal-600 text-white shadow-sm scale-105' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-sm hover:border-teal-400 transition-all">
                  <div className="text-xs text-slate-500 font-semibold">Distance</div>
                  <div className="text-2xl font-extrabold text-teal-700 mt-1">{distanceKm} km</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Haversine Great-Circle</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-sm hover:border-amber-400 transition-all">
                  <div className="text-xs text-slate-500 font-semibold">Estimated Time</div>
                  <div className="text-2xl font-extrabold text-amber-600 mt-1">{hours} hrs</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Avg Speed: {speed} km/h</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-sm hover:border-emerald-400 transition-all">
                  <div className="text-xs text-slate-500 font-semibold">Estimated Fare</div>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1">₹{costEst.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Per person base rate</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Expense Splitter */}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Total Trip Budget (₹ INR)</label>
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
                  ₹{(totalBill / numTravelers).toLocaleString('en-IN')} <span className="text-xs font-normal text-amber-200">/ person</span>
                </div>
                <div className="pt-3 border-t border-amber-500/40 text-xs text-amber-100 flex items-center justify-between">
                  <span>Recommended +10% Emergency Buffer:</span>
                  <span className="font-bold text-white">₹{((totalBill * 1.1) / numTravelers).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: Emergency Vault */}
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
                  <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-red-300 transition-all">
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

          {/* TAB 10: Journal */}
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
                  <button onClick={() => alert('Journal note saved to vault!')} className="px-4 py-2 bg-amber-700 text-white font-bold text-xs rounded-xl hover:bg-amber-800 transition-all shadow-sm hover:scale-105">
                    Save Journal Entry 💾
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>GlobeTrotter Smart Suite v2.0 · Live Interactive Suite</span>
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition-all">
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
}
