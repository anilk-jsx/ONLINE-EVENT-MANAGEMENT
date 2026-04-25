import React, { useState, useEffect } from 'react';

function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', category: 'Other', date: '',
        time: '', location: '', price: '', available_seats: '',
        duration: '', event_type: 'public'
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const categories = ['All', 'Technology', 'Marketing', 'Education', 'Business', 'Programming', 'Other'];

    // Fetch all events
    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5001/api/events/admin/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setEvents(data.events);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Create new event
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location || !newEvent.available_seats || !newEvent.duration) {
            alert('Please fill in all required fields');
            return;
        }
        setCreating(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5001/api/events/admin/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...newEvent,
                    price: Number(newEvent.price) || 0,
                    available_seats: Number(newEvent.available_seats)
                })
            });
            const data = await response.json();
            if (data.success) {
                setEvents(prev => [data.event, ...prev]);
                setShowCreateForm(false);
                setNewEvent({
                    title: '', description: '', category: 'Other', date: '',
                    time: '', location: '', price: '', available_seats: '',
                    duration: '', event_type: 'public'
                });
            } else {
                alert(data.message || 'Failed to create event');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event');
        } finally {
            setCreating(false);
        }
    };

    // Delete event
    const handleDeleteEvent = async (eventId, eventTitle) => {
        if (!confirm(`Are you sure you want to delete "${eventTitle}"? This will also remove all registrations.`)) return;
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5001/api/events/admin/${eventId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setEvents(prev => prev.filter(e => e._id !== eventId));
            } else {
                alert(data.message || 'Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event');
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (event.organizer_id?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const totalBookings = events.reduce((sum, e) => sum + (e.registered_count || 0), 0);
    const totalRevenue = events.reduce((sum, e) => sum + ((e.registered_count || 0) * (e.price || 0)), 0);

    const inputStyle = {
        width: '100%', padding: '10px 14px', borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
        color: 'white', fontSize: '0.9rem', outline: 'none'
    };
    const labelStyle = {
        display: 'block', color: 'rgba(255,255,255,0.7)',
        fontSize: '0.82rem', marginBottom: '5px', fontWeight: '500'
    };

    if (loading) {
        return (
            <div className="admin-content">
                <div className="admin-header">
                    <h1>Events Management</h1>
                    <p>Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Events Management</h1>
                <p>View all events and their details</p>
            </div>

            {/* Events Stats */}
            <div className="events-stats">
                <div className="stat-box">
                    <h4>{events.length}</h4>
                    <p>Total Events</p>
                </div>
                <div className="stat-box">
                    <h4>{totalBookings}</h4>
                    <p>Total Registrations</p>
                </div>
                <div className="stat-box">
                    <h4>₹{totalRevenue.toLocaleString('en-IN')}</h4>
                    <p>Estimated Revenue</p>
                </div>
                <div className="stat-box">
                    <h4>{events.filter(e => e.status === 'approved').length}</h4>
                    <p>Approved</p>
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

            {/* Create Event Button */}
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    style={{
                        padding: '12px 28px', borderRadius: '12px', border: 'none',
                        background: showCreateForm
                            ? 'rgba(255,255,255,0.1)'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white', fontSize: '0.9rem', fontWeight: '600',
                        cursor: 'pointer', transition: 'all 0.3s'
                    }}
                >
                    {showCreateForm ? '✕ Cancel' : '+ Create New Event'}
                </button>
            </div>

            {/* Create Event Form */}
            {showCreateForm && (
                <div style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)', padding: '28px',
                    marginBottom: '24px'
                }}>
                    <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.1rem' }}>
                        Create New Event
                    </h3>
                    <form onSubmit={handleCreateEvent}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Event Title *</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent(p => ({ ...p, title: e.target.value }))}
                                    placeholder="Enter event title"
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Description</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Event description..."
                                    rows="3"
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Category</label>
                                <select
                                    value={newEvent.category}
                                    onChange={(e) => setNewEvent(p => ({ ...p, category: e.target.value }))}
                                    style={{ ...inputStyle, background: 'rgba(255,255,255,0.08)' }}
                                >
                                    {['Technology', 'Marketing', 'Education', 'Business', 'Programming', 'Other'].map(c => (
                                        <option key={c} value={c} style={{ background: '#1a1a2e' }}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Event Type</label>
                                <select
                                    value={newEvent.event_type}
                                    onChange={(e) => setNewEvent(p => ({ ...p, event_type: e.target.value }))}
                                    style={{ ...inputStyle, background: 'rgba(255,255,255,0.08)' }}
                                >
                                    <option value="public" style={{ background: '#1a1a2e' }}>Public</option>
                                    <option value="private" style={{ background: '#1a1a2e' }}>Private</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Date *</label>
                                <input
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent(p => ({ ...p, date: e.target.value }))}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Time *</label>
                                <input
                                    type="time"
                                    value={newEvent.time}
                                    onChange={(e) => setNewEvent(p => ({ ...p, time: e.target.value }))}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Location *</label>
                                <input
                                    type="text"
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent(p => ({ ...p, location: e.target.value }))}
                                    placeholder="Event venue"
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Duration *</label>
                                <input
                                    type="text"
                                    value={newEvent.duration}
                                    onChange={(e) => setNewEvent(p => ({ ...p, duration: e.target.value }))}
                                    placeholder="e.g. 2 hours"
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Available Seats *</label>
                                <input
                                    type="number"
                                    value={newEvent.available_seats}
                                    onChange={(e) => setNewEvent(p => ({ ...p, available_seats: e.target.value }))}
                                    placeholder="100"
                                    min="1"
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Price (₹)</label>
                                <input
                                    type="number"
                                    value={newEvent.price}
                                    onChange={(e) => setNewEvent(p => ({ ...p, price: e.target.value }))}
                                    placeholder="0 for free"
                                    min="0"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '22px' }}>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                style={{
                                    padding: '10px 24px', borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
                                    color: 'white', cursor: 'pointer', fontSize: '0.9rem'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={creating}
                                style={{
                                    padding: '10px 28px', borderRadius: '10px', border: 'none',
                                    background: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)',
                                    color: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600'
                                }}
                            >
                                {creating ? 'Creating...' : '✓ Create Event'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Events List */}
            <div className="events-list">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <div key={event._id} className="event-admin-card">
                            <div className="event-header">
                                <div className="event-title-section">
                                    <h3>{event.title}</h3>
                                    <div className="event-meta-tags">
                                        <span className={`category-tag category-${event.category.toLowerCase()}`}>
                                            {event.category}
                                        </span>
                                        <span className={`status-badge ${event.status}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="btn-reject"
                                    onClick={() => handleDeleteEvent(event._id, event.title)}
                                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                            <div className="event-grid">
                                <div className="event-info-column">
                                    <p><strong>Organizer:</strong> {event.organizer_id?.name || 'Admin'}</p>
                                    <p><strong>Date & Time:</strong> {formatDate(event.date)} at {event.time}</p>
                                    <p><strong>Location:</strong> {event.location}</p>
                                    <p><strong>Price:</strong> ₹{(event.price || 0).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="event-stats-column">
                                    <div className="event-stat-item">
                                        <span className="stat-label">Registrations</span>
                                        <span className="stat-value">{event.registered_count || 0}</span>
                                    </div>
                                    <div className="event-stat-item">
                                        <span className="stat-label">Total Seats</span>
                                        <span className="stat-value">{event.available_seats}</span>
                                    </div>
                                    <div className="event-stat-item">
                                        <span className="stat-label">Occupancy</span>
                                        <span className="stat-value">
                                            {event.available_seats > 0
                                                ? Math.round(((event.registered_count || 0) / event.available_seats) * 100)
                                                : 0}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="event-bar">
                                <div
                                    className="occupancy-bar"
                                    style={{
                                        width: `${event.available_seats > 0
                                            ? Math.min(((event.registered_count || 0) / event.available_seats) * 100, 100)
                                            : 0}%`
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
