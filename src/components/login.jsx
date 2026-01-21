import partyImage from '../images/party.jpg';
import './login.css';
import NavBar from './navBar.jsx';

const Login = ({ onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value
    };
    console.log('Login attempt:', formData);
    // Close modal after successful login
    onClose();
  };

  const handleNavClick = (targetSection) => {
    // Close the login page first
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
                Don't have an account? <a href="#" className="login-register-link">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;