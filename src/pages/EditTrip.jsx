import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ArrowLeft, Save, Calendar } from 'lucide-react'

const COVER_COLORS = ['#6C63FF','#FF6584','#43E97B','#F7971E','#38BDF8','#a855f7','#f43f5e','#10b981','#f59e0b','#06b6d4']

export default function EditTrip() {
  const { tripId } = useParams()
  const { trips, dispatch, showToast } = useApp()
  const navigate = useNavigate()
  const trip = trips.find(t => t.id === tripId)

  const [form, setForm] = useState({
    name: trip?.name||'', description: trip?.description||'',
    startDate: trip?.startDate||'', endDate: trip?.endDate||'',
    totalBudget: String(trip?.totalBudget||''),
    coverColor: trip?.coverColor||COVER_COLORS[0],
    isPublic: trip?.isPublic||false,
  })
  const [saving, setSaving] = useState(false)

  if (!trip) return (
    <div className="page-container">
      <div className="card empty-state"><p>Trip not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/trips')}>Back</button>
      </div>
    </div>
  )

  const f = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    dispatch({ type:'UPDATE_TRIP', payload: { ...trip, ...form, totalBudget: Number(form.totalBudget)||0 } })
    showToast('Trip updated!', 'success')
    navigate(`/trips/${trip.id}/view`)
  }

  return (
    <div className="page-container animate-fadeIn" style={{ maxWidth:680 }}>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom:'var(--space-4)' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={14}/> Back
      </button>
      <div className="page-header">
        <h1 className="page-title">Edit Trip ✏️</h1>
      </div>
      <form onSubmit={handleSave}>
        <div className="card" style={{ display:'flex',flexDirection:'column',gap:'var(--space-5)' }}>
          {/* Color */}
          <div className="form-group">
            <label className="form-label">Color Theme</label>
            <div style={{ display:'flex',gap:'var(--space-2)',flexWrap:'wrap' }}>
              {COVER_COLORS.map(color => (
                <button key={color} type="button" onClick={() => f('coverColor', color)} style={{
                  width:28,height:28,borderRadius:'var(--radius-full)',background:color,
                  border:`3px solid ${form.coverColor===color?'#fff':'transparent'}`,
                  boxShadow:form.coverColor===color?`0 0 0 2px ${color}`:'none',cursor:'pointer',
                }} />
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Trip Name</label>
            <input className="form-input" value={form.name} onChange={e => f('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" value={form.description} onChange={e => f('description', e.target.value)} rows={3} />
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-input" style={{ colorScheme:'dark' }} value={form.startDate} onChange={e => f('startDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input type="date" className="form-input" style={{ colorScheme:'dark' }} value={form.endDate} onChange={e => f('endDate', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Total Budget (USD)</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)' }}>$</span>
              <input type="number" className="form-input" style={{ paddingLeft:28 }} value={form.totalBudget} onChange={e => f('totalBudget', e.target.value)} min={0} />
            </div>
          </div>
          {/* Public toggle */}
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'var(--space-4)',background:'var(--color-surface2)',borderRadius:'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight:600,fontSize:'var(--fs-sm)' }}>Make trip public</div>
              <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)',marginTop:2 }}>Others can view and copy your itinerary</div>
            </div>
            <button type="button" role="switch" aria-checked={form.isPublic} onClick={() => f('isPublic',!form.isPublic)} style={{
              width:48,height:26,borderRadius:'var(--radius-full)',
              background:form.isPublic?'var(--color-primary)':'var(--color-surface3)',
              position:'relative',border:'none',cursor:'pointer',transition:'background var(--transition-base)',flexShrink:0,
            }}>
              <span style={{ position:'absolute',top:3,left:form.isPublic?25:3,width:20,height:20,borderRadius:'var(--radius-full)',background:'#fff',transition:'left var(--transition-base)',boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }} />
            </button>
          </div>
          <div style={{ display:'flex',gap:'var(--space-3)',justifyContent:'flex-end',borderTop:'1px solid var(--color-border)',paddingTop:'var(--space-5)' }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving?<><div className="spinner" style={{ width:15,height:15,borderWidth:2 }}/> Saving...</>:<><Save size={15}/> Save Changes</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
