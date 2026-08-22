import { useApp } from '../context/AppContext'
import { cities, activities, demoUsers } from '../data/seed'
import { Users, Map, Globe, Activity, TrendingUp, Shield } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'

const COLORS = ['#6C63FF','#FF6584','#43E97B','#F7971E','#38BDF8']

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="card" style={{ display:'flex',alignItems:'center',gap:'var(--space-4)',padding:'var(--space-5)' }}>
      <div style={{ width:48,height:48,borderRadius:'var(--radius-lg)',background:`${color}20`,display:'flex',alignItems:'center',justifyContent:'center',color,flexShrink:0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:'var(--fs-2xl)',color }}>{value}</div>
        <div style={{ fontSize:'var(--fs-xs)',fontWeight:600,color:'var(--color-text)' }}>{label}</div>
        {sub && <div style={{ fontSize:'var(--fs-xs)',color:'var(--color-text-muted)' }}>{sub}</div>}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { trips, user } = useApp()

  // Stats
  const allUsers = [
    ...demoUsers.map(u => ({ ...u })),
    ...JSON.parse(localStorage.getItem('gt_registered_users')||'[]'),
  ]
  const totalActivities = trips.reduce((s,t) => s + t.stops?.reduce((ss,stop)=>ss+(stop.activities?.length||0),0), 0)

  // Top cities by stops count
  const cityCount = {}
  trips.forEach(t => t.stops?.forEach(s => { cityCount[s.cityName] = (cityCount[s.cityName]||0)+1 }))
  const topCities = Object.entries(cityCount).sort((a,b)=>b[1]-a[1]).slice(0,6)
    .map(([name,count]) => ({ name, count }))

  // Trips over time (last 6 months)
  const tripsByMonth = {}
  trips.forEach(t => {
    const month = new Date(t.createdAt).toLocaleString('default',{month:'short',year:'2-digit'})
    tripsByMonth[month] = (tripsByMonth[month]||0)+1
  })
  const trendData = Object.entries(tripsByMonth).map(([month,count]) => ({ month, Trips: count }))

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <div style={{ display:'flex',alignItems:'center',gap:'var(--space-3)' }}>
          <div style={{ width:40,height:40,borderRadius:'var(--radius-md)',background:'var(--grad-primary)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Shield size={20} color="#fff"/>
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize:'var(--fs-2xl)' }}>Admin Dashboard</h1>
            <p className="page-subtitle">Platform overview and analytics</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'var(--space-4)',marginBottom:'var(--space-8)' }}>
        <StatCard icon={<Users size={22}/>}    label="Total Users"       value={allUsers.length}       sub={`${allUsers.filter(u=>u.role==='admin').length} admins`} color="var(--color-primary)" />
        <StatCard icon={<Map size={22}/>}      label="Total Trips"       value={trips.length}           sub="All users"           color="var(--color-accent)" />
        <StatCard icon={<Globe size={22}/>}    label="Cities in DB"      value={cities.length}          sub="Available globally"  color="var(--color-success)" />
        <StatCard icon={<Activity size={22}/>} label="Total Activities"  value={totalActivities}        sub="Across all trips"    color="var(--color-warning)" />
      </div>

      {/* Charts */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-6)',marginBottom:'var(--space-8)' }}>
        {/* Trips Over Time */}
        <div className="card" style={{ padding:'var(--space-6)' }}>
          <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'var(--space-4)' }}>Trips Created Over Time</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill:'var(--color-text-muted)',fontSize:11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill:'var(--color-text-muted)',fontSize:11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-md)',fontSize:12 }} />
                <Line type="monotone" dataKey="Trips" stroke="#6C63FF" strokeWidth={2} dot={{ fill:'#6C63FF',strokeWidth:0,r:4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:200,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--color-text-muted)',fontSize:'var(--fs-sm)' }}>
              No data yet
            </div>
          )}
        </div>

        {/* Top Cities */}
        <div className="card" style={{ padding:'var(--space-6)' }}>
          <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'var(--space-4)' }}>Top Destinations</h3>
          {topCities.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topCities} layout="vertical" margin={{ left:20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill:'var(--color-text-muted)',fontSize:11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill:'var(--color-text-muted)',fontSize:11 }} tickLine={false} axisLine={false} width={80} />
                <Tooltip contentStyle={{ background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-md)',fontSize:12 }} />
                <Bar dataKey="count" fill="#FF6584" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:200,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--color-text-muted)',fontSize:'var(--fs-sm)' }}>
              No city data yet
            </div>
          )}
        </div>
      </div>

      {/* User Table */}
      <div className="card" style={{ padding:'var(--space-6)',marginBottom:'var(--space-6)',overflowX:'auto' }}>
        <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'var(--space-5)' }}>User Management</h3>
        <table style={{ width:'100%',borderCollapse:'collapse',fontSize:'var(--fs-sm)' }}>
          <thead>
            <tr style={{ borderBottom:'2px solid var(--color-border)' }}>
              {['User','Email','Role','Joined','Trips'].map(h => (
                <th key={h} style={{ textAlign:'left',padding:'var(--space-2) var(--space-3)',color:'var(--color-text-muted)',fontWeight:600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u, i) => {
              const userTripCount = trips.filter(t => t.userId === u.id).length
              return (
                <tr key={i} style={{ borderBottom:'1px solid var(--color-border)' }}>
                  <td style={{ padding:'var(--space-3)',fontWeight:600 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:'var(--space-2)' }}>
                      <div className="avatar-placeholder" style={{ width:28,height:28,fontSize:11,borderRadius:'50%' }}>
                        {u.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ padding:'var(--space-3)',color:'var(--color-text-muted)' }}>{u.email}</td>
                  <td style={{ padding:'var(--space-3)' }}>
                    <span className={`badge ${u.role==='admin'?'badge-accent':'badge-primary'}`}>{u.role}</span>
                  </td>
                  <td style={{ padding:'var(--space-3)',color:'var(--color-text-muted)' }}>{u.joinDate}</td>
                  <td style={{ padding:'var(--space-3)',fontWeight:600,color:'var(--color-primary-light)' }}>{userTripCount}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* All Trips Table */}
      <div className="card" style={{ padding:'var(--space-6)',overflowX:'auto' }}>
        <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'var(--space-5)' }}>All Trips</h3>
        <table style={{ width:'100%',borderCollapse:'collapse',fontSize:'var(--fs-sm)' }}>
          <thead>
            <tr style={{ borderBottom:'2px solid var(--color-border)' }}>
              {['Trip','Dates','Cities','Activities','Budget','Public'].map(h => (
                <th key={h} style={{ textAlign:'left',padding:'var(--space-2) var(--space-3)',color:'var(--color-text-muted)',fontWeight:600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trips.map((t, i) => {
              const actCount = t.stops?.reduce((s,st)=>s+(st.activities?.length||0),0)||0
              return (
                <tr key={i} style={{ borderBottom:'1px solid var(--color-border)' }}>
                  <td style={{ padding:'var(--space-3)',fontWeight:600 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:'var(--space-2)' }}>
                      <div style={{ width:10,height:10,borderRadius:'var(--radius-full)',background:t.coverColor||'var(--color-primary)',flexShrink:0 }} />
                      {t.name}
                    </div>
                  </td>
                  <td style={{ padding:'var(--space-3)',color:'var(--color-text-muted)',whiteSpace:'nowrap' }}>
                    {t.startDate} → {t.endDate}
                  </td>
                  <td style={{ padding:'var(--space-3)' }}>{t.stops?.length||0}</td>
                  <td style={{ padding:'var(--space-3)' }}>{actCount}</td>
                  <td style={{ padding:'var(--space-3)',color:'var(--color-warning)',fontWeight:600 }}>
                    {t.totalBudget>0?`$${t.totalBudget.toLocaleString()}`:'—'}
                  </td>
                  <td style={{ padding:'var(--space-3)' }}>
                    <span className={`badge ${t.isPublic?'badge-success':'badge-danger'}`}>{t.isPublic?'Yes':'No'}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
