import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, Shield } from 'lucide-react'
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
      {/* Brand Header */}
      <div className="auth-logo">
        <div className="auth-logo-icon">
          <Globe size={26} color="#fff" />
        </div>
        <span className="auth-logo-text">GlobeTrotter</span>
      </div>

      <h2 className="auth-title">Welcome Back, Explorer</h2>
      <p className="auth-subtitle">Sign in to manage your Gujarat & Global expeditions</p>

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
        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-faint)', pointerEvents: 'none'
            }} />
            <input
              id="login-email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              style={{ paddingLeft: 42 }}
              placeholder="you@example.com"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }}
              autoComplete="email"
            />
          </div>
          {errors.email && <span style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-xs)', fontWeight: 600 }}>{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <div className="flex-between" style={{ marginBottom: 2 }}>
            <label className="form-label" htmlFor="login-password">Password</label>
            <button
              type="button"
              onClick={() => showToast('Password reset link sent to your registered email! (Demo: use demo123)', 'info')}
              style={{ fontSize: '11px', color: 'var(--color-primary-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Forgot Password?
            </button>
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
              style={{ paddingLeft: 42, paddingRight: 44 }}
              placeholder="Your password"
              value={form.password}
              onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })) }}
              autoComplete="current-password"
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
          {errors.password && <span style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-xs)', fontWeight: 600 }}>{errors.password}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: 'var(--space-2)' }}
          disabled={loading}
          id="login-submit"
        >
          {loading ? (
            <>
              <div className="spinner" />
              Verifying Travel Pass...
            </>
          ) : (
            <>
              Sign In to GlobeTrotter <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Box */}
      <div className="auth-demo-box" style={{ marginTop: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Shield size={12} color="var(--color-primary-light)" /> Demo Login Credentials
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: 2 }}>
            Email: <strong style={{ color: 'var(--color-primary-light)' }}>alex@demo.com</strong> · Pass: <strong style={{ color: 'var(--color-primary-light)' }}>demo123</strong>
          </div>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={fillDemo}
          style={{ padding: '4px 10px', fontSize: '10px' }}
        >
          Auto-Fill
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>
          Create one for free
        </Link>
      </div>
    </div>
  )
}
