import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import partyImage from '../images/party.jpg';
import './register.css';
import NavBar from './navBar.jsx';

// Regular expressions for validation
const NAME_REGEX = /^[a-zA-Z\s]{2,50}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    retypePassword: '',
    role: 'user'
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Validate name using regex
  const validateName = (name) => {
    if (!name) {
      return 'Name is required';
    }
    if (!NAME_REGEX.test(name)) {
      return 'Name should contain only letters and spaces (2-50 characters)';
    }
    return '';
  };

  // Validate email using regex
  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    if (!EMAIL_REGEX.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Validate mobile using regex
  const validateMobile = (mobile) => {
    if (!mobile) {
      return 'Mobile number is required';
    }
    if (!MOBILE_REGEX.test(mobile)) {
      return 'Please enter a valid 10-digit Indian mobile number';
    }
    return '';
  };

  // Validate password using regex
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (!PASSWORD_REGEX.test(password)) {
      return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return '';
  };

  // Validate retype password
  const validateRetypePassword = (password, retypePassword) => {
    if (!retypePassword) {
      return 'Please retype your password';
    }
    if (password !== retypePassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const validateField = (name, value, currentData = formData) => {
    if (name === 'name') {
      return validateName(value);
    }
    if (name === 'email') {
      return validateEmail(value);
    }
    if (name === 'mobile') {
      return validateMobile(value);
    }
    if (name === 'password') {
      return validatePassword(value);
    }
    if (name === 'retypePassword') {
      return validateRetypePassword(currentData.password, value);
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value
    };

    setFormData(updatedData);
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    if (name === 'password' && formData.retypePassword) {
      setErrors(prev => ({
        ...prev,
        retypePassword: validateRetypePassword(value, formData.retypePassword)
      }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    const nextErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      mobile: validateMobile(formData.mobile),
      password: validatePassword(formData.password),
      retypePassword: validateRetypePassword(formData.password, formData.retypePassword)
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix validation errors before submitting');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      rpassword: formData.retypePassword,
      mobile_number: Number(formData.mobile)
    };

    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Registration failed');
      }

      console.log('Registration successful:', data);
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Error during registration:', error);
      alert(error.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavClick = (targetSection) => {
    // Navigate to home page first
    navigate('/');
    // Then navigate to the section after a brief delay
    setTimeout(() => {
      if (targetSection && targetSection !== '#home') {
        const element = document.querySelector(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };

  return (
    <div className="register-page">
      <div className="register-background" style={{backgroundImage: `url(${partyImage})`}}></div>
      <div className="register-overlay-blur"></div>
      
      <div className="register-navbar-wrapper">
        <NavBar 
          onNavClick={handleNavClick}
        />
      </div>
      
      <div className="register-container">        
        <div className="register-card">
          <div className="register-header">
            <h2 className="register-title">Create Account</h2>
            <p className="register-subtitle">Join us to organize amazing events</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-form-group">
              <div className="register-input-wrapper">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  className={`register-input ${errors.name ? 'error' : ''}`}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                <span className="register-input-icon">👤</span>
              </div>
              {errors.name && <span className="validation-error">{errors.name}</span>}
            </div>

            <div className="register-form-group">
              <div className="register-input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  className={`register-input ${errors.email ? 'error' : ''}`}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                <span className="register-input-icon">📧</span>
              </div>
              {errors.email && <span className="validation-error">{errors.email}</span>}
            </div>

            <div className="register-form-group">
              <div className="register-input-wrapper">
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  required
                  value={formData.mobile}
                  className={`register-input ${errors.mobile ? 'error' : ''}`}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                <span className="register-input-icon">📱</span>
              </div>
              {errors.mobile && <span className="validation-error">{errors.mobile}</span>}
            </div>

            <div className="register-form-group">
              <div className="register-input-wrapper">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  className={`register-input ${errors.password ? 'error' : ''}`}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                <span className="register-input-icon">🔒</span>
              </div>
              {errors.password && <span className="validation-error">{errors.password}</span>}
            </div>

            <div className="register-form-group">
              <div className="register-input-wrapper">
                <input
                  type="password"
                  name="retypePassword"
                  placeholder="Retype Password"
                  required
                  value={formData.retypePassword}
                  className={`register-input ${errors.retypePassword ? 'error' : ''}`}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                <span className="register-input-icon">🔐</span>
              </div>
              {errors.retypePassword && <span className="validation-error">{errors.retypePassword}</span>}
            </div>

            <button type="submit" className="register-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>

            <div className="register-footer">
              <p className="register-login-text">
                Already have an account? <Link to="/login" className="register-login-link">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;