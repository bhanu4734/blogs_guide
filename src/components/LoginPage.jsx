import { useState, useId } from 'react'
import './LoginPage.css'

export default function LoginPage() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authenticatedUser, setAuthenticatedUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const emailId = useId()
  const passwordId = useId()
  const nameId = useId()
  const rememberMeId = useId()

  // Senior Validation Pattern
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'name':
        if (mode === 'signup' && (!value || value.trim().length < 2)) {
          return 'Full name must be at least 2 characters.'
        }
        return ''

      case 'email': {
        if (!value || !value.trim()) {
          return 'Email address is required.'
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value.trim())) {
          return 'Please enter a valid email address.'
        }
        return ''
      }

      case 'password':
        if (!value) {
          return 'Password is required.'
        }
        if (value.length < 8) {
          return 'Password must be at least 8 characters long.'
        }
        return ''

      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }))

    // Validate on change only if already touched for immediate feedback without premature errors
    if (touched[name]) {
      const error = validateField(name, fieldValue)
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const validateAll = () => {
    const fieldsToValidate = mode === 'signup' ? ['name', 'email', 'password'] : ['email', 'password']
    const newErrors = {}
    let isValid = true

    fieldsToValidate.forEach((field) => {
      const err = validateField(field, formData[field])
      if (err) {
        newErrors[field] = err
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched(
      fieldsToValidate.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
    )

    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateAll()) return

    setIsLoading(true)
    setNotification(null)

    // Simulate authentic API request
    try {
      await new Promise((resolve) => setTimeout(resolve, 850))

      setAuthenticatedUser({
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    } catch {
      setNotification({ type: 'error', message: 'Unable to authenticate. Please check your credentials.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickFill = () => {
    const sample = {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      password: 'password123',
      rememberMe: true,
    }
    setFormData(sample)
    setErrors({})
    setTouched({})
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    setNotification({
      type: 'info',
      message: 'Password reset link sent! Check your inbox if an account exists for this address.',
    })
  }

  const handleSocialAuth = (provider) => {
    setIsLoading(true)
    setNotification(null)
    setTimeout(() => {
      setIsLoading(false)
      setAuthenticatedUser({
        name: provider === 'Google' ? 'Google Workspace User' : 'GitHub Developer',
        email: `user@${provider.toLowerCase()}.com`,
        provider,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    }, 700)
  }

  const handleSignOut = () => {
    setAuthenticatedUser(null)
    setFormData({
      email: '',
      password: '',
      name: '',
      rememberMe: false,
    })
    setTouched({})
    setErrors({})
    setNotification({ type: 'info', message: 'You have been signed out safely.' })
  }

  return (
    <main className="auth-wrapper">
      {/* Decorative Clay Atmosphere Elements */}
      <div className="clay-orb orb-1" aria-hidden="true" />
      <div className="clay-orb orb-2" aria-hidden="true" />
      <div className="clay-orb orb-3" aria-hidden="true" />
      <div className="clay-orb orb-4" aria-hidden="true" />

      <div className="auth-container">
        {/* Minimal Brand Mark */}
        <header className="auth-header">
          <div className="brand-icon-wrapper" aria-hidden="true">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
          </div>
          <h1 className="auth-title">
            {authenticatedUser
              ? 'Welcome back'
              : mode === 'signin'
              ? 'Sign in to your account'
              : 'Create your account'}
          </h1>
          <p className="auth-subtitle">
            {authenticatedUser
              ? 'You are currently authenticated in this session.'
              : mode === 'signin'
              ? 'Enter your credentials below to access your workspace'
              : 'Start your 14-day free trial. No credit card required.'}
          </p>
        </header>

        {/* Global Feedback Banner */}
        {notification && (
          <div
            className={`feedback-banner ${notification.type}`}
            role="status"
            aria-live="polite"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>{notification.message}</span>
          </div>
        )}

        {/* Authenticated State Preview */}
        {authenticatedUser ? (
          <div className="auth-card signed-in-card">
            <div className="success-badge" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#09090b', marginBottom: '6px' }}>
              Successfully Signed In
            </h2>
            <p style={{ fontSize: '13.5px', color: '#71717a' }}>
              Signed in as <strong>{authenticatedUser.email}</strong>
            </p>
            {authenticatedUser.provider && (
              <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '4px' }}>
                Via {authenticatedUser.provider} SSO &bull; {authenticatedUser.timestamp}
              </p>
            )}

            <button
              type="button"
              className="btn-signout"
              onClick={handleSignOut}
            >
              Sign out of this session
            </button>
          </div>
        ) : (
          /* Form Card */
          <div className="auth-card">
            {/* Social Authentication */}
            <div className="social-buttons">
              <button
                type="button"
                className="btn-social"
                onClick={() => handleSocialAuth('Google')}
                disabled={isLoading}
                aria-label="Continue with Google"
              >
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.25 21.37 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.26C.46 8.18 0 9.99 0 12s.46 3.82 1.26 5.42l4.02-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.63 1.26 6.58l4.02 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                className="btn-social"
                onClick={() => handleSocialAuth('GitHub')}
                disabled={isLoading}
                aria-label="Continue with GitHub"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                Continue with GitHub
              </button>
            </div>

            <div className="divider">
              <span>or continue with email</span>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Optional Full Name for Sign Up mode */}
              {mode === 'signup' && (
                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor={nameId} className="form-label">
                      Full name
                    </label>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id={nameId}
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? `${nameId}-error` : undefined}
                      className={`form-input ${errors.name ? 'has-error' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <div id={`${nameId}-error`} className="field-error">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.name}
                    </div>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="form-group">
                <div className="label-row">
                  <label htmlFor={emailId} className="form-label">
                    Email address
                  </label>
                </div>
                <div className="input-wrapper">
                  <input
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${emailId}-error` : undefined}
                    className={`form-input ${errors.email ? 'has-error' : ''}`}
                  />
                </div>
                {errors.email && (
                  <div id={`${emailId}-error`} className="field-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className="label-row">
                  <label htmlFor={passwordId} className="form-label">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <a
                      href="#forgot-password"
                      className="forgot-link"
                      onClick={handleForgotPassword}
                      tabIndex={0}
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="input-wrapper">
                  <input
                    id={passwordId}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? `${passwordId}-error` : undefined}
                    className={`form-input input-has-toggle ${errors.password ? 'has-error' : ''}`}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      /* Eye Off Icon */
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      /* Eye Icon */
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div id={`${passwordId}-error`} className="field-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Remember Me Checkbox */}
              {mode === 'signin' && (
                <div className="remember-row">
                  <label htmlFor={rememberMeId} className="custom-checkbox-label">
                    <input
                      id={rememberMeId}
                      name="rememberMe"
                      type="checkbox"
                      className="custom-checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <span>Remember this device for 30 days</span>
                  </label>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>{mode === 'signin' ? 'Sign in' : 'Create account'}</span>
                )}
              </button>

              {/* Quick Demo Fill Helper */}
              <div className="demo-helper">
                <span>Quick demo credentials</span>
                <button
                  type="button"
                  className="btn-demo-fill"
                  onClick={handleQuickFill}
                >
                  Fill test data
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mode Switcher */}
        {!authenticatedUser && (
          <div className="auth-footer">
            <span>
              {mode === 'signin'
                ? "Don't have an account yet?"
                : 'Already have an account?'}
            </span>
            <button
              type="button"
              className="auth-footer-link"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setErrors({})
                setNotification(null)
              }}
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        )}

        {/* Clean Legal Micro-footer */}
        <footer className="legal-footer">
          By continuing, you agree to our{' '}
          <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> and{' '}
          <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
        </footer>
      </div>
    </main>
  )
}
