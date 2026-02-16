import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ForgotPassword = ({ credentials, updatePassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) return setError("Email is required");
    if (!EMAIL_REGEX.test(email))
      return setError("Please enter a valid email address");
    if (!password) return setError("Password is required");
    if (!PASSWORD_REGEX.test(password))
      return setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number and special character",
      );
    if (password !== retypePassword) return setError("Passwords do not match");
    if (email !== credentials.email)
      return setError("No user found with this email");

    updatePassword(email, password);
    setMessage("Password changed successfully! Redirecting to login...");

    setTimeout(() => {
      navigate("/login");
    }, 2000);

    setEmail("");
    setPassword("");
    setRetypePassword("");
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
            {/* Email */}
            <div className="login-form-group">
              <div className="login-input-wrapper">
                <input
                  type="email"
                  placeholder="Email"
                  className="login-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
                <span className="login-input-icon-left">📧</span>
              </div>
            </div>

            {/* New Password */}
            <div className="login-form-group">
              <div className="login-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="login-input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />

                <span className="login-input-icon-left">🔒</span>

                <span
                  className={`login-input-icon-right eye-icon ${
                    showPassword ? "active" : ""
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Retype Password */}
            <div className="login-form-group">
              <div className="login-input-wrapper">
                <input
                  type={showRetypePassword ? "text" : "password"}
                  placeholder="Retype New Password"
                  className="login-input"
                  value={retypePassword}
                  onChange={(e) => {
                    setRetypePassword(e.target.value);
                    setError("");
                  }}
                />

                <span className="login-input-icon-left">🔒</span>

                <span
                  className={`login-input-icon-right eye-icon ${
                    showRetypePassword ? "active" : ""
                  }`}
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                >
                  {showRetypePassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {error && <span className="validation-error">{error}</span>}
            {message && <span className="success-message">{message}</span>}

            <button
              type="submit"
              className="login-btn"
              style={{ marginTop: "1rem" }}
            >
              Change Password
            </button>

            <div className="login-footer">
              <p className="login-register-text">
                Remembered your password?{" "}
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
