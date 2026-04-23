import React, { useState } from 'react';

function AdminEvents() {
    const [events] = useState([
        {
            id: 1,
            title: 'Tech Conference 2026',
            organizer: 'Tech Corp Inc.',
            date: '2026-03-15',
            time: '9:00 AM',
            category: 'Technology',
            status: 'Approved',
            totalBookings: 45,
            availableSeats: 155,
            price: 24999
        },
        {
            id: 2,
            title: 'Digital Marketing Summit',
            organizer: 'Marketing Pro Ltd.',
            date: '2026-04-20',
            time: '10:00 AM',
            category: 'Marketing',
            status: 'Approved',
            totalBookings: 28,
            availableSeats: 57,
            price: 16999
        },
        {
            id: 3,
            title: 'AI & Machine Learning Workshop',
            organizer: 'AI Academy',
            date: '2026-05-10',
            time: '2:00 PM',
            category: 'Education',
            status: 'Approved',
            totalBookings: 38,
            availableSeats: 22,
            price: 12499
        },
        {
            id: 4,
            title: 'Startup Pitch Competition',
            organizer: 'Startup Hub',
            date: '2026-06-05',
            time: '11:00 AM',
            category: 'Business',
            status: 'Approved',
            totalBookings: 156,
            availableSeats: 44,
            price: 8299
        },
        {
            id: 5,
            title: 'Web Development Bootcamp',
            organizer: 'Tech Academy',
            date: '2026-05-15',
            time: '10:00 AM',
            category: 'Programming',
            status: 'Approved',
            totalBookings: 32,
            availableSeats: 18,
            price: 18999
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const categories = ['All', 'Technology', 'Marketing', 'Education', 'Business', 'Programming'];

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const totalEvents = events.length;
    const totalBookings = events.reduce((sum, e) => sum + e.totalBookings, 0);
    const totalRevenue = events.reduce((sum, e) => sum + (e.totalBookings * e.price), 0);

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Events Management</h1>
                <p>View all events and their details</p>
            </div>

            {/* Events Stats */}
            <div className="events-stats">
                <div className="stat-box">
                    <h4>{totalEvents}</h4>
                    <p>Total Events</p>
                </div>
                <div className="stat-box">
                    <h4>{totalBookings}</h4>
                    <p>Total Bookings</p>
                </div>
                <div className="stat-box">
                    <h4>₹{(totalRevenue / 100000).toFixed(1)}L</h4>
                    <p>Estimated Revenue</p>
                </div>
                <div className="stat-box">
                    <h4>{filteredEvents.length}</h4>
                    <p>Displayed</p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="events-filter">
                <input
                    type="text"
                    placeholder="Search by event title or organizer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <div className="category-buttons">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`category-btn ${categoryFilter === category ? 'active' : ''}`}
                            onClick={() => setCategoryFilter(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events List */}
            <div className="events-list">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <div key={event.id} className="event-admin-card">
                            <div className="event-header">
                                <div className="event-title-section">
                                    <h3>{event.title}</h3>
                                    <div className="event-meta-tags">
                                        <span className={`category-tag category-${event.category.toLowerCase()}`}>
                                            {event.category}
                                        </span>
                                        <span className={`status-badge ${event.status.toLowerCase()}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="event-grid">
                                <div className="event-info-column">
                                    <p><strong>Organizer:</strong> {event.organizer}</p>
                                    <p><strong>Date & Time:</strong> {formatDate(event.date)} at {event.time}</p>
                                    <p><strong>Price:</strong> ₹{event.price.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="event-stats-column">
                                    <div className="event-stat-item">
                                        <span className="stat-label">Bookings</span>
                                        <span className="stat-value">{event.totalBookings}</span>
                                    </div>
                                    <div className="event-stat-item">
                                        <span className="stat-label">Available</span>
                                        <span className="stat-value">{event.availableSeats}</span>
                                    </div>
                                    <div className="event-stat-item">
                                        <span className="stat-label">Occupancy</span>
                                        <span className="stat-value">
                                            {Math.round((event.totalBookings / (event.totalBookings + event.availableSeats)) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="event-bar">
                                <div
                                    className="occupancy-bar"
                                    style={{
                                        width: `${(event.totalBookings / (event.totalBookings + event.availableSeats)) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-events-result">
                        <p>No events found matching your filters</p>
                    </div>
                )}
            </div>

            {/* Results Footer */}
            <div className="results-footer">
                <p>Showing {filteredEvents.length} of {events.length} events</p>
            </div>
        </div>
    );
}

export default AdminEvents;
