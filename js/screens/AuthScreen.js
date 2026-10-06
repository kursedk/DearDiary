// Screen 1: Login / Sign Up Screen
window.AuthScreen = function AuthScreen({ onAuthSuccess, showToast }) {
  const [mode, setMode] = React.useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [infoMessage, setInfoMessage] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode !== 'forgot' && (!password || password.length < 6)) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await window.AuthService.login(email, password);
        showToast(`Welcome back, ${user.name || user.email}!`, 'success');
        onAuthSuccess(user);
      } else if (mode === 'signup') {
        const user = await window.AuthService.signUp(email, password, name);
        showToast(`Account created successfully! Welcome to DearDiary.`, 'success');
        onAuthSuccess(user);
      } else if (mode === 'forgot') {
        const msg = await window.AuthService.forgotPassword(email);
        setInfoMessage(msg);
        showToast('Password reset requested.', 'info');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('demo@diary.app');
    setPassword('password123');
    setMode('login');
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div className="card auth-box" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Welcome Banner & Description */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'var(--accent-primary)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <h1 className="serif font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
            DearDiary
          </h1>
          <p className="text-secondary text-sm" style={{ lineHeight: '1.5' }}>
            A calm, private sanctuary for your daily thoughts, milestones, and personal reflection.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        {mode !== 'forgot' && (
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem'
          }}>
            <button
              type="button"
              className="btn"
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: mode === 'login' ? 'var(--bg-secondary)' : 'transparent',
                color: mode === 'login' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: mode === 'login' ? '600' : '400',
                boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none'
              }}
              onClick={() => { setMode('login'); setError(''); setInfoMessage(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className="btn"
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: mode === 'signup' ? 'var(--bg-secondary)' : 'transparent',
                color: mode === 'signup' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: mode === 'signup' ? '600' : '400',
                boxShadow: mode === 'signup' ? 'var(--shadow-sm)' : 'none'
              }}
              onClick={() => { setMode('signup'); setError(''); setInfoMessage(''); }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error / Feedback Alert */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#DC2626',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        {infoMessage && (
          <div style={{
            backgroundColor: 'var(--accent-light)',
            border: '1px solid var(--accent-primary)',
            color: 'var(--accent-text)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {infoMessage}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-name" className="form-label">Full Name</label>
              <input
                id="auth-name"
                type="text"
                className="form-input"
                placeholder="e.g. Elena Rostova"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email" className="form-label">Email Address</label>
            <input
              id="auth-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== 'forgot' && (
            <window.PasswordInput
              id="auth-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}

          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className="btn-subtle"
                style={{ fontSize: '0.825rem', color: 'var(--accent-primary)' }}
                onClick={() => { setMode('forgot'); setError(''); setInfoMessage(''); }}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              mode === 'login' ? 'Sign In' : (mode === 'signup' ? 'Create Account' : 'Send Reset Link')
            )}
          </button>
        </form>

        {mode === 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn-subtle text-sm"
              onClick={() => { setMode('login'); setError(''); setInfoMessage(''); }}
            >
              &larr; Back to Sign In
            </button>
          </div>
        )}

        {/* Quick Demo Login Option */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}>
          <p className="text-muted text-xs" style={{ marginBottom: '0.5rem' }}>
            Want to test without creating an account?
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
            onClick={fillDemoAccount}
          >
            Fill Demo Credentials (demo@diary.app)
          </button>
        </div>
      </div>
    </div>
  );
};
