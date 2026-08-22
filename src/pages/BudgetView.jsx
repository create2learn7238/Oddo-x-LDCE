import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Edit3, ArrowLeft } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts'
import ExpenseSplitter from '../components/ExpenseSplitter'
import BudgetOptimizer from '../components/BudgetOptimizer'
import BudgetSimulator from '../components/BudgetSimulator'
import FuelTollEstimator from '../components/FuelTollEstimator'

const COLORS = ['#6C63FF','#FF6584','#43E97B','#F7971E','#38BDF8','#a855f7']

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' })
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background:'var(--color-surface)',border:'1px solid var(--color-border)',
        borderRadius:'var(--radius-md)',padding:'var(--space-3) var(--space-4)',
        fontSize:'var(--fs-sm)',boxShadow:'var(--shadow-md)',
      }}>
        <div style={{ fontWeight:600,marginBottom:4 }}>{payload[0].name}</div>
        <div style={{ color:'var(--color-warning)' }}>${payload[0].value?.toLocaleString()}</div>
      </div>
    )
  }
  return null
}

export default function BudgetView() {
  const { tripId } = useParams()
  const { trips, dispatch, showToast, formatPrice } = useApp()
  const navigate = useNavigate()
  const [budgetEdit, setBudgetEdit] = useState('')
  const [editing, setEditing] = useState(false)

  const trip = trips.find(t => t.id === tripId)

  if (!trip) return (
    <div className="page-container">
      <div className="card empty-state">
        <p>Trip not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/trips')}>Back</button>
      </div>
    </div>
  )

  // ── Cost calculations ──────────────────────────────────────
  const stopData = trip.stops?.map(stop => {
    const nights = Math.max(0, Math.ceil((new Date(stop.endDate)-new Date(stop.startDate))/(1000*60*60*24)))
    const actCost = stop.activities?.reduce((s,a)=>s+(a.cost||0),0) || 0
    const accomCost = (stop.accommodationCost||0) * nights
    const transport = stop.transportCost || 0
    return { cityName: stop.cityName, emoji: stop.emoji, actCost, accomCost, transport, total: actCost+accomCost+transport, nights }
  }) || []

  const totals = stopData.reduce((acc, s) => ({
    activities: acc.activities + s.actCost,
    accommodation: acc.accommodation + s.accomCost,
    transport: acc.transport + s.transport,
  }), { activities:0, accommodation:0, transport:0 })

  const grandTotal = totals.activities + totals.accommodation + totals.transport
  const budget = trip.totalBudget || 0
  const remaining = budget - grandTotal
  const overBudget = grandTotal > budget && budget > 0
  const avgPerDay = stopData.reduce((s,d)=>s+d.nights,0) > 0 ? Math.round(grandTotal / Math.max(1, stopData.reduce((s,d)=>s+d.nights,0))) : 0

  // ── Pie data ──────────────────────────────────────────────
  const pieData = [
    { name:'Activities', value: totals.activities },
    { name:'Accommodation', value: totals.accommodation },
    { name:'Transport', value: totals.transport },
  ].filter(d => d.value > 0)

  // ── Bar data (per city) ───────────────────────────────────
  const barData = stopData.map(s => ({
    name: `${s.emoji}${s.cityName}`,
    Activities: s.actCost,
    Accommodation: s.accomCost,
    Transport: s.transport,
  }))

  const saveBudget = () => {
    const val = Number(budgetEdit)
    if (!isNaN(val) && val >= 0) {
      dispatch({ type:'UPDATE_TRIP', payload: { ...trip, totalBudget: val } })
      showToast('Budget updated!', 'success')
      setEditing(false)
    }
  }

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <div className="flex-between" style={{ flexWrap:'wrap',gap:'var(--space-4)' }}>
          <div>
            <h1 className="page-title" style={{ fontSize:'var(--fs-2xl)' }}>
              💰 Budget Overview
            </h1>
            <p className="page-subtitle">{trip.name}</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/trips/${trip.id}/build`)}>
            <ArrowLeft size={14} /> Back to Builder
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {overBudget && (
        <div style={{
          background:'var(--color-danger-bg)',border:'1px solid rgba(239,68,68,0.3)',
          borderRadius:'var(--radius-lg)',padding:'var(--space-4) var(--space-6)',
          marginBottom:'var(--space-6)',display:'flex',alignItems:'center',gap:'var(--space-3)',
        }}>
          <span style={{ fontSize:'1.4rem' }}>⚠️</span>
          <div>
            <div style={{ fontWeight:700,color:'var(--color-danger)' }}>Over Budget Alert</div>
            <div style={{ fontSize:'var(--fs-sm)',color:'var(--color-text-muted)' }}>
              Estimated cost exceeds your budget by {formatPrice(Math.abs(remaining))}.
            </div>
          </div>
        </div>
      )}

      {/* Top Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'var(--space-4)',marginBottom:'var(--space-8)' }}>
        {[
          { label:'Total Estimated Cost', value: formatPrice(grandTotal), sub:'All stops combined', color:'var(--color-primary)' },
          { label:'Budget Target', value: budget>0 ? formatPrice(budget) : 'Not set',
            sub: budget>0 ? (overBudget?'Exceeded':'Within budget') : 'Click to set',
            color: budget>0 ? (overBudget?'var(--color-danger)':'var(--color-success)') : 'var(--color-text-muted)',
            action: () => { setEditing(true); setBudgetEdit(String(budget||'')) },
          },
          { label:'Remaining Balance', value: budget>0 ? formatPrice(Math.abs(remaining)) : '—',
            sub: budget>0 ? (overBudget?'Over budget':`${formatPrice(remaining)} left`) : '-',
            color: budget>0 ? (overBudget?'var(--color-danger)':'var(--color-success)') : 'var(--color-text-muted)'
          },
          { label:'Avg Cost / Day', value: formatPrice(avgPerDay), sub:'Across all trip days', color:'var(--color-info)' },
        ].map(({ label, value, sub, color, action }) => (
          <div key={label} className="card" style={{ textAlign:'center',padding:'var(--space-5)',cursor:action?'pointer':'default' }}
            onClick={action}>
            <div style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:'var(--fs-xl)',color,marginBottom:4 }}>{value}</div>
            <div style={{ fontSize:'var(--fs-xs)',fontWeight:600,marginBottom:2 }}>{label}</div>
            <div style={{ fontSize:'var(--fs-xs)',color:'var(--color-text-muted)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Budget Edit Modal */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth:360 }}>
            <h2 className="modal-title" style={{ marginBottom:'var(--space-4)' }}>Set Trip Budget</h2>
            <div className="form-group" style={{ marginBottom:'var(--space-4)' }}>
              <label className="form-label">Total Budget (USD)</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)' }}>$</span>
                <input type="number" className="form-input" style={{ paddingLeft:28 }}
                  value={budgetEdit} onChange={e => setBudgetEdit(e.target.value)} autoFocus min={0} />
              </div>
            </div>
            <div style={{ display:'flex',gap:'var(--space-3)',justifyContent:'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveBudget}>Save Budget</button>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {budget > 0 && (
        <div className="card" style={{ marginBottom:'var(--space-6)',padding:'var(--space-5) var(--space-6)' }}>
          <div className="flex-between" style={{ marginBottom:'var(--space-3)' }}>
            <span style={{ fontSize:'var(--fs-sm)',fontWeight:600 }}>Budget Progress</span>
            <span style={{ fontSize:'var(--fs-sm)',color: overBudget?'var(--color-danger)':'var(--color-success)',fontWeight:600 }}>
              {Math.round((grandTotal/budget)*100)}%
            </span>
          </div>
          <div className="progress-bar" style={{ height:10 }}>
            <div className="progress-fill" style={{
              width:`${Math.min(100,(grandTotal/budget)*100)}%`,
              background: overBudget ? 'var(--color-danger)' : 'var(--grad-primary)',
            }} />
          </div>
        </div>
      )}

      {/* AI Smart Budget Optimizer */}
      <BudgetOptimizer trip={trip} />

      {/* Charts Row */}
      {grandTotal > 0 && (
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:'var(--space-6)',marginBottom:'var(--space-8)' }}>
          {/* Pie Chart */}
          <div className="card" style={{ padding:'var(--space-6)' }}>
            <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'var(--space-4)' }}>By Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:'flex',flexDirection:'column',gap:'var(--space-2)',marginTop:'var(--space-2)' }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'var(--fs-xs)' }}>
                  <div style={{ display:'flex',alignItems:'center',gap:'var(--space-2)' }}>
                    <div style={{ width:10,height:10,borderRadius:2,background:COLORS[i%COLORS.length],flexShrink:0 }} />
                    <span style={{ color:'var(--color-text-muted)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontWeight:600 }}>${d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="card" style={{ padding:'var(--space-6)' }}>
            <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'var(--space-4)' }}>By City</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top:5,right:5,bottom:5,left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill:'var(--color-text-muted)',fontSize:11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill:'var(--color-text-muted)',fontSize:11 }} tickLine={false} axisLine={false} tickFormatter={v=>`$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize:12,color:'var(--color-text-muted)' }} />
                <Bar dataKey="Activities"    fill={COLORS[0]} radius={[4,4,0,0]} />
                <Bar dataKey="Accommodation" fill={COLORS[1]} radius={[4,4,0,0]} />
                <Bar dataKey="Transport"     fill={COLORS[2]} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Group Travel Expense Splitter */}
      <ExpenseSplitter grandTotal={grandTotal} />

      {/* Interactive Trip Cost What-If Simulator */}
      <BudgetSimulator trip={trip} />

      {/* Road Trip Fuel & Fastag Toll Calculator */}
      <FuelTollEstimator />

      {/* Breakdown Table */}
      <div className="card" style={{ padding:'var(--space-6)',overflowX:'auto' }}>
        <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'var(--space-5)' }}>Detailed Breakdown</h3>
        <table style={{ width:'100%',borderCollapse:'collapse',fontSize:'var(--fs-sm)' }}>
          <thead>
            <tr style={{ borderBottom:'2px solid var(--color-border)' }}>
              {['City','Nights','Accommodation','Transport','Activities','Total'].map(h => (
                <th key={h} style={{ textAlign:h==='City'?'left':'right',padding:'var(--space-2) var(--space-3)',color:'var(--color-text-muted)',fontWeight:600,whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stopData.map((s, i) => (
              <tr key={i} style={{ borderBottom:'1px solid var(--color-border)' }}>
                <td style={{ padding:'var(--space-3)',fontWeight:600 }}>{s.emoji} {s.cityName}</td>
                <td style={{ padding:'var(--space-3)',textAlign:'right',color:'var(--color-text-muted)' }}>{s.nights}</td>
                <td style={{ padding:'var(--space-3)',textAlign:'right' }}>{formatPrice(s.accomCost)}</td>
                <td style={{ padding:'var(--space-3)',textAlign:'right' }}>{formatPrice(s.transport)}</td>
                <td style={{ padding:'var(--space-3)',textAlign:'right' }}>{formatPrice(s.actCost)}</td>
                <td style={{ padding:'var(--space-3)',textAlign:'right',fontWeight:700,color:'var(--color-warning)' }}>{formatPrice(s.total)}</td>
              </tr>
            ))}
            <tr style={{ borderTop:'2px solid var(--color-border)',background:'var(--color-surface2)' }}>
              <td colSpan={5} style={{ padding:'var(--space-3)',fontWeight:700 }}>Grand Total</td>
              <td style={{ padding:'var(--space-3)',textAlign:'right',fontWeight:800,fontSize:'var(--fs-md)',color:'var(--color-primary-light)' }}>
                {formatPrice(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
