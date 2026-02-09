import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import partyImage from '../images/party.jpg';
import './login.css';
import NavBar from './navBar.jsx';

const email = "anil@gmail.com";
const pwd = "Anil@123";

// Regular expressions for validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// const switchToDashboard = (formData) =>{
//   return(
//     <>
//       <DashBoard data = {formData}/>
//     </>
//   )
// }

const Login = ({ setUserData }) => {
  const navigate = useNavigate();
  
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
    
    if (name === 'email') {
      errorMessage = validateEmail(value);
    } else if (name === 'password') {
      errorMessage = validatePassword(value);
    }
    
    showError(e.target, errorMessage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value
    };
    
    // Validate all fields before submission
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    // Show validation errors
    showError(e.target.email, emailError);
    showError(e.target.password, passwordError);

    // If there are validation errors, don't proceed
    if (emailError || passwordError) {
      alert('Please fix validation errors before submitting');
      return;
    }

    console.log('Login attempt:', formData);

    if(formData.email === email && formData.password === pwd){
      setUserData(formData);
      navigate('/dashboard');
    } else {
      alert("Invalid Credentials");
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
    <div className="login-page">
      <div className="login-background" style={{backgroundImage: `url(${partyImage})`}}></div>
      <div className="login-overlay-blur"></div>
      
      <div className="login-navbar-wrapper">
        <NavBar 
          onLoginClick={() => {}} 
          onNavClick={handleNavClick}
        />
      </div>
      
      <div className="login-container">        
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account</p>
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
                  onBlur={handleInputValidation}
                  onInput={handleInputValidation}
                />
                <span className="login-input-icon">📧</span>
              </div>
            </div>

            <div className="login-form-group">
              <div className="login-input-wrapper">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="login-input"
                  onBlur={handleInputValidation}
                  onInput={handleInputValidation}
                />
                <span className="login-input-icon">🔒</span>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            <div className="login-options">
              <a href="#" className="login-forgot-link">Forgot Password?</a>
            </div>

            <div className="login-footer">
              <p className="login-register-text">
                Don't have an account? <Link to="/register" className="login-register-link">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;