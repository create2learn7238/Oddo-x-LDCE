'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard',  icon: 'bi-grid-1x2-fill' },
  { href: '/trips',     label: 'My Trips',   icon: 'bi-suitcase-lg-fill' },
  { href: '/cities',   label: 'Cities',      icon: 'bi-buildings-fill' },
  { href: '/activities', label: 'Activities', icon: 'bi-map-fill' },
];

export function HeaderNav({ userSession }: HeaderNavProps) {
  const pathname = usePathname();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return 'GT';
    const parts = nameStr.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'GT';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const userInitials = getInitials(userSession?.name);
  const validPhoto =
    userSession?.photo &&
    (userSession.photo.startsWith('http://') || userSession.photo.startsWith('https://') || userSession.photo.startsWith('/'))
      ? userSession.photo
      : null;

  return (
    <>
      <nav className="topbar">
        {/* ── 3-column grid: logo | center nav | right actions ── */}
        <div className="topbar-inner">

          {/* LEFT — Logo */}
          <Link href="/" className="brand" style={{ flexShrink: 0 }}>
            <span className="brand-mark">
              <i className="bi bi-compass-fill"></i>
            </span>
            <span className="hidden sm:inline">GlobeTrotter</span>
          </Link>

          {/* CENTER — Nav Links (absolutely centered) */}
          <div className="hidden md:flex items-center justify-center gap-1 flex-1">
            {NAV_LINKS.map(({ href, label, icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-pill ${active ? 'nav-pill-active' : ''}`}
                >
                  <i className={`bi ${icon}`}></i>
                  <span>{label}</span>
                </Link>
              );
            })}
            {userSession?.isAdmin && (
              <Link
                href="/admin"
                className={`nav-pill ${isActive('/admin') ? 'nav-pill-active' : ''}`}
              >
                <i className="bi bi-speedometer2"></i>
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-2.5" style={{ flexShrink: 0 }}>
            {/* Smart Tools Button */}
            <button
              onClick={() => setIsToolsOpen(true)}
              className="nav-tools-btn"
              title="Smart Tools"
            >
              <i className="bi bi-stars"></i>
              <span className="hidden sm:inline">Smart Tools</span>
            </button>

            {!userSession ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login" className="nav-auth-ghost">
                  <i className="bi bi-box-arrow-in-right"></i>
                  Log in
                </Link>
                <Link href="/signup" className="nav-auth-primary">
                  <i className="bi bi-person-plus-fill"></i>
                  Sign up
                </Link>
              </div>
            ) : (
              <Link href="/profile" title={`${userSession.name} — Profile`} className="nav-avatar-link">
                {validPhoto && !imgErr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={validPhoto}
                    alt={userSession.name}
                    className="nav-avatar-img"
                    onError={() => setImgErr(true)}
                  />
                ) : (
                  <div className="nav-avatar-initials">{userInitials}</div>
                )}
                <span className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight">{userSession.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400 leading-tight">View profile</span>
                </span>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden nav-hamburger"
              aria-label="Toggle menu"
            >
              <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-lg`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl p-4 space-y-1 animate-fadeUp">
            {NAV_LINKS.map(({ href, label, icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    active
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <i className={`bi ${icon} text-base ${active ? 'text-teal-600' : 'text-slate-400'}`}></i>
                  {label}
                  {active && <span className="ml-auto w-2 h-2 rounded-full bg-teal-500"></span>}
                </Link>
              );
            })}

            {userSession?.isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive('/admin')
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <i className="bi bi-speedometer2 text-base text-slate-400"></i>
                Admin Panel
              </Link>
            )}

            <div className="pt-3 mt-2 border-t border-slate-100">
              {!userSession ? (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center nav-auth-ghost">
                    <i className="bi bi-box-arrow-in-right"></i> Log in
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center nav-auth-primary">
                    <i className="bi bi-person-plus-fill"></i> Sign up
                  </Link>
                </div>
              ) : (
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <div className="nav-avatar-initials text-sm">{userInitials}</div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{userSession.name}</div>
                    <div className="text-[11px] text-slate-400">View & edit profile</div>
                  </div>
                  <i className="bi bi-chevron-right ml-auto text-slate-400 text-xs"></i>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <SmartToolsModal isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} />
    </>
  );
}
