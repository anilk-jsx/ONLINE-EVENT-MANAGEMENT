import React from 'react';
import './navBar.css';

const NavBar = ({ onLoginClick, onNavClick }) => {
  const updateActiveNav = () => {
    const navItems = document.querySelectorAll('.navbar-item');
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;

    navItems.forEach(item => item.classList.remove('active'));

    let currentActive = 'home';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentActive = section.getAttribute('id');
      }
    });

    const activeItem = document.querySelector(`a[href="#${currentActive}"]`)?.parentElement;
    if (activeItem) {
      activeItem.classList.add('active');
    }
  };

  const handleNavClick = (e) => {
    const href = e.currentTarget.getAttribute('href');
    
    // Use custom navigation handler if provided
    if (onNavClick) {
      e.preventDefault();
      onNavClick(href);
      return;
    }
    
    // Default navigation behavior
    if (href && href.startsWith('#')) {
      document.querySelectorAll('.navbar-item').forEach(item => {
        item.classList.remove('active');
      });
      e.currentTarget.parentElement.classList.add('active');
    }
  };

  React.useEffect(() => {
    const handleScroll = () => updateActiveNav();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-be">asas</span>
          <span className="logo-x">×</span>
          <span className="logo-event">event</span>
        </div>
        
        <ul className="navbar-menu">
          <li className="navbar-item active">
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
          <button className="navbar-login-btn" onClick={onLoginClick}>Login</button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;