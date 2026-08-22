'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SmartToolsModal } from './SmartToolsModal';

interface HeaderNavProps {
  userSession: {
    id: string;
    email: string;
    name: string;
    photo?: string | null;
    isAdmin?: boolean;
  } | null;
}

export function HeaderNav({ userSession }: HeaderNavProps) {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <i className="bi bi-compass-fill"></i>
            </span>
            GlobeTrotter
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex navlinks">
            <Link href="/dashboard" className="navlink">
              <i className="bi bi-grid-fill"></i> Dashboard
            </Link>
            <Link href="/trips" className="navlink">
              <i className="bi bi-briefcase-fill"></i> My Trips
            </Link>
            <Link href="/cities" className="navlink">
              <i className="bi bi-building"></i> Cities
            </Link>
            <Link href="/activities" className="navlink">
              <i className="bi bi-ticket-perforated"></i> Activities
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsToolsOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-amber-600/30 transition-all hover:scale-105"
            >
              <i className="bi bi-tools text-amber-200"></i>
              <span>Smart Tools</span>
            </button>

            {!userSession ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link href="/signup" className="btn btn-primary btn-sm">Sign up</Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {userSession.isAdmin && (
                  <Link href="/admin" className="hidden sm:flex navlink text-xs font-bold text-teal-700">
                    <i className="bi bi-speedometer2"></i> Admin
                  </Link>
                )}
                <Link href="/profile" title="Profile & settings">
                  {userSession.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userSession.photo} alt="" className="avatar object-cover" />
                  ) : (
                    <div className="avatar">
                      {userSession.name ? userSession.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() : 'GT'}
                    </div>
                  )}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl border border-slate-300 flex items-center justify-center text-slate-700"
            >
              <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-lg`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-fadeUp">
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-teal-50 hover:text-teal-700">
              <i className="bi bi-grid-fill mr-2"></i> Dashboard
            </Link>
            <Link href="/trips" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-teal-50 hover:text-teal-700">
              <i className="bi bi-briefcase-fill mr-2"></i> My Trips
            </Link>
            <Link href="/cities" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-teal-50 hover:text-teal-700">
              <i className="bi bi-building mr-2"></i> Cities
            </Link>
            <Link href="/activities" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-teal-50 hover:text-teal-700">
              <i className="bi bi-ticket-perforated mr-2"></i> Activities
            </Link>
            {!userSession && (
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center btn btn-ghost btn-sm">Log in</Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center btn btn-primary btn-sm">Sign up</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <SmartToolsModal isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} />
    </>
  );
}
