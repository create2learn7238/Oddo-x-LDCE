import { useState } from 'react'
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom'
import { useApp, THEMES, CURRENCIES } from '../context/AppContext'
import {
  Globe, LayoutDashboard, Map, Plus, Search, Activity,
  DollarSign, User, Shield, LogOut, Menu, X, Palette, Sparkles, Heart, Check
} from 'lucide-react'
import AIChatAssistant from '../components/AIChatAssistant'

const navItems = [
  { label: 'Dashboard',    path: '/dashboard',   icon: LayoutDashboard },
  { label: 'My Trips',     path: '/trips',        icon: Map },
  { label: 'Plan New Trip',path: '/trips/new',    icon: Plus },
  { label: 'Cities',       path: '/cities',       icon: Globe },
  { label: 'Activities',   path: '/activities',   icon: Activity },
]
const bottomItems = [
  { label: 'Profile',     path: '/profile',   icon: User },
  { label: 'Admin',       path: '/admin',     icon: Shield },
]

export default function MainLayout() {
  const { user, logout, theme, setTheme, currency, setCurrency, favorites, dbStatus } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showThemeModal, setShowThemeModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path === '/trips') return 'My Trips'
    if (path === '/trips/new') return 'Plan New Trip'
    if (path.includes('/build')) return 'Itinerary Builder'
    if (path.includes('/view')) return 'Itinerary View'
    if (path.includes('/budget')) return 'Budget Overview'
    if (path === '/cities') return 'Explore Cities'
    if (path === '/activities') return 'Activities'
    if (path === '/profile') return 'Profile'
    if (path === '/admin') return 'Admin Dashboard'
    return 'GlobeTrotter'
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'GT'

  return (
    <div className="app-shell">
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Globe size={20} />
          </div>
          <span className="sidebar-logo-text">GlobeTrotter</span>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Navigation</span>

          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="sidebar-link-icon" size={18} />
              {label}
              {label === 'Cities' && favorites.length > 0 && (
                <span className="badge badge-accent" style={{ marginLeft: 'auto', padding: '1px 6px', fontSize: 10 }}>
                  ❤️ {favorites.length}
                </span>
              )}
            </NavLink>
          ))}

          <span className="sidebar-section-label" style={{ marginTop: 'var(--space-4)' }}>Theme & Style</span>
          <button
            className="sidebar-link"
            onClick={() => { setShowThemeModal(true); setSidebarOpen(false); }}
            style={{ width: '100%', textAlign: 'left' }}
          >
            <Palette className="sidebar-link-icon" size={18} />
            Theme: {THEMES.find(t=>t.id===theme)?.name.split(' ')[0]}
          </button>

          <span className="sidebar-section-label" style={{ marginTop: 'var(--space-4)' }}>Account</span>

          {bottomItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="sidebar-link-icon" size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link btn-ghost" style={{ width: '100%' }} onClick={handleLogout}>
            <LogOut size={18} className="sidebar-link-icon" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-left">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="navbar-title">{getPageTitle()}</h1>
        </div>

        <div className="navbar-right">
          {/* Live DB Connection Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: dbStatus === 'connected' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
            border: `1px solid ${dbStatus === 'connected' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
            borderRadius: 'var(--radius-full)',
            padding: '4px 10px',
            fontSize: '11px',
            color: dbStatus === 'connected' ? 'var(--color-success)' : 'var(--color-warning)',
            fontWeight: 600
          }} title="PostgreSQL Neon DB Connection Status">
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: dbStatus === 'connected' ? 'var(--color-success)' : 'var(--color-warning)',
              display: 'inline-block',
              boxShadow: `0 0 8px ${dbStatus === 'connected' ? 'var(--color-success)' : 'var(--color-warning)'}`
            }} />
            {dbStatus === 'connected' ? 'Neon Postgres' : 'Offline Cache'}
          </div>

          {/* Currency Switcher */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-surface2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Switch display currency"
          >
            {Object.entries(CURRENCIES).map(([code, cur]) => (
              <option key={code} value={code}>
                {cur.symbol} {code}
              </option>
            ))}
          </select>

          {/* Theme Palette Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowThemeModal(true)}
            style={{ padding: '6px 10px' }}
            title="Change Theme & Color Palette"
          >
            <Palette size={14} />
            <span style={{ display: 'none', '@media (min-width: 600px)': { display: 'inline' } }}>Themes</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/trips/new')}
            aria-label="Plan new trip"
          >
            <Plus size={14} />
            New Trip
          </button>

          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
          >
            <div
              className="avatar-placeholder avatar-sm"
              style={{ fontSize: '12px', width: 36, height: 36 }}
              title={user?.name}
            >
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Theme Picker Modal */}
      {showThemeModal && (
        <div className="modal-overlay" onClick={() => setShowThemeModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Palette size={20} color="var(--color-primary)" />
                  Color Themes
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
                  Customize the look, colors, and gradients of GlobeTrotter
                </p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowThemeModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {THEMES.map(t => {
                const isActive = theme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-lg)',
                      background: isActive ? 'var(--color-surface3)' : 'var(--color-surface2)',
                      border: `2px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                      <span style={{ fontSize: '1.4rem' }}>{t.emoji}</span>
                      {isActive && (
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={12} color="#fff" />
                        </div>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-2)' }}>
                      {t.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ width: 14, height: 14, borderRadius: '50%', background: t.primary, boxShadow: `0 0 8px ${t.primary}` }} />
                      <span style={{ width: 14, height: 14, borderRadius: '50%', background: t.accent, boxShadow: `0 0 8px ${t.accent}` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setShowThemeModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global AI Travel Concierge Floating Chat */}
      <AIChatAssistant />
    </div>
  )
}
