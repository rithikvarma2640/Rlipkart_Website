import { useState } from 'react';
import { supabase } from '../lib/supabase';
import OTPVerification from './OTPVerification';

export default function Auth({ onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useOTP, setUseOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  const sendLoginNotification = async (userEmail, userName) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-login-notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail,
            userName: userName || 'User',
            loginTime: new Date().toLocaleString(),
          }),
        }
      );

      if (!response.ok) {
        console.error('Failed to send notification');
      }
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      setOtpEmail(email);
      setTempPassword(password);
      setUseOTP(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = async (otp) => {
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: otpEmail,
        password: tempPassword,
      });

      if (signInError) throw signInError;

      if (data.user) {
        await sendLoginNotification(otpEmail, data.user.user_metadata?.full_name);
        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        if (data.user) {
          await sendLoginNotification(email, data.user.user_metadata?.full_name);
          onAuthSuccess(data.user);
          onClose();
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (signUpError) throw signUpError;
        if (data.user) {
          setError('Account created! You can now login.');
          setIsLogin(true);
          setPassword('');
          setFullName('');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (useOTP) {
    return (
      <div style={styles.overlay} onClick={() => setUseOTP(false)}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setUseOTP(false)} style={styles.closeBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <OTPVerification
            email={otpEmail}
            onVerified={handleOTPVerified}
            onBack={() => setUseOTP(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 style={styles.title}>{isLogin ? 'Login' : 'Create Account'}</h2>

        <form onSubmit={isLogin ? handleSendOTP : handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={!isLogin}
              style={styles.input}
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Please wait...' : isLogin ? 'Login with OTP' : 'Sign Up'}
          </button>
        </form>

        {isLogin && (
          <>
            <div style={styles.divider}>
              <span>or</span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              style={styles.altLoginBtn}
              disabled={loading}
            >
              Login without OTP
            </button>
          </>
        )}

        <div style={styles.divider}>
          <span>or</span>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setPassword('');
            setFullName('');
          }}
          style={styles.toggleBtn}
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 3000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '420px',
    width: '90%',
    boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
    position: 'relative',
    animation: 'slideUp 0.3s ease',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    padding: '8px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '24px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.2s ease',
  },
  error: {
    color: 'var(--error)',
    fontSize: '13px',
    margin: '-8px 0 8px 0',
  },
  submitBtn: {
    backgroundColor: 'var(--primary-blue)',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    marginTop: '8px',
  },
  altLoginBtn: {
    backgroundColor: 'var(--primary-orange)',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
  },
  divider: {
    margin: '24px 0',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    position: 'relative',
  },
  toggleBtn: {
    backgroundColor: 'transparent',
    color: 'var(--primary-blue)',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'underline',
  },
};
