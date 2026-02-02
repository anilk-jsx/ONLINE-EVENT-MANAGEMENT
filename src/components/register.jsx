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

  // Show validation error
  const showError = (inputElement, message) => {
    // Remove existing error
    const existingError = inputElement.parentElement.parentElement.querySelector('.validation-error');
    if (existingError) {
      existingError.remove();
    }

    if (message) {
      // Add error class to input
      inputElement.classList.add('error');
      
      // Create and add error message
      const errorSpan = document.createElement('span');
      errorSpan.className = 'validation-error';
      errorSpan.textContent = message;
      inputElement.parentElement.parentElement.appendChild(errorSpan);
    } else {
      // Remove error class
      inputElement.classList.remove('error');
    }
  };

  // Handle input validation on blur and input
  const handleInputValidation = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    
    if (name === 'name') {
      errorMessage = validateName(value);
    } else if (name === 'email') {
      errorMessage = validateEmail(value);
    } else if (name === 'mobile') {
      errorMessage = validateMobile(value);
    } else if (name === 'password') {
      errorMessage = validatePassword(value);
      // Also revalidate retype password if it exists
      const retypePasswordInput = e.target.form.retypePassword;
      if (retypePasswordInput && retypePasswordInput.value) {
        const retypeError = validateRetypePassword(value, retypePasswordInput.value);
        showError(retypePasswordInput, retypeError);
      }
    } else if (name === 'retypePassword') {
      const passwordInput = e.target.form.password;
      errorMessage = validateRetypePassword(passwordInput.value, value);
    }
    
    showError(e.target, errorMessage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      mobile: e.target.mobile.value,
      password: e.target.password.value,
      retypePassword: e.target.retypePassword.value
    };
    
    // Validate all fields before submission
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const mobileError = validateMobile(formData.mobile);
    const passwordError = validatePassword(formData.password);
    const retypePasswordError = validateRetypePassword(formData.password, formData.retypePassword);
    
    // Show validation errors
    showError(e.target.name, nameError);
    showError(e.target.email, emailError);
    showError(e.target.mobile, mobileError);
    showError(e.target.password, passwordError);
    showError(e.target.retypePassword, retypePasswordError);

    // If there are validation errors, don't proceed
    if (nameError || emailError || mobileError || passwordError || retypePasswordError) {
      alert('Please fix validation errors before submitting');
      return;
    }
    
    console.log('Registration attempt:', formData);
    alert('Registration successful!');
    // Navigate to login after successful registration
    navigate('/login');
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
                  className="register-input"
                  onBlur={handleInputValidation}
                  onInput={handleInputValidation}
                />
                <span className="register-input-icon">👤</span>
              </div>
            </div>

            <div className="register-form-group">
              <div className="register-input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="register-input"
                  onBlur={handleInputValidation}
                  onInput={handleInputValidation}
                />
                <span className="register-input-icon">📧</span>
              </div>
            </div>

            <div className="register-form-group">
              <div className="register-input-wrapper">
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  required
                  className="register-input"
                  onBlur={handleInputValidation}
                  onInput={handleInputValidation}
                />
                <span className="register-input-icon">📱</span>
              </div>
            </div>

            <div className="register-form-group">
              <div className="register-input-wrapper">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="register-input"
                  onBlur={handleInputValidation}
                  onInput={handleInputValidation}
                />
                <span className="register-input-icon">🔒</span>
              </div>
            </div>

            <div className="register-form-group">
              <div className="register-input-wrapper">
                <input
                  type="password"
                  name="retypePassword"
                  placeholder="Retype Password"
                  required
                  className="register-input"
                  onBlur={handleInputValidation}
                  onInput={handleInputValidation}
                />
                <span className="register-input-icon">🔐</span>
              </div>
            </div>

            <button type="submit" className="register-btn">
              Register
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