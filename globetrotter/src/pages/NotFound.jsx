import { useNavigate } from 'react-router-dom'
import { Globe, Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight:'100vh',background:'var(--color-bg)',display:'flex',
      alignItems:'center',justifyContent:'center',padding:'var(--space-6)',
      flexDirection:'column',textAlign:'center',gap:'var(--space-6)',
    }}>
      <div style={{ fontSize:'6rem',animation:'float 3s ease-in-out infinite' }}>🌍</div>
      <div>
        <h1 style={{ fontFamily:'var(--font-display)',fontSize:'var(--fs-5xl)',fontWeight:800,
          background:'var(--grad-primary)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
          backgroundClip:'text',marginBottom:'var(--space-2)' }}>404</h1>
        <h2 style={{ fontFamily:'var(--font-display)',fontSize:'var(--fs-2xl)',fontWeight:700,marginBottom:'var(--space-3)' }}>
          Lost in Transit
        </h2>
        <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-md)',maxWidth:400 }}>
          Looks like this destination doesn't exist on our map. Let's get you back on track.
        </p>
      </div>
      <div style={{ display:'flex',gap:'var(--space-3)' }}>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
          <Home size={18}/> Go Home
        </button>
        <button className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  )
}
