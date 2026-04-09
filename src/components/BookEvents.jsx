import React from 'react';

function BookEvents({ bookedEvents, setShowBookingForm }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="book-events-content">
            <div className="section-header">
                <h1>Booked Events</h1>
                <p>Manage your event bookings and their status</p>
            </div>
            <div className="booked-events-list">
                {bookedEvents.map(event => (
                    <div key={event.bookingId} className="booked-event-card">
                        <div className="booking-header">
                            <h4>{event.title}</h4>
                            <span className={`status-badge ${event.status.toLowerCase()}`}>
                                {event.status}
                            </span>
                        </div>
                        <div className="booking-details">
                            <div className="booking-info">
                                <div className="info-row">
                                    <span className="info-label">Booking ID:</span>
                                    <span>{event.bookingId}</span>
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
                                    <span className="info-label">Booked On:</span>
                                    <span>{formatDate(event.bookingDate)}</span>
                                </div>
                            </div>
                            <div className="booking-summary">
                                <div className="summary-item">
                                    <span className="summary-label">Tickets:</span>
                                    <span className="summary-value">{event.tickets}</span>
                                </div>
                                <div className="summary-item total">
                                    <span className="summary-label">Total Amount:</span>
                                    <span className="summary-value">₹{event.totalAmount.toLocaleString('en-IN')}</span>
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
                title="Book New Event"
            >
                +
            </button>
        </div>
    );
}

export default BookEvents;