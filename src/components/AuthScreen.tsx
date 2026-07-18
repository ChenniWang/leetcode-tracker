import { useState, type FormEvent } from 'react'
import { useAuth } from '../lib/auth'

export function AuthScreen() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setInfo('')
    try {
      if (mode === 'login') {
        await signIn(email.trim(), password)
      } else {
        const tip = await signUp(email.trim(), password)
        if (tip) setInfo(tip)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card__brand">
          <h1>LeetTrack</h1>
          <p>登录后，每人只看到自己的题单</p>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            className={mode === 'login' ? 'is-active' : undefined}
            aria-selected={mode === 'login'}
            onClick={() => {
              setMode('login')
              setError('')
              setInfo('')
            }}
          >
            登录
          </button>
          <button
            type="button"
            role="tab"
            className={mode === 'signup' ? 'is-active' : undefined}
            aria-selected={mode === 'signup'}
            onClick={() => {
              setMode('signup')
              setError('')
              setInfo('')
            }}
          >
            注册
          </button>
        </div>

        <form className="auth-form" onSubmit={(e) => void onSubmit(e)}>
          <label className="field">
            <span>邮箱</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className="field">
            <span>密码</span>
            <input
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
            />
          </label>

          {error ? <p className="auth-msg auth-msg--error">{error}</p> : null}
          {info ? <p className="auth-msg auth-msg--info">{info}</p> : null}

          <button type="submit" className="auth-submit" disabled={busy}>
            {busy ? '请稍候…' : mode === 'login' ? '登录' : '注册并进入'}
          </button>
        </form>
      </div>
    </div>
  )
}
