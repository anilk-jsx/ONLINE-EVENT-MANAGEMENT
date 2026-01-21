import React from 'react';
import './App.css';
import Login from './components/login.jsx';
import NavBar from './components/navBar.jsx';
import partyImage from './images/party.jpg';
import weddingImge from './images/weddingimg.jpg';
import musiconcertImage from './images/mconcert.jpg';
import bdayImage from './images/bdayImg.jpg';
import facebookLogo from './images/logos/icons8-facebook-logo-48.png';
import twitterLogo from './images/logos/icons8-x-logo-50.png';
import instagramLogo from './images/logos/icons8-instagram-logo-94.png';
import youtubeLogo from './images/logos/icons8-youtube-logo-48.png';
import linkedinLogo from './images/logos/icons8-linkedin-logo-48.png';

function App() {
  const [currentPage, setCurrentPage] = React.useState('home');

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleLoginClose = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'login') {
    return <Login onClose={handleLoginClose} />;
  }

  return (
    <>
      <div className="App">
        <NavBar onLoginClick={handleLoginClick} />

        <section className="hero-section" id="home">
          <div className="hero-decorations">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
            <div className="circle circle-4"></div>
            <div className="circle circle-5"></div>
            <div className="circle circle-6"></div>
          </div>

          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-tag">
                <span className="tag-dot"></span>
                <span className="tag-text">Time to party</span>
              </div>

              <h1 className="hero-title">
                Organization
                <br />
                <span className="title-of">of</span>
                <br />
                <span className="title-highlight">events</span>
              </h1>

              <p className="hero-description">
                Plan, manage, and execute your events with ease. Our platform 
                provides all the tools you need to create memorable experiences 
                and connect with your audience.
              </p>

              <div className="hero-buttons">
                <button className="btn-primary">
                  Book event
                  <span className="btn-arrow">→</span>
                </button>
                <a className="btn-secondary" href="#s-events">
                  See events
                  <span className="btn-arrow">→</span>
                </a>
              </div>
            </div>

            <div className="hero-image">
              <div className="image-overlay"></div>
              <img 
                src={partyImage} 
                alt="Party event" 
              />
            </div>
          </div>
        </section>

        {/* Successful Recent Events Section */}
        <section className="events-section" id="s-events">
          <div className="events-container">
            <h2 className="events-title">Our Successful Recent Events</h2>
            
            <div className="events-grid">
              <div className="event-card">
                <div className="event-image">
                  <img src={bdayImage} alt="Birthday Celebration" />
                </div>
                <div className="event-details">
                  <h3 className="event-name">Birthday Celebration</h3>
                  <p className="event-description">
                    Create magical moments with themed decorations, entertaining activities, and joyful celebrations for all ages.
                  </p>
                </div>
              </div>

              <div className="event-card">
                <div className="event-image">
                  <img src={weddingImge} alt="The Wedding Couple" />
                </div>
                <div className="event-details">
                  <h3 className="event-name">The Wedding Couple</h3>
                  <p className="event-description">
                    Celebrate love, cherish moments, and experience unforgettable joy with stunning ambience and heartwarming details.
                  </p>
                </div>
              </div>

              <div className="event-card">
                <div className="event-image">
                  <img src={musiconcertImage} alt="Music Concert" />
                </div>
                <div className="event-details">
                  <h3 className="event-name">Music Concert</h3>
                  <p className="event-description">
                    Experience electrifying performances with world-class artists on stage delivering unforgettable musical moments for all.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="upcoming-section" id="events">
          <div className="upcoming-container">
            <h2 className="upcoming-title">Upcoming Events</h2>
            
            <div className="upcoming-grid">
              <div className="upcoming-card">
                <div className="upcoming-date">
                  <span className="date-day">19</span>
                  <span className="date-month">JAN</span>
                </div>
                <div className="upcoming-content">
                  <h3 className="upcoming-event-name">Winter Music Festival</h3>
                  <p className="upcoming-location">
                    <span className="location-icon">📍</span> The Celebration Sphere
                  </p>
                  <p className="upcoming-time">
                    <span className="time-icon">🕐</span> 6:00 PM - 11:00 PM
                  </p>
                  <button className="upcoming-btn">Register Now</button>
                </div>
              </div>

              <div className="upcoming-card">
                <div className="upcoming-date">
                  <span className="date-day">22</span>
                  <span className="date-month">JAN</span>
                </div>
                <div className="upcoming-content">
                  <h3 className="upcoming-event-name">Corporate Gala Dinner</h3>
                  <p className="upcoming-location">
                    <span className="location-icon">📍</span> Grand Hotel The Destiny Convention
                  </p>
                  <p className="upcoming-time">
                    <span className="time-icon">🕐</span> 7:30 PM - 10:30 PM
                  </p>
                  <button className="upcoming-btn">Register Now</button>
                </div>
              </div>

              <div className="upcoming-card">
                <div className="upcoming-date">
                  <span className="date-day">28</span>
                  <span className="date-month">FEB</span>
                </div>
                <div className="upcoming-content">
                  <h3 className="upcoming-event-name">Art & Culture Exhibition</h3>
                  <p className="upcoming-location">
                    <span className="location-icon">📍</span> Museum of Modern Art
                  </p>
                  <p className="upcoming-time">
                    <span className="time-icon">🕐</span> 10:00 AM - 6:00 PM
                  </p>
                  <button className="upcoming-btn">Register Now</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section" id="services">
          <div className="services-container">
            <div className="services-left">
              <p className="services-kicker">Our Services</p>
              <h2 className="services-title">What We Offer</h2>
              <p className="services-subtitle">
                Each event and client is unique, and we believe our services should be as well. 
                We know what hiring a planner is all about!
              </p>

              <ul className="services-list">
                <li>Managing Your Guest List</li>
                <li>Unforgettable Timelines</li>
                <li>Wedding Cakes</li>
                <li>Entertainment</li>
                <li>Flower Bouquets</li>
              </ul>

              <button className="services-btn">View All Services</button>
            </div>

            <div className="services-right">
              <div className="services-blob"></div>
              <div className="service-card">
                <div className="service-icon">💐</div>
                <p className="service-name">Flower Bouquets</p>
              </div>
              <div className="service-card">
                <div className="service-icon">🎂</div>
                <p className="service-name">Wedding Cakes</p>
              </div>
              <div className="service-card">
                <div className="service-icon">🏛️</div>
                <p className="service-name">Venue Selection</p>
              </div>
              <div className="service-card">
                <div className="service-icon">✉️</div>
                <p className="service-name">Invitation Cards</p>
              </div>
            </div>
          </div>
        </section>

        
        {/* Celebration Banner Section */}
        <section className="celebration-section">
          <div className="celebration-overlay"></div>
          <div className="celebration-content">
            <p className="celebration-kicker">We Take Care Of Preparation</p>
            <h2 className="celebration-title">You Enjoy The Celebration!</h2>
            <p className="celebration-subtitle">
              Each event and client is unique, and we believe our services should be as well. We know what
              hiring a planner is all about!
            </p>
          </div>
        </section>

{/* About Us Section */}
        <section className="about-section" id="about">
          <div className="about-overlay"></div>
          <div className="about-container">
            <div className="about-content">
              <p className="about-kicker">About Us</p>
              <h2 className="about-title">We Craft Memorable Celebrations</h2>
              <p className="about-subtitle">
                We blend creative decor, meticulous planning, and seamless execution to turn every milestone
                into a signature experience. From intimate gatherings to grand galas, our team designs moments
                that feel effortless and unforgettable.
              </p>

              <ul className="about-list">
                <li>Custom themes and floral artistry</li>
                <li>End-to-end planning and coordination</li>
                <li>Immersive lighting and stage design</li>
                <li>Guest experience and hospitality management</li>
              </ul>

              <div className="about-cta">
                <button className="about-btn">Know More</button>
                <p className="about-note">Available for weddings, corporate galas, and social events.</p>
              </div>
            </div>

            <div className="about-stats">
              <div className="stat-card">
                <h3>250+</h3>
                <p>Events delivered with bespoke decor</p>
              </div>
              <div className="stat-card">
                <h3>98%</h3>
                <p>Client satisfaction across all engagements</p>
              </div>
              <div className="stat-card">
                <h3>50+</h3>
                <p>Vendor partners for flawless execution</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="contact-section" id="contact">
          <div className="contact-overlay"></div>
          <div className="contact-container">
            <div className="contact-content">
              <p className="contact-kicker">Get In Touch</p>
              <h2 className="contact-title">Ready to Create Your Event?</h2>
              <p className="contact-subtitle">
                Let's bring your vision to life. Contact us today to discuss your event requirements and receive a personalized proposal.
              </p>
            </div>

            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Event Type" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Tell us about your event..." rows="4" required></textarea>
              </div>
              <button type="submit" className="contact-btn">Send Inquiry</button>
            </form>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-top">
              <div className="footer-branding">
                <h3 className="footer-logo">
                  <span className="footer-logo-event">asas</span>
                  <span className="footer-logo-planners">EVENTS</span>
                </h3>
                <div className="footer-socials">
                  <a href="#" aria-label="Facebook"><img src={facebookLogo} alt="Facebook" /></a>
                  <a href="#" aria-label="Twitter"><img src={twitterLogo} alt="Twitter" /></a>
                  <a href="#" aria-label="Instagram"><img src={instagramLogo} alt="Instagram" /></a>
                  <a href="#" aria-label="YouTube"><img src={youtubeLogo} alt="YouTube" /></a>
                  <a href="#" aria-label="LinkedIn"><img src={linkedinLogo} alt="LinkedIn" /></a>
                </div>
              </div>

              <div className="footer-columns">
                <div className="footer-column">
                  <h4>About Us</h4>
                  <p>Suspendisse interdum, nisl nec efficitur auctor, odio Iconque ligula, se sodales tortor turpis at elit. Aliquam lacipsium ut odio variusid interdum lac dictum.</p>
                </div>

                <div className="footer-column">
                  <h4>Events</h4>
                  <ul>
                    <li><a href="#events">Festival Celebration</a></li>
                    <li><a href="#events">Bachelor Party</a></li>
                    <li><a href="#events">Private Party</a></li>
                    <li><a href="#events">Family Celebration</a></li>
                    <li><a href="#events">Birthday</a></li>
                    <li><a href="#events">Corporate</a></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4>Quick Links</h4>
                  <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#events">Events</a></li>
                    <li><a href="#contact">Contact</a></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4>Contact Info</h4>
                  <p className="contact-info">
                    <strong>Street:</strong> Silicon Valley<br />
                    Infocity, Patia, Bhubaneswar.
                  </p>
                  <p className="contact-info">
                    <strong>Phone:</strong> +91 123 321 9876
                  </p>
                  <p className="contact-info">
                    <strong>E-mail:</strong> <a href="mailto:info@asasEvents.com">info@asasEvents.com</a>
                  </p>
                  <p className="contact-info">
                    <strong>Website:</strong> <a href="#">https://asasEvents.com</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="copyright">© Copyright {new Date().getFullYear()} <span className="footer-brand">asas×event</span>. All Rights Reserved.</p>
              <p className="footer-credit">Design by asas</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;