import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Calendar, FileText, Image, ArrowRight, X } from 'lucide-react'

const COVER_COLORS = [
  '#6C63FF','#FF6584','#43E97B','#F7971E','#38BDF8','#a855f7','#f43f5e','#10b981','#f59e0b','#06b6d4'
]

export default function CreateTrip() {
  const { user, dispatch, showToast } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', description: '', startDate: '', endDate: '',
    totalBudget: '', coverColor: COVER_COLORS[0], isPublic: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Trip name is required'
    if (!form.startDate) e.startDate = 'Start date is required'
    if (!form.endDate) e.endDate = 'End date is required'
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate))
      e.endDate = 'End date must be after start date'
    if (form.totalBudget && isNaN(Number(form.totalBudget))) e.totalBudget = 'Must be a number'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const newTrip = {
      id: `trip_${Date.now()}`,
      userId: user.id,
      name: form.name.trim(),
      description: form.description.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      totalBudget: Number(form.totalBudget) || 0,
      coverColor: form.coverColor,
      isPublic: form.isPublic,
      stops: [],
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_TRIP', payload: newTrip })
    showToast(`"${newTrip.name}" created! Now build your itinerary.`, 'success')
    navigate(`/trips/${newTrip.id}/build`)
  }

  const f = (key, val) => {
    setForm(p => ({ ...p, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  return (
    <div className="page-container animate-fadeIn" style={{ maxWidth:680 }}>
      <div className="page-header">
        <h1 className="page-title">Plan New Trip ✈️</h1>
        <p className="page-subtitle">Set the foundation for your perfect journey</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card" style={{ display:'flex',flexDirection:'column',gap:'var(--space-6)' }}>

          {/* Cover Color */}
          <div className="form-group">
            <label className="form-label">Trip Color Theme</label>
            <div style={{ display:'flex',gap:'var(--space-2)',flexWrap:'wrap' }}>
              {COVER_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => f('coverColor', color)}
                  style={{
                    width:32,height:32,borderRadius:'var(--radius-full)',
                    background:color,border:'3px solid',
                    borderColor: form.coverColor === color ? '#fff' : 'transparent',
                    cursor:'pointer',transition:'all var(--transition-fast)',
                    boxShadow: form.coverColor === color ? `0 0 0 2px ${color}` : 'none',
                  }}
                  title={color}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
            {/* Preview banner */}
            <div style={{
              height:6,borderRadius:'var(--radius-full)',marginTop:'var(--space-2)',
              background:`linear-gradient(90deg, ${form.coverColor}, ${form.coverColor}99)`,
              transition:'background var(--transition-base)',
            }} />
          </div>

          {/* Trip Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="trip-name">Trip Name *</label>
            <input
              id="trip-name"
              type="text"
              className={`form-input ${errors.name?'error':''}`}
              placeholder="e.g. European Summer 2026"
              value={form.name}
              onChange={e => f('name', e.target.value)}
              maxLength={80}
            />
            {errors.name && <span style={{ color:'var(--color-danger)',fontSize:'var(--fs-xs)' }}>{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="trip-desc">
              Description <span style={{ color:'var(--color-text-faint)' }}>(optional)</span>
            </label>
            <textarea
              id="trip-desc"
              className="form-input form-textarea"
              placeholder="What's this trip about? Share your vision..."
              value={form.description}
              onChange={e => f('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Dates */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="trip-start">Start Date *</label>
              <div style={{ position:'relative' }}>
                <Calendar size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
                <input
                  id="trip-start"
                  type="date"
                  className={`form-input ${errors.startDate?'error':''}`}
                  style={{ paddingLeft:38,colorScheme:'dark' }}
                  value={form.startDate}
                  onChange={e => f('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.startDate && <span style={{ color:'var(--color-danger)',fontSize:'var(--fs-xs)' }}>{errors.startDate}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="trip-end">End Date *</label>
              <div style={{ position:'relative' }}>
                <Calendar size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
                <input
                  id="trip-end"
                  type="date"
                  className={`form-input ${errors.endDate?'error':''}`}
                  style={{ paddingLeft:38,colorScheme:'dark' }}
                  value={form.endDate}
                  onChange={e => f('endDate', e.target.value)}
                  min={form.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.endDate && <span style={{ color:'var(--color-danger)',fontSize:'var(--fs-xs)' }}>{errors.endDate}</span>}
            </div>
          </div>

          {/* Budget */}
          <div className="form-group">
            <label className="form-label" htmlFor="trip-budget">
              Total Budget (USD) <span style={{ color:'var(--color-text-faint)' }}>(optional)</span>
            </label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',fontSize:'var(--fs-sm)' }}>$</span>
              <input
                id="trip-budget"
                type="number"
                className={`form-input ${errors.totalBudget?'error':''}`}
                style={{ paddingLeft:28 }}
                placeholder="5000"
                value={form.totalBudget}
                onChange={e => f('totalBudget', e.target.value)}
                min={0}
              />
            </div>
            {errors.totalBudget && <span style={{ color:'var(--color-danger)',fontSize:'var(--fs-xs)' }}>{errors.totalBudget}</span>}
          </div>

          {/* Public toggle */}
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'var(--space-4)',background:'var(--color-surface2)',borderRadius:'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight:600,fontSize:'var(--fs-sm)' }}>Make trip public</div>
              <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)',marginTop:2 }}>
                Others can view and copy your itinerary
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.isPublic}
              onClick={() => f('isPublic', !form.isPublic)}
              style={{
                width:48,height:26,borderRadius:'var(--radius-full)',
                background: form.isPublic ? 'var(--color-primary)' : 'var(--color-surface3)',
                position:'relative',transition:'background var(--transition-base)',
                border:'none',cursor:'pointer',flexShrink:0,
              }}
            >
              <span style={{
                position:'absolute',top:3,left: form.isPublic ? 25 : 3,
                width:20,height:20,borderRadius:'var(--radius-full)',
                background:'#fff',transition:'left var(--transition-base)',
                boxShadow:'0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>

          {/* Actions */}
          <div style={{ display:'flex',gap:'var(--space-3)',justifyContent:'flex-end',borderTop:'1px solid var(--color-border)',paddingTop:'var(--space-6)' }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/trips')}>
              Cancel
            </button>
            <button type="submit" id="create-trip-submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <><div className="spinner" style={{ width:16,height:16,borderWidth:2 }} /> Creating...</>
              ) : (
                <>Create Trip <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
