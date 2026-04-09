import React from 'react';

function UpcomingEvents({ upcomingEvents, registeredEventIds, handleRegisterEvent }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="upcoming-events-content">
            <div className="section-header">
                <h1>Upcoming Events</h1>
                <p>Discover and explore exciting events happening soon</p>
            </div>
            <div className="events-grid">
                {upcomingEvents.map(event => (
                    <div key={event.id} className="event-card">
                        <div className="event-card-header">
                            <div className="event-category-tag">{event.category}</div>
                            <div className="event-price">₹{event.price.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="event-card-content">
                            <h3>{event.title}</h3>
                            <p className="event-description">{event.description}</p>
                            <div className="event-details">
                                <div className="detail-row">
                                    <span className="detail-icon">📅</span>
                                    <span>{formatDate(event.date)} at {event.time}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-icon">📍</span>
                                    <span>{event.location}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-icon">🏢</span>
                                    <span>{event.organizer}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-icon">⏱️</span>
                                    <span>{event.duration}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-icon">🪑</span>
                                    <span>{event.availableSeats} seats available</span>
                                </div>
                            </div>
                            <div className="event-card-footer">
                                <button 
                                    className={`register-btn ${
                                        registeredEventIds.includes(event.id) ? 'registered' : ''
                                    }`}
                                    onClick={() => handleRegisterEvent(event.id)}
                                    disabled={registeredEventIds.includes(event.id) || event.availableSeats === 0}
                                >
                                    {registeredEventIds.includes(event.id) 
                                        ? '✓ Registered' 
                                        : event.availableSeats === 0 
                                        ? 'Sold Out' 
                                        : 'Register Now'
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UpcomingEvents;