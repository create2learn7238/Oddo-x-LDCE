import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, Shield } from 'lucide-react'
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

  const field = (key, value) => {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  return (
    <div className="auth-card animate-scaleIn">
      {/* Brand Header */}
      <div className="auth-logo">
        <div className="auth-logo-icon">
          <Globe size={26} color="#fff" />
        </div>
        <span className="auth-logo-text">GlobeTrotter</span>
      </div>

      <h2 className="auth-title">Create Explorer Account</h2>
      <p className="auth-subtitle">Join thousands planning Gujarat & Global expeditions</p>

      {serverError && (
        <div style={{
          background: 'var(--color-danger-bg)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          color: 'var(--color-danger)',
          fontSize: 'var(--fs-xs)',
          fontWeight: 600,
          marginBottom: 'var(--space-4)',
        }}>
          ⚠️ {serverError}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="signup-name">Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)', pointerEvents: 'none' }} />
            <input
              id="signup-name"
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              style={{ paddingLeft: 42 }}
              placeholder="Jane Doe"
              value={form.name}
              onChange={e => field('name', e.target.value)}
              autoComplete="name"
            />
          </div>
          {errors.name && <span style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-xs)', fontWeight: 600 }}>{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="signup-email">Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)', pointerEvents: 'none' }} />
            <input
              id="signup-email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              style={{ paddingLeft: 42 }}
              placeholder="you@example.com"
              value={form.email}
              onChange={e => field('email', e.target.value)}
              autoComplete="email"
            />
          </div>
          {errors.email && <span style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-xs)', fontWeight: 600 }}>{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="signup-password">Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)', pointerEvents: 'none' }} />
            <input
              id="signup-password"
              type={showPass ? 'text' : 'password'}
              className={`form-input ${errors.password ? 'error' : ''}`}
              style={{ paddingLeft: 42, paddingRight: 44 }}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => field('password', e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-faint)',
                padding: 4,
              }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Password Strength Indicator */}
          {form.password && (
            <div style={{ marginTop: 4 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 2 }}>
                {[1, 2, 3, 4].map(step => (
                  <div
                    key={step}
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      background: strength >= step ? strengthColor[strength] : 'var(--color-border)',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize: '10px', color: strengthColor[strength], fontWeight: 700, textAlign: 'right' }}>
                {strengthLabel[strength]} Security
              </div>
            </div>
          )}
          {errors.password && <span style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-xs)', fontWeight: 600 }}>{errors.password}</span>}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)', pointerEvents: 'none' }} />
            <input
              id="signup-confirm"
              type={showPass ? 'text' : 'password'}
              className={`form-input ${errors.confirm ? 'error' : ''}`}
              style={{ paddingLeft: 42 }}
              placeholder="Confirm password"
              value={form.confirm}
              onChange={e => field('confirm', e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {errors.confirm && <span style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-xs)', fontWeight: 600 }}>{errors.confirm}</span>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: 'var(--space-2)' }}
          disabled={loading}
          id="signup-submit"
        >
          {loading ? (
            <>
              <div className="spinner" />
              Creating Passport Profile...
            </>
          ) : (
            <>
              Create Account <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>
          Sign in here
        </Link>
      </div>
    </div>
  )
}
