import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { registerUser } from '../utils/auth'

export default function Signup() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const passwordStrength = (p) => {
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }
  const strength = passwordStrength(form.password)
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', 'var(--color-danger)', 'var(--color-warning)', 'var(--color-info)', 'var(--color-success)']

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setServerError('')
    const result = await registerUser(form.name.trim(), form.email, form.password)
    setLoading(false)
    if (result && result.success) {
      login(result.user)
      navigate('/dashboard')
    } else {
      setServerError(result?.error || 'Failed to register account.')
    }
  }

  const field = (key, value, onChange) => {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
    onChange && onChange(value)
  }

  return (
    <div className="auth-card animate-scaleIn">
      <div className="auth-logo">
        <div className="auth-logo-icon">
          <Globe size={24} color="#fff" />
        </div>
        <span className="auth-logo-text">GlobeTrotter</span>
      </div>

      <h2 className="auth-title">Create your account</h2>
      <p className="auth-subtitle">Start planning your dream trips today</p>

      {serverError && (
        <div style={{
          background: 'var(--color-danger-bg)',
          border: '1px solid rgba(255,77,109,0.3)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          color: 'var(--color-danger)',
          fontSize: 'var(--fs-sm)',
          marginBottom: 'var(--space-4)',
        }}>
          {serverError}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="signup-name">Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
            <input
              id="signup-name"
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              style={{ paddingLeft: 40 }}
              placeholder="Jane Doe"
              value={form.name}
              onChange={e => field('name', e.target.value)}
              autoComplete="name"
            />
          </div>
          {errors.name && <span style={{ color:'var(--color-danger)',fontSize:'var(--fs-xs)' }}>{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="signup-email">Email address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
            <input
              id="signup-email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              style={{ paddingLeft: 40 }}
              placeholder="you@example.com"
              value={form.email}
              onChange={e => field('email', e.target.value)}
              autoComplete="email"
            />
          </div>
          {errors.email && <span style={{ color:'var(--color-danger)',fontSize:'var(--fs-xs)' }}>{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="signup-password">Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
            <input
              id="signup-password"
              type={showPass ? 'text' : 'password'}
              className={`form-input ${errors.password ? 'error' : ''}`}
              style={{ paddingLeft: 40, paddingRight: 44 }}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => field('password', e.target.value)}
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPass(s => !s)} style={{
              position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',
              background:'none',border:'none',cursor:'pointer',color:'var(--color-text-faint)',padding:4,
            }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {form.password && (
            <div style={{ display:'flex',alignItems:'center',gap:'var(--space-2)',marginTop:'var(--space-1)' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  flex:1, height:3, borderRadius:'var(--radius-full)',
                  background: i <= strength ? strengthColor[strength] : 'var(--color-surface3)',
                  transition:'background var(--transition-base)'
                }} />
              ))}
              <span style={{ fontSize:'var(--fs-xs)',color:strengthColor[strength],minWidth:36,fontWeight:600 }}>
                {strengthLabel[strength]}
              </span>
            </div>
          )}
          {errors.password && <span style={{ color:'var(--color-danger)',fontSize:'var(--fs-xs)' }}>{errors.password}</span>}
        </div>

        {/* Confirm */}
        <div className="form-group">
          <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
            <input
              id="signup-confirm"
              type="password"
              className={`form-input ${errors.confirm ? 'error' : ''}`}
              style={{ paddingLeft: 40, paddingRight: 44 }}
              placeholder="Repeat password"
              value={form.confirm}
              onChange={e => field('confirm', e.target.value)}
              autoComplete="new-password"
            />
            {form.confirm && form.password === form.confirm && (
              <Check size={16} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-success)' }} />
            )}
          </div>
          {errors.confirm && <span style={{ color:'var(--color-danger)',fontSize:'var(--fs-xs)' }}>{errors.confirm}</span>}
        </div>

        <button
          type="submit"
          id="signup-submit"
          className="btn btn-primary"
          style={{ width:'100%',justifyContent:'center',gap:'var(--space-2)',marginTop:'var(--space-2)' }}
          disabled={loading}
        >
          {loading ? (
            <><div className="spinner" style={{ width:16,height:16,borderWidth:2 }} /> Creating account...</>
          ) : (
            <>Create Account <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <p style={{ textAlign:'center',marginTop:'var(--space-6)',fontSize:'var(--fs-sm)',color:'var(--color-text-muted)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color:'var(--color-primary-light)',fontWeight:600 }}>Sign in</Link>
      </p>
    </div>
  )
}
