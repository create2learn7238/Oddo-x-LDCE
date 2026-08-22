'use client';

import React, { useState } from 'react';
import { SmartToolsModal } from './SmartToolsModal';

export function FloatingActionBar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        
        {/* Expanded Quick Action Items */}
        {isExpanded && (
          <div className="flex flex-col gap-2 bg-slate-900/90 backdrop-blur-2xl p-3 rounded-3xl border border-teal-500/30 shadow-2xl animate-popIn text-white text-xs font-bold">
            <button
              onClick={() => {
                setIsToolsOpen(true);
                setIsExpanded(false);
              }}
              className="px-4 py-2.5 rounded-2xl bg-teal-600/80 hover:bg-teal-500 text-white flex items-center gap-2.5 transition-all hover:scale-105"
            >
              <i className="bi bi-compass-fill text-amber-400"></i>
              <span>Smart Suite Drawer</span>
            </button>

            <a
              href="/#simulator"
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-teal-300 flex items-center gap-2.5 transition-all hover:scale-105"
            >
              <i className="bi bi-cpu-fill text-amber-400"></i>
              <span>Live Travel Simulator</span>
            </a>

            <a
              href="/cities"
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 flex items-center gap-2.5 transition-all hover:scale-105"
            >
              <i className="bi bi-search text-teal-400"></i>
              <span>Discover 31+ Cities</span>
            </a>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-600 via-teal-500 to-amber-600 text-white flex items-center justify-center text-2xl shadow-2xl shadow-teal-500/50 hover:scale-110 active:scale-95 transition-all border-2 border-white/30"
          title="Quick Travel Tools"
        >
          <i className={`bi ${isExpanded ? 'bi-x-lg' : 'bi-stars'} animate-pulse`}></i>
        </button>
      </div>

      <SmartToolsModal isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} />
    </>
  );
}
