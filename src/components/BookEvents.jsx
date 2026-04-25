import React, { useState, useRef, useEffect } from 'react';

function BookEvents({ bookedEvents, setShowBookingForm, handleEditEvent }) {
    const [activeMenu, setActiveMenu] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editForm, setEditForm] = useState({});
    const menuRef = useRef(null);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpenEdit = (event) => {
        setEditingEvent(event);
        setEditForm({
            title: event.title,
            description: event.description || '',
            category: event.category || 'Other',
            event_type: event.event_type || 'public',
            date: event.date,
            time: event.time,
            location: event.location,
            available_seats: event.available_seats,
            price: event.price || 0,
            duration: event.duration || ''
        });
        setActiveMenu(null);
    };

    const handleCloseEdit = () => {
        setEditingEvent(null);
        setEditForm({});
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        if (!editingEvent) return;

        const isApproved = editingEvent.status === 'approved';
        const dataToSend = isApproved
            ? { price: Number(editForm.price) }
            : {
                ...editForm,
                price: Number(editForm.price),
                available_seats: Number(editForm.available_seats)
              };

        const success = await handleEditEvent(editingEvent._id, dataToSend);
        if (success) {
            handleCloseEdit();
        }
    };

    const isApproved = editingEvent?.status === 'approved';

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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span className={`status-badge ${event.status?.toLowerCase() || 'pending'}`}>
                                    {event.status || 'Pending'}
                                </span>
                                <div className="three-dot-menu-wrapper" ref={activeMenu === event._id ? menuRef : null}>
                                    <button 
                                        className="three-dot-btn"
                                        onClick={() => setActiveMenu(activeMenu === event._id ? null : event._id)}
                                    >
                                        ⋮
                                    </button>
                                    {activeMenu === event._id && (
                                        <div className="dropdown-menu">
                                            <button className="dropdown-item" onClick={() => handleOpenEdit(event)}>
                                                ✏️ Edit
                                            </button>
                                            <button className="dropdown-item delete-item" disabled>
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
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

            {/* Edit Event Modal */}
            {editingEvent && (
                <div className="modal-overlay" onClick={handleCloseEdit}>
                    <div className="booking-form-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{isApproved ? 'Edit Ticket Price' : 'Edit Event'}</h3>
                            <button className="close-btn" onClick={handleCloseEdit}>×</button>
                        </div>

                        {isApproved && (
                            <div style={{ 
                                padding: '0 25px', marginBottom: '10px',
                                background: 'rgba(255, 193, 7, 0.15)', 
                                border: '1px solid rgba(255, 193, 7, 0.3)', 
                                borderRadius: '8px', 
                                padding: '12px 20px',
                                margin: '0 25px 15px 25px',
                                color: '#ffc107',
                                fontSize: '0.85rem'
                            }}>
                                ⚠️ This event is approved. Only the ticket price can be changed.
                            </div>
                        )}

                        <form onSubmit={handleSubmitEdit} className="booking-form">
                            <div className="form-group">
                                <label>Event Title</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm(prev => ({...prev, title: e.target.value}))}
                                    required
                                    disabled={isApproved}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))}
                                    rows="2"
                                    disabled={isApproved}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm(prev => ({...prev, category: e.target.value}))}
                                        disabled={isApproved}
                                    >
                                        {['Technology', 'Marketing', 'Education', 'Business', 'Programming', 'Other'].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Event Type</label>
                                    <select
                                        value={editForm.event_type}
                                        onChange={(e) => setEditForm(prev => ({...prev, event_type: e.target.value}))}
                                        disabled={isApproved}
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Event Date</label>
                                    <input
                                        type="date"
                                        value={editForm.date}
                                        onChange={(e) => setEditForm(prev => ({...prev, date: e.target.value}))}
                                        required
                                        disabled={isApproved}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Event Time</label>
                                    <input
                                        type="time"
                                        value={editForm.time}
                                        onChange={(e) => setEditForm(prev => ({...prev, time: e.target.value}))}
                                        required
                                        disabled={isApproved}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input
                                        type="text"
                                        value={editForm.duration}
                                        onChange={(e) => setEditForm(prev => ({...prev, duration: e.target.value}))}
                                        required
                                        disabled={isApproved}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Event Location</label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm(prev => ({...prev, location: e.target.value}))}
                                    required
                                    disabled={isApproved}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Available Seats</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editForm.available_seats}
                                        onChange={(e) => setEditForm(prev => ({...prev, available_seats: e.target.value}))}
                                        required
                                        disabled={isApproved}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ticket Price (₹)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm(prev => ({...prev, price: e.target.value}))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseEdit}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookEvents;