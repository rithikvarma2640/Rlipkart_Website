import { useState } from 'react';

export default function OTPVerification({ email, onVerified, onBack }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        throw new Error('OTP must be 6 digits');
      }

      onVerified(otp);
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setResending(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) throw new Error('Failed to resend OTP');
      setError('OTP resent to your email');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Verify OTP</h2>
      <p style={styles.subtitle}>Enter the 6-digit OTP sent to {email}</p>

      <form onSubmit={handleVerifyOTP} style={styles.form}>
        <input
          type="text"
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength="6"
          style={styles.otpInput}
          autoFocus
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.verifyBtn}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div style={styles.footer}>
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={resending}
          style={styles.resendBtn}
        >
          {resending ? 'Resending...' : 'Resend OTP'}
        </button>

        <button
          type="button"
          onClick={onBack}
          style={styles.backBtn}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  otpInput: {
    padding: '16px',
    fontSize: '32px',
    fontWeight: 700,
    letterSpacing: '8px',
    textAlign: 'center',
    border: '2px solid var(--border-color)',
    borderRadius: '8px',
    transition: 'border-color 0.2s ease',
  },
  error: {
    color: 'var(--error)',
    fontSize: '13px',
    textAlign: 'center',
  },
  verifyBtn: {
    backgroundColor: 'var(--primary-blue)',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
  },
  footer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  resendBtn: {
    backgroundColor: 'transparent',
    color: 'var(--primary-blue)',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'underline',
  },
  backBtn: {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
  },
};
