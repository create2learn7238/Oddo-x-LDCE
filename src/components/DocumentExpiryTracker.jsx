import { useState, useEffect } from 'react'
import { ShieldCheck, AlertTriangle, FileText, Plus, Trash2, CheckCircle2, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'

const DEFAULT_DOCS = [
  { id: 'doc-1', name: 'Primary Passport', type: 'Passport', expiryDate: '2028-09-15', number: 'Z9847291' },
  { id: 'doc-2', name: 'International Driving Permit', type: 'Driving Permit', expiryDate: '2027-03-20', number: 'GJ-01-2024' },
  { id: 'doc-3', name: 'Travel Medical Insurance', type: 'Insurance', expiryDate: '2026-12-31', number: 'POL-99381' }
]

export default function DocumentExpiryTracker() {
  const { showToast } = useApp()
  const [docs, setDocs] = useState(() => {
    try {
      const saved = localStorage.getItem('gt_docs')
      return saved ? JSON.parse(saved) : DEFAULT_DOCS
    } catch {
      return DEFAULT_DOCS
    }
  })

  const [showAdd, setShowAdd] = useState(false)
  const [newDoc, setNewDoc] = useState({ name: '', type: 'Passport', expiryDate: '', number: '' })

  const saveDocs = (newDocs) => {
    setDocs(newDocs)
    localStorage.setItem('gt_docs', JSON.stringify(newDocs))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newDoc.name || !newDoc.expiryDate) return

    const created = { ...newDoc, id: `doc-${Date.now()}` }
    saveDocs([...docs, created])
    setNewDoc({ name: '', type: 'Passport', expiryDate: '', number: '' })
    setShowAdd(false)
    showToast('Travel document added to secure tracker!', 'success')
  }

  const handleDelete = (id) => {
    saveDocs(docs.filter(d => d.id !== id))
    showToast('Document removed', 'info')
  }

  const getStatus = (expDate) => {
    const today = new Date()
    const exp = new Date(expDate + 'T00:00:00')
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { label: 'Expired', badge: 'badge-danger', icon: '❌', alert: true }
    if (diffDays < 180) return { label: `${diffDays} Days (Renew Soon)`, badge: 'badge-warning', icon: '⚠️', alert: true }
    return { label: `Valid (${Math.round(diffDays / 30)} mos)`, badge: 'badge-success', icon: '✅', alert: false }
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={20} color="var(--color-primary)" />
            Travel Document & Passport Expiry Tracker
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            6-month international passport validity monitor and document safe
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={14} /> {showAdd ? 'Cancel' : 'Add Document'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: 'var(--color-surface2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
          <input className="form-input" placeholder="Doc Name (e.g. US Visa)" value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} required />
          <select className="form-input" value={newDoc.type} onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}>
            {['Passport', 'Visa', 'Driving Permit', 'Insurance', 'Govt Photo ID'].map(t => (
              <option key={t} value={t} style={{ background: 'var(--color-surface)' }}>{t}</option>
            ))}
          </select>
          <input type="date" className="form-input" value={newDoc.expiryDate} onChange={e => setNewDoc({ ...newDoc, expiryDate: e.target.value })} required />
          <input className="form-input" placeholder="Number / Reference" value={newDoc.number} onChange={e => setNewDoc({ ...newDoc, number: e.target.value })} />
          <button type="submit" className="btn btn-primary btn-sm" style={{ gridColumn: '1 / -1' }}>
            <CheckCircle2 size={14} /> Save Document
          </button>
        </form>
      )}

      {/* Docs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
        {docs.map(doc => {
          const status = getStatus(doc.expiryDate)
          return (
            <div key={doc.id} style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="flex-between" style={{ marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)' }}>{doc.name}</div>
                  <span className={`badge ${status.badge}`} style={{ fontSize: '10px' }}>
                    {status.icon} {status.label}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 2 }}>
                  Type: <strong>{doc.type}</strong> · Ref: {doc.number || 'N/A'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Expires: <strong style={{ color: 'var(--color-text)' }}>{doc.expiryDate}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 6 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(doc.id)} style={{ color: 'var(--color-danger)', padding: '2px 6px', fontSize: '11px' }}>
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
