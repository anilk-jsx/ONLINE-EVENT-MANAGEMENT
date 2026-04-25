import React from 'react';

function BookEvents({ bookedEvents, setShowBookingForm }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="book-events-content">
            <div className="section-header">
                <h1>Organized Events</h1>
                <p>Manage your organized events and their status</p>
            </div>
            <div className="booked-events-list">
                {bookedEvents.map(event => (
                    <div key={event._id} className="booked-event-card">
                        <div className="booking-header">
                            <h4>{event.title}</h4>
                            <span className={`status-badge ${event.status?.toLowerCase() || 'pending'}`}>
                                {event.status || 'Pending'}
                            </span>
                        </div>
                        <div className="booking-details">
                            <div className="booking-info">
                                <div className="info-row">
                                    <span className="info-label">Event ID:</span>
                                    <span>{event._id?.slice(-6).toUpperCase()}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Event Date:</span>
                                    <span>{formatDate(event.date)} at {event.time}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Location:</span>
                                    <span>{event.location}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Created On:</span>
                                    <span>{event.created_at ? formatDate(event.created_at) : formatDate(event.date)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Event Type:</span>
                                    <span style={{ textTransform: 'capitalize' }}>{event.event_type || 'Public'}</span>
                                </div>
                            </div>
                            <div className="booking-summary">
                                <div className="summary-item">
                                    <span className="summary-label">Total Seats:</span>
                                    <span className="summary-value">{event.available_seats}</span>
                                </div>
                                <div className="summary-item total">
                                    <span className="summary-label">Ticket Price:</span>
                                    <span className="summary-value">₹{(event.price || 0).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Add Button */}
            <button 
                className="floating-add-btn"
                onClick={() => setShowBookingForm(true)}
                title="Create New Event"
            >
                +
            </button>
        </div>
    );
}

export default BookEvents;