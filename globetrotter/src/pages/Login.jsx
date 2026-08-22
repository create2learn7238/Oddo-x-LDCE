import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { loginUser } from '../utils/auth'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 5) e.password = 'Password must be at least 5 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setServerError('')
    const result = await loginUser(form.email, form.password)
    setLoading(false)
    if (result && result.success) {
      login(result.user)
      navigate('/dashboard')
    } else {
      setServerError(result?.error || 'Failed to sign in.')
    }
  }

  const fillDemo = () => {
    setForm({ email: 'alex@demo.com', password: 'demo123' })
    setErrors({})
    setServerError('')
  }

  return (
    <div className="auth-card animate-scaleIn">
      <div className="auth-logo">
        <div className="auth-logo-icon">
          <Globe size={24} color="#fff" />
        </div>
        <span className="auth-logo-text">GlobeTrotter</span>
      </div>

      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-subtitle">Sign in to continue your journey</p>

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
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-faint)', pointerEvents: 'none'
            }} />
            <input
              id="login-email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              style={{ paddingLeft: 40 }}
              placeholder="you@example.com"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }}
              autoComplete="email"
            />
          </div>
          {errors.email && <span style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-xs)' }}>{errors.email}</span>}
        </div>

        <div className="form-group">
          <div className="flex-between">
            <label className="form-label" htmlFor="login-password">Password</label>
            <a href="#" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-primary-light)' }}
              onClick={e => { e.preventDefault(); fillDemo() }}>
              Use Demo Account
            </a>
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-faint)', pointerEvents: 'none'
            }} />
            <input
              id="login-password"
              type={showPass ? 'text' : 'password'}
              className={`form-input ${errors.password ? 'error' : ''}`}
              style={{ paddingLeft: 40, paddingRight: 44 }}
              placeholder="Your password"
              value={form.password}
              onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })) }}
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPass(s => !s)} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-faint)',
              padding: 4,
            }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-xs)' }}>{errors.password}</span>}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', gap: 'var(--space-2)' }}
          disabled={loading}
          id="login-submit"
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="auth-divider" style={{ marginTop: 'var(--space-6)' }}>or</div>

      <div style={{
        background: 'var(--color-surface2)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        fontSize: 'var(--fs-xs)',
        color: 'var(--color-text-muted)',
        marginTop: 'var(--space-4)',
      }}>
        <strong style={{ color: 'var(--color-text)' }}>Demo credentials:</strong><br />
        Email: <code style={{ color: 'var(--color-primary-light)' }}>alex@demo.com</code><br />
        Password: <code style={{ color: 'var(--color-primary-light)' }}>demo123</code>
      </div>

      <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>
          Create one
        </Link>
      </p>
    </div>
  )
}
