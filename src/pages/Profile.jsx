import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, THEMES, CURRENCIES } from '../context/AppContext'
import { User, Mail, Camera, Trash2, Save, LogOut, Shield, Calendar, Globe, Palette, DollarSign, Check } from 'lucide-react'
import EmergencyVault from '../components/EmergencyVault'
import DataBackupModal from '../components/DataBackupModal'
import VisaChecker from '../components/VisaChecker'
import JetLagPlanner from '../components/JetLagPlanner'
import TravelBadges from '../components/TravelBadges'
import DocumentExpiryTracker from '../components/DocumentExpiryTracker'
import SafetyFirstAidAI from '../components/SafetyFirstAidAI'
import PassportStampsVault from '../components/PassportStampsVault'
import { Database } from 'lucide-react'

export default function Profile() {
  const { user, login, logout, trips, showToast, theme, setTheme, currency, setCurrency } = useApp()
  const navigate = useNavigate()
  const fileRef = useRef()
  const [form, setForm] = useState({ name: user?.name||'', email: user?.email||'' })
  const [avatar, setAvatar] = useState(user?.avatar||null)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('profile') // profile | appearance | danger
  const [showBackup, setShowBackup] = useState(false)

  const userTrips = trips.filter(t => t.userId === user?.id)

  const handleAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatar(ev.target?.result)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    const updated = { ...user, name: form.name.trim(), email: form.email.trim(), avatar }
    login(updated)
    showToast('Profile updated!', 'success')
    setSaving(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleDelete = () => {
    if (confirm('Delete your account? This cannot be undone.')) {
      logout()
      navigate('/login')
    }
  }

  const initials = form.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'GT'

  return (
    <div className="page-container animate-fadeIn" style={{ maxWidth:740 }}>
      <div className="page-header">
        <h1 className="page-title">Profile & Preferences</h1>
        <p className="page-subtitle">Manage your account, visual themes, and currency settings</p>
      </div>

      {/* Avatar + Name Hero */}
      <div className="card" style={{ marginBottom:'var(--space-6)',display:'flex',alignItems:'center',gap:'var(--space-6)',padding:'var(--space-6) var(--space-8)',flexWrap:'wrap' }}>
        <div style={{ position:'relative' }}>
          {avatar ? (
            <img src={avatar} alt="Avatar" className="avatar avatar-xl" />
          ) : (
            <div className="avatar-placeholder avatar-xl" style={{ fontSize:28, width:96, height:96 }}>{initials}</div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              position:'absolute',bottom:0,right:0,width:28,height:28,
              borderRadius:'var(--radius-full)',background:'var(--color-primary)',
              display:'flex',alignItems:'center',justifyContent:'center',
              cursor:'pointer',border:'2px solid var(--color-bg)',
            }}
            title="Change photo"
          >
            <Camera size={12} color="#fff" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatar} />
        </div>
        <div>
          <h2 style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--fs-xl)' }}>{user?.name}</h2>
          <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-sm)',marginBottom:'var(--space-3)' }}>{user?.email}</p>
          <div style={{ display:'flex',gap:'var(--space-4)',flexWrap:'wrap' }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,fontSize:'var(--fs-xs)',color:'var(--color-text-muted)' }}>
              <Calendar size={12}/>Joined {new Date(user?.joinDate||Date.now()).toLocaleDateString('en-US',{month:'long',year:'numeric'})}
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:6,fontSize:'var(--fs-xs)',color:'var(--color-primary-light)',fontWeight:600 }}>
              <Globe size={12}/>{userTrips.length} trips in database
            </div>
            {user?.role === 'admin' && (
              <span className="badge badge-accent"><Shield size={10}/> Admin</span>
            )}
          </div>
        </div>
      </div>

      {/* Explorer Badges & Travel Milestones */}
      <TravelBadges />

      {/* Official Traveler Passport Book & Rubber Stamp Vault */}
      <PassportStampsVault />

      {/* Tabs Row with Backup Action */}
      <div className="flex-between" style={{ marginBottom:'var(--space-6)', flexWrap:'wrap', gap:'var(--space-3)' }}>
        <div style={{ display:'flex',gap:'var(--space-2)',background:'var(--color-surface)',borderRadius:'var(--radius-md)',padding:4,width:'fit-content',border:'1px solid var(--color-border)' }}>
          {[
            { id: 'profile', label: '👤 Profile' },
            { id: 'appearance', label: '🎨 Themes & Currency' },
            { id: 'danger', label: '⚠️ Account' }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:'var(--space-2) var(--space-5)',borderRadius:'var(--radius-sm)',
              background: tab===t.id ? (t.id==='danger'?'var(--color-danger)':'var(--color-primary)') : 'transparent',
              color: tab===t.id ? '#fff' : 'var(--color-text-muted)',
              fontWeight: tab===t.id ? 600 : 400,fontSize:'var(--fs-sm)',cursor:'pointer',border:'none',
              transition:'all var(--transition-fast)',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <button className="btn btn-secondary btn-sm" onClick={() => setShowBackup(true)}>
          <Database size={14} color="var(--color-primary-light)" /> Data Backup & Export
        </button>
      </div>

      {tab === 'profile' && (
        <div className="card" style={{ display:'flex',flexDirection:'column',gap:'var(--space-5)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <div style={{ position:'relative' }}>
              <User size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
              <input
                id="profile-name"
                type="text"
                className="form-input"
                style={{ paddingLeft:38 }}
                value={form.name}
                onChange={e => setForm(f=>({...f,name:e.target.value}))}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-email">Email Address</label>
            <div style={{ position:'relative' }}>
              <Mail size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
              <input
                id="profile-email"
                type="email"
                className="form-input"
                style={{ paddingLeft:38 }}
                value={form.email}
                onChange={e => setForm(f=>({...f,email:e.target.value}))}
              />
            </div>
          </div>

          <div style={{ display:'flex',gap:'var(--space-3)',justifyContent:'flex-end',borderTop:'1px solid var(--color-border)',paddingTop:'var(--space-5)' }}>
            <button className="btn btn-secondary" onClick={handleLogout}>
              <LogOut size={15}/> Sign Out
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="profile-save">
              {saving ? <><div className="spinner" style={{ width:15,height:15,borderWidth:2 }}/> Saving...</> : <><Save size={15}/> Save Changes</>}
            </button>
          </div>
        </div>
      )}

      {tab === 'appearance' && (
        <div className="card" style={{ display:'flex',flexDirection:'column',gap:'var(--space-6)' }}>
          {/* Themes Grid */}
          <div>
            <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--fs-lg)',marginBottom:4,display:'flex',alignItems:'center',gap:8 }}>
              <Palette size={18} color="var(--color-primary)" />
              App Theme Palette
            </h3>
            <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)',marginBottom:'var(--space-4)' }}>
              Select your favorite design theme and color contrast
            </p>

            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'var(--space-3)' }}>
              {THEMES.map(t => {
                const isActive = theme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--color-surface3)' : 'var(--color-surface2)',
                      border: `2px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-2)' }}>
                      <span style={{ fontSize:'1.3rem' }}>{t.emoji}</span>
                      {isActive && <Check size={14} color="var(--color-primary)" />}
                    </div>
                    <div style={{ fontWeight:600,fontSize:'var(--fs-sm)',marginBottom:6 }}>{t.name}</div>
                    <div style={{ display:'flex',gap:6 }}>
                      <span style={{ width:12,height:12,borderRadius:'50%',background:t.primary }} />
                      <span style={{ width:12,height:12,borderRadius:'50%',background:t.accent }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Currency Selection */}
          <div style={{ borderTop:'1px solid var(--color-border)',paddingTop:'var(--space-5)' }}>
            <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--fs-lg)',marginBottom:4,display:'flex',alignItems:'center',gap:8 }}>
              <DollarSign size={18} color="var(--color-warning)" />
              Default Display Currency
            </h3>
            <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)',marginBottom:'var(--space-4)' }}>
              All trip costs and estimations will automatically convert to this currency
            </p>

            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'var(--space-3)' }}>
              {Object.entries(CURRENCIES).map(([code, cur]) => {
                const isActive = currency === code;
                return (
                  <div
                    key={code}
                    onClick={() => setCurrency(code)}
                    style={{
                      padding:'var(--space-3) var(--space-4)',
                      borderRadius:'var(--radius-md)',
                      background: isActive ? 'var(--color-primary-glow)' : 'var(--color-surface2)',
                      border:`1.5px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      cursor:'pointer',
                      transition:'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ fontWeight:700,fontSize:'var(--fs-base)',color: isActive ? 'var(--color-primary-light)' : 'var(--color-text)' }}>
                      {cur.symbol} {code}
                    </div>
                    <div style={{ fontSize:'11px',color:'var(--color-text-muted)' }}>{cur.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instant Visa Requirements Checker */}
          <VisaChecker />

          {/* Jet Lag & Timezone Circadian Optimizer */}
          <JetLagPlanner />

          {/* Travel Document & Passport Expiry Tracker */}
          <DocumentExpiryTracker />

          {/* Emergency Contacts & Travel Reference Vault */}
          <EmergencyVault />

          {/* Regional Medical & Safety First-Aid Toolkit */}
          <SafetyFirstAidAI />
        </div>
      )}

      {tab === 'danger' && (
        <div className="card" style={{ borderColor:'rgba(239,68,68,0.3)' }}>
          <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'var(--color-danger)',marginBottom:'var(--space-2)' }}>
            Danger Zone
          </h3>
          <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-sm)',marginBottom:'var(--space-6)' }}>
            Permanent actions that cannot be undone.
          </p>
          <div style={{ display:'flex',flexDirection:'column',gap:'var(--space-4)' }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'var(--space-4)',background:'var(--color-surface2)',borderRadius:'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight:600,fontSize:'var(--fs-sm)' }}>Delete all trips</div>
                <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)' }}>Remove all your trip data from GlobeTrotter</div>
              </div>
              <button className="btn btn-danger btn-sm"
                onClick={() => { if (confirm('Delete all trips?')) { showToast('All trips deleted.', 'error') } }}>
                Delete Trips
              </button>
            </div>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'var(--space-4)',background:'rgba(239,68,68,0.05)',borderRadius:'var(--radius-md)',border:'1px solid rgba(239,68,68,0.2)' }}>
              <div>
                <div style={{ fontWeight:600,fontSize:'var(--fs-sm)',color:'var(--color-danger)' }}>Delete account</div>
                <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)' }}>Permanently remove your account and all data</div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={handleDelete} id="delete-account">
                <Trash2 size={13}/> Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Backup Modal */}
      <DataBackupModal isOpen={showBackup} onClose={() => setShowBackup(false)} />
    </div>
  )
}
