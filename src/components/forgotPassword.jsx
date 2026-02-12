import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ForgotPassword = ({ credentials, updatePassword }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [retypePassword, setRetypePassword] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		setMessage('');
		setError('');
		// Validation
		if (!email) {
			setError('Email is required');
			return;
		}
		if (!EMAIL_REGEX.test(email)) {
			setError('Please enter a valid email address');
			return;
		}
		if (!password) {
			setError('Password is required');
			return;
		}
		if (!PASSWORD_REGEX.test(password)) {
			setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
			return;
		}
		if (password !== retypePassword) {
			setError('Passwords do not match');
			return;
		}
		// Check if email matches the stored user
		if (email !== credentials.email) {
			setError('No user found with this email');
			return;
		}
		// Update password using hook from App
		updatePassword(email, password);
		setMessage('Password changed successfully! You can now login.');
		setEmail('');
		setPassword('');
		setRetypePassword('');
	};

	return (
		<div className="login-page">
			<div className="login-overlay-blur"></div>
			<div className="login-container">
				<div className="login-card">
					<div className="login-header">
						<h2 className="login-title">Reset Password</h2>
						<p className="login-subtitle">Enter your email and new password</p>
					</div>
					<form className="login-form" onSubmit={handleSubmit}>
						<div className="login-form-group">
							<div className="login-input-wrapper">
								<input
									type="email"
									name="email"
									placeholder="Email"
									required
									className="login-input"
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
								<span className="login-input-icon">📧</span>
							</div>
						</div>
						<div className="login-form-group">
							<div className="login-input-wrapper">
								<input
									type="password"
									name="password"
									placeholder="New Password"
									required
									className="login-input"
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
								<span className="login-input-icon">🔒</span>
							</div>
						</div>
						<div className="login-form-group">
							<div className="login-input-wrapper">
								<input
									type="password"
									name="retypePassword"
									placeholder="Retype New Password"
									required
									className="login-input"
									value={retypePassword}
									onChange={e => setRetypePassword(e.target.value)}
								/>
								<span className="login-input-icon">🔒</span>
							</div>
						</div>
						{error && <span className="validation-error">{error}</span>}
						{message && <span className="success-message">{message}</span>}
						<button type="submit" className="login-btn" style={{marginTop: '1rem'}}>Change Password</button>
						<div className="login-footer">
							<p className="login-register-text">
								Remembered your password?{' '}
								<Link to="/login" className="login-register-link">Back to Login</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
