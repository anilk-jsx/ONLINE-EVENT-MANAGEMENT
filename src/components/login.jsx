import partyImage from '../images/party.jpg';
import './login.css';

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

  const handleNavClick = (e) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      // Navigate back to home page first, then scroll to section
      onClose();
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background" style={{backgroundImage: `url(${partyImage})`}}></div>
      <div className="login-overlay-blur"></div>
      
      <nav className="navbar login-navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-be">asas</span>
            <span className="logo-x">×</span>
            <span className="logo-event">event</span>
          </div>
          
          <ul className="navbar-menu">
            <li className="navbar-item">
              <a href="#home" onClick={handleNavClick}>Home</a>
            </li>
            <li className="navbar-item">
              <a href="#events" onClick={handleNavClick}>Events</a>
            </li>
            <li className="navbar-item">
              <a href="#services" onClick={handleNavClick}>Services</a>
            </li>
            <li className="navbar-item">
              <a href="#about" onClick={handleNavClick}>About us</a>
            </li>
            <li className="navbar-item">
              <a href="#contact" onClick={handleNavClick}>Contact</a>
            </li>
          </ul>

          <div className="navbar-actions">
            <button className="navbar-login-btn active">Login</button>
          </div>
        </div>
      </nav>
      
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