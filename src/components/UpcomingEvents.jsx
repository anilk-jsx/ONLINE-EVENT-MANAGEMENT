import React, { useState, useMemo } from 'react';

function UpcomingEvents({ upcomingEvents, registeredEventIds, handleRegisterEvent }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventDetail, setShowEventDetail] = useState(false);

    const categories = ['All', 'Technology', 'Marketing', 'Education', 'Business', 'Programming'];

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Filter events based on search, category, and price
    const filteredEvents = useMemo(() => {
        return upcomingEvents.filter(event => {
            const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.organizer_id?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
            const matchesPrice = event.price >= priceRange[0] && event.price <= priceRange[1];

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [upcomingEvents, searchTerm, selectedCategory, priceRange]);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowEventDetail(true);
    };

    return (
        <div className="upcoming-events-content">
            <div className="section-header">
                <h1>Upcoming Events</h1>
                <p>Discover and explore exciting events happening soon</p>
            </div>

            {/* Filter Panel */}
            <div className="filter-panel">
                <div className="filter-section">
                    <label>Search Events</label>
                    <input
                        type="text"
                        placeholder="Search by title, organizer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-section">
                    <label>Category</label>
                    <div className="category-filter">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-section">
                    <label>Price Range: ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}</label>
                    <input
                        type="range"
                        min="0"
                        max="50000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="price-range-slider"
                    />
                </div>

                <div className="filter-reset">
                    <button
                        className="reset-btn"
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('All');
                            setPriceRange([0, 50000]);
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Results Count */}
            <div className="results-info">
                <p>Showing {filteredEvents.length} of {upcomingEvents.length} events</p>
            </div>

            {/* Events Grid */}
            <div className="events-grid">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                    <div key={event._id} className="event-card" onClick={() => handleEventClick(event)}>
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
                                    <span>{event.organizer_id?.name || 'Unknown'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-icon">⏱️</span>
                                    <span>{event.duration}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-icon">🪑</span>
                                    <span>{event.available_seats_remaining} seats available</span>
                                </div>
                            </div>
                            <div className="event-card-footer">
                                <button
                                    className={`register-btn ${
                                        registeredEventIds.includes(event._id) ? 'registered' : ''
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRegisterEvent(event._id);
                                    }}
                                    disabled={registeredEventIds.includes(event._id) || event.available_seats_remaining === 0}
                                >
                                    {registeredEventIds.includes(event._id)
                                        ? '✓ Registered'
                                        : event.available_seats_remaining === 0
                                        ? 'Sold Out'
                                        : 'Register Now'
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="no-events-message">
                        <p>No events found matching your filters.</p>
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            {showEventDetail && selectedEvent && (
                <div className="modal-overlay" onClick={() => setShowEventDetail(false)}>
                    <div className="event-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedEvent.title}</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowEventDetail(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <div className="modal-info-row">
                                <span className="modal-label">Category:</span>
                                <span className="modal-value">{selectedEvent.category}</span>
                            </div>
                            <div className="modal-info-row">
                                <span className="modal-label">Date & Time:</span>
                                <span className="modal-value">{formatDate(selectedEvent.date)} at {selectedEvent.time}</span>
                            </div>
                            <div className="modal-info-row">
                                <span className="modal-label">Location:</span>
                                <span className="modal-value">{selectedEvent.location}</span>
                            </div>
                            <div className="modal-info-row">
                                <span className="modal-label">Organizer:</span>
                                <span className="modal-value">{selectedEvent.organizer_id?.name || 'Unknown'}</span>
                            </div>
                            <div className="modal-info-row">
                                <span className="modal-label">Duration:</span>
                                <span className="modal-value">{selectedEvent.duration}</span>
                            </div>
                            <div className="modal-info-row">
                                <span className="modal-label">Available Seats:</span>
                                <span className="modal-value">{selectedEvent.available_seats_remaining}</span>
                            </div>
                            <div className="modal-info-row">
                                <span className="modal-label">Price:</span>
                                <span className="modal-value price">₹{selectedEvent.price.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="modal-description">
                                <h4>About This Event</h4>
                                <p>{selectedEvent.description}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowEventDetail(false)}
                            >
                                Close
                            </button>
                            <button
                                className={`btn-register ${
                                    registeredEventIds.includes(selectedEvent._id) ? 'registered' : ''
                                }`}
                                onClick={() => {
                                    handleRegisterEvent(selectedEvent._id);
                                    setShowEventDetail(false);
                                }}
                                disabled={registeredEventIds.includes(selectedEvent._id) || selectedEvent.available_seats_remaining === 0}
                            >
                                {registeredEventIds.includes(selectedEvent._id)
                                    ? '✓ Already Registered'
                                    : selectedEvent.available_seats_remaining === 0
                                    ? 'Sold Out'
                                    : 'Register Now'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpcomingEvents;