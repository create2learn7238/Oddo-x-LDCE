import { useState } from 'react'
import { PhoneCall, ShieldAlert, FileText, Plus, Trash2, Check } from 'lucide-react'

const DEFAULT_CONTACTS = [
  { name: 'National Emergency Helpline (India)', number: '112', type: 'Emergency' },
  { name: 'Police Assistance', number: '100', type: 'Police' },
  { name: 'Ambulance & Medical Emergency', number: '108', type: 'Medical' },
  { name: 'Gujarat Tourism 24x7 Helpline', number: '1800 200 5080', type: 'Tourism' },
  { name: 'Women Safety Helpline', number: '1091', type: 'Safety' },
  { name: 'Railway / Train Enquiry & Assistance', number: '139', type: 'Transit' }
]

export default function EmergencyVault() {
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS)
  const [pnr, setPnr] = useState(localStorage.getItem('gt_pnr') || '')
  const [insurance, setInsurance] = useState(localStorage.getItem('gt_insurance') || '')
  const [saved, setSaved] = useState(false)

  const handleSaveDocs = () => {
    localStorage.setItem('gt_pnr', pnr)
    localStorage.setItem('gt_insurance', insurance)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={20} color="var(--color-danger)" />
            Emergency Contacts & Travel Vault
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Instant offline access to emergency helplines and booking references
          </p>
        </div>
        <span className="badge badge-danger">24x7 Emergency Ready</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Helplines List */}
        <div>
          <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-text)' }}>
            🚨 Key Helplines (Gujarat & India)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {contacts.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3)',
                  background: 'var(--color-surface2)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--fs-xs)' }}>{c.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{c.type}</div>
                </div>
                <a
                  href={`tel:${c.number.replace(/\s+/g, '')}`}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '3px 8px', color: 'var(--color-success)' }}
                >
                  <PhoneCall size={11} /> {c.number}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Documents & Booking Reference Notes */}
        <div>
          <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-text)' }}>
            📋 Booking References & Policy Numbers
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Flight / Train PNR Numbers</label>
              <input
                className="form-input"
                placeholder="e.g. 6E-2849 / 2489104820"
                value={pnr}
                onChange={e => setPnr(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Travel Insurance Policy No.</label>
              <input
                className="form-input"
                placeholder="e.g. REL-TRV-2026-9814"
                value={insurance}
                onChange={e => setInsurance(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleSaveDocs} style={{ width: 'fit-content', marginTop: 4 }}>
              {saved ? <><Check size={13} /> Saved to Local Vault</> : 'Save Reference Notes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
