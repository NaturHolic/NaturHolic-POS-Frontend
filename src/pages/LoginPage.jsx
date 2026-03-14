import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-card">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Naturholic Admin</h1>
            <p className="text-neutral-500">Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="form-space">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="bw-input"
                placeholder="admin@naturholic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div id="login-password-field">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="bw-input"
                  style={{ paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  id="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '0.25rem',
                    color: 'var(--color-neutral-400)',
                    background: 'transparent',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.color = 'var(--color-neutral-600)')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.color = 'var(--color-neutral-400)')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #ef4444',
                  borderRadius: 'var(--radius)',
                  marginTop: '0.5rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#dc2626',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="bw-button-primary w-full mt-6"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-xs text-neutral-400">
              Forgot password? Please contact system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}