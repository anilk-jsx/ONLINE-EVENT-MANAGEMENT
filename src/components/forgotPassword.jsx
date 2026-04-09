import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // ✅ Validation
    if (!email) return setError('Email is required');
    if (!EMAIL_REGEX.test(email)) return setError('Invalid email address');

    if (!password) return setError('Password is required');
    if (!PASSWORD_REGEX.test(password))
      return setError(
        'Password must be 8+ chars, include uppercase, lowercase, number & special character'
      );

    if (password !== retypePassword)
      return setError('Passwords do not match');

    try {
      setLoading(true);

      const res = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Password updated successfully 🎉');

        // reset form
        setEmail('');
        setPassword('');
        setRetypePassword('');

        // redirect after 1.5 sec
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Server error 🚨');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay-blur"></div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">Reset Password</h2>
            <p className="login-subtitle">
              Enter your email and new password
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="login-form-group">
              <div className="login-input-wrapper">
                <input
                  type="email"
                  placeholder="Email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="login-input-icon">📧</span>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="login-form-group">
              <div className="login-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="login-input-icon"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            {/* RETYPE PASSWORD */}
            <div className="login-form-group">
              <div className="login-input-wrapper">
                <input
                  type={showRetypePassword ? 'text' : 'password'}
                  placeholder="Retype New Password"
                  className="login-input"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  required
                />
                <span
                  className="login-input-icon"
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    setShowRetypePassword(!showRetypePassword)
                  }
                >
                  {showRetypePassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            {/* ERROR / SUCCESS */}
            {error && <span className="validation-error">{error}</span>}
            {message && <span className="success-message">{message}</span>}

            {/* BUTTON */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>

            {/* FOOTER */}
            <div className="login-footer">
              <p className="login-register-text">
                Remembered your password?{' '}
                <Link to="/login" className="login-register-link">
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;