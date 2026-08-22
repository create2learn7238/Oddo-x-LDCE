import { useState, useRef } from 'react'
import { Download, Upload, Database, Check, AlertTriangle, FileJson, RefreshCw } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function DataBackupModal({ isOpen, onClose }) {
  const { trips, user, favorites, dispatch, showToast } = useApp()
  const fileInputRef = useRef(null)
  const [restoring, setRestoring] = useState(false)

  if (!isOpen) return null

  const handleExport = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user,
      trips,
      favorites,
      pnr: localStorage.getItem('gt_pnr') || '',
      insurance: localStorage.getItem('gt_insurance') || '',
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `globetrotter_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Backup file downloaded successfully!', 'success')
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setRestoring(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.trips && Array.isArray(data.trips)) {
          // Restore trips into state & local storage
          data.trips.forEach(trip => {
            dispatch({ type: 'ADD_TRIP', payload: trip })
          })
          if (data.pnr) localStorage.setItem('gt_pnr', data.pnr)
          if (data.insurance) localStorage.setItem('gt_insurance', data.insurance)

          showToast(`Successfully restored ${data.trips.length} trips!`, 'success')
          setRestoring(false)
          onClose()
        } else {
          showToast('Invalid backup file format.', 'error')
          setRestoring(false)
        }
      } catch (err) {
        showToast('Failed to parse backup JSON file.', 'error')
        setRestoring(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-light)' }}>
              <Database size={20} />
            </div>
            <div>
              <h3 className="modal-title">Data Backup & Export</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)' }}>
                Export your trips or restore from a JSON file
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', margin: 'var(--space-4) 0' }}>
          {/* Export Action Card */}
          <div style={{
            padding: 'var(--space-5)',
            background: 'var(--color-surface2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileJson size={16} color="var(--color-primary-light)" />
                Download JSON Backup
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
                Save all {trips.length} itineraries and notes to your disk
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleExport}>
              <Download size={14} /> Export Backup
            </button>
          </div>

          {/* Import Action Card */}
          <div style={{
            padding: 'var(--space-5)',
            background: 'var(--color-surface2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Upload size={16} color="var(--color-warning)" />
                Restore from Backup
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
                Load itineraries from an existing JSON backup
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={restoring}
            >
              {restoring ? <RefreshCw size={14} className="spinner" /> : <><Upload size={14} /> Upload File</>}
            </button>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: 'var(--space-4)' }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
