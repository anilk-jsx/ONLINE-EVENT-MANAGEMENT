import partyImage from '../images/party.jpg';
import './register.css';
import NavBar from './navBar.jsx';

const Register = ({ onClose, onSwitchToLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      mobile: e.target.mobile.value,
      password: e.target.password.value,
      retypePassword: e.target.retypePassword.value
    };
    
    // Basic password validation
    if (formData.password !== formData.retypePassword) {
      alert('Passwords do not match!');
      return;
    }
    
    console.log('Registration attempt:', formData);
    // Close modal after successful registration
    onClose();
  };

  const handleNavClick = (targetSection) => {
    // Close the register page first
    onClose();
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
          onLoginClick={onSwitchToLogin} 
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
                />
                <span className="register-input-icon">🔐</span>
              </div>
            </div>

            <button type="submit" className="register-btn">
              Register
            </button>

            <div className="register-footer">
              <p className="register-login-text">
                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }} className="register-login-link">Login</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;