import React, { useState } from 'react';
import SwipeToPay from './SwipeToPay';

function DashboardHome({ userProfile, registeredEvents, bookedEvents, handleUpdateRegistration }) {
    const [editingEvent, setEditingEvent] = useState(null);
    const [newSeatCount, setNewSeatCount] = useState(0);
    const [viewingQr, setViewingQr] = useState(null);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Calculate stats
    const pendingBookings = bookedEvents.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookedEvents.filter(b => b.status === 'approved').length;
    const completedBookings = 0; // Or based on another logic
    const totalAmountSpent = registeredEvents.reduce((sum, e) => sum + (e.total_amount || 0), 0);

    // Get recent activities (last 5)
    const getRecentActivities = () => {
        const activities = [];

        // Add recent bookings (events user organized)
        bookedEvents.slice(-3).forEach((booking, index) => {
            activities.push({
                id: `booking-${booking._id}`,
                type: 'booking',
                title: `Organized: ${booking.title}`,
                date: booking.created_at || booking.date,
                status: booking.status,
                timestamp: new Date(booking.created_at || booking.date).getTime(),
                icon: '🎫'
            });
        });

        // Add recent registrations
        registeredEvents.slice(-3).forEach((event, index) => {
            activities.push({
                id: `registered-${event._id || event.registrationId}`,
                type: 'registration',
                title: `Registered: ${event.title}`,
                date: event.registrationDate,
                status: event.status,
                timestamp: new Date(event.registrationDate).getTime(),
                icon: '✓'
            });
        });

        // Sort by timestamp (newest first) and return top 5
        return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    };

    const recentActivities = getRecentActivities();

    const handleOpenEdit = (event) => {
        setEditingEvent(event);
        setNewSeatCount(event.number_of_seats + 1); // Start at current + 1
    };

    const handleCloseEdit = () => {
        setEditingEvent(null);
        setNewSeatCount(0);
    };

    const additionalSeats = editingEvent ? newSeatCount - editingEvent.number_of_seats : 0;
    const additionalAmount = editingEvent ? additionalSeats * editingEvent.event_price : 0;

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome back, {userProfile.name}! Here's your event overview.</p>
            </div>

            {/* Profile Section */}
            <div className="profile-section">
                <div className="profile-card">
                    <div className="profile-avatar">
                        {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder">
                                {userProfile.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h3>{userProfile.name}</h3>
                        <p className="profile-email">{userProfile.email}</p>
                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="detail-label">Phone:</span>
                                <span>{userProfile.mobile_number || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Location:</span>
                                <span>{userProfile.location || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Member Since:</span>
                                <span>{userProfile.created_at ? formatDate(userProfile.created_at) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon registered">
                        <span>📅</span>
                    </div>
                    <div className="stat-info">
                        <h3>{registeredEvents.length}</h3>
                        <p>Registered Events</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon booked">
                        <span>🎫</span>
                    </div>
                    <div className="stat-info">
                        <h3>{bookedEvents.length}</h3>
                        <p>Total Bookings</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon total">
                        <span>💰</span>
                    </div>
                    <div className="stat-info">
                        <h3>₹{totalAmountSpent.toLocaleString('en-IN')}</h3>
                        <p>Total Spent</p>
                    </div>
                </div>
            </div>

            {/* Additional Stats Grid */}
            <div className="additional-stats">
                <div className="mini-stat-card">
                    <div className="mini-stat-icon confirmed">
                        <span>✓</span>
                    </div>
                    <div className="mini-stat-content">
                        <h4>{confirmedBookings}</h4>
                        <p>Confirmed</p>
                    </div>
                </div>
                <div className="mini-stat-card">
                    <div className="mini-stat-icon pending">
                        <span>⏳</span>
                    </div>
                    <div className="mini-stat-content">
                        <h4>{pendingBookings}</h4>
                        <p>Pending</p>
                    </div>
                </div>
                <div className="mini-stat-card">
                    <div className="mini-stat-icon completed">
                        <span>🎉</span>
                    </div>
                    <div className="mini-stat-content">
                        <h4>{completedBookings}</h4>
                        <p>Completed</p>
                    </div>
                </div>
                <div className="mini-stat-card">
                    <div className="mini-stat-icon upcoming">
                        <span>🚀</span>
                    </div>
                    <div className="mini-stat-content">
                        <h4>{registeredEvents.length + bookedEvents.length}</h4>
                        <p>Total Events</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="recent-activity-section">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    {recentActivities.length > 0 ? (
                        recentActivities.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className="activity-icon">
                                    {activity.icon}
                                </div>
                                <div className="activity-details">
                                    <h4>{activity.title}</h4>
                                    <p className="activity-date">{formatDate(activity.date)}</p>
                                </div>
                                <div className="activity-status">
                                    <span className={`status-badge ${activity.status.toLowerCase()}`}>
                                        {activity.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-activity">No recent activities yet</p>
                    )}
                </div>
            </div>

            {/* Registered Events List */}
            <div className="registered-events-section">
                <h2>Events You're Registered For</h2>
                <div className="events-list">
                    {registeredEvents.length > 0 ? (
                        registeredEvents.map(event => (
                            <div key={event.registrationId || event._id} className="event-item">
                                <div className="event-main-info">
                                    <h4>{event.title}</h4>
                                    <div className="event-meta">
                                        <span className="event-date">{formatDate(event.date)} at {event.time}</span>
                                        <span className="event-location">{event.location}</span>
                                        <span className={`event-category ${event.category.toLowerCase()}`}>
                                            {event.category}
                                        </span>
                                    </div>
                                    <div className="event-meta" style={{ marginTop: '8px' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                            🪑 {event.number_of_seats} seat(s)
                                        </span>
                                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                            💰 ₹{(event.total_amount || 0).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                                <div className="event-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {event.qr_token && (
                                        <button 
                                            className="edit-registration-btn"
                                            style={{ background: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)' }}
                                            onClick={() => setViewingQr(event)}
                                            title="View QR Code"
                                        >
                                            📱 QR
                                        </button>
                                    )}
                                    {event.status !== 'cancelled' && (
                                        <button 
                                            className="edit-registration-btn"
                                            onClick={() => handleOpenEdit(event)}
                                            title="Add more seats"
                                        >
                                            ✏️ Edit
                                        </button>
                                    )}
                                    <span className={`status-badge ${event.status.toLowerCase()}`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-events">No registered events yet. Browse upcoming events to register!</p>
                    )}
                </div>
            </div>

            {/* Edit Registration Modal */}
            {editingEvent && (
                <div className="modal-overlay" onClick={handleCloseEdit}>
                    <div className="event-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Registration</h2>
                            <button className="close-btn" onClick={handleCloseEdit}>×</button>
                        </div>
                        <div className="modal-content">
                            <h3 style={{ color: 'white', marginBottom: '15px' }}>{editingEvent.title}</h3>
                            
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
                                    <span>Current Seats:</span>
                                    <span style={{ color: 'white', fontWeight: '600' }}>{editingEvent.number_of_seats}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)' }}>
                                    <span>Current Amount Paid:</span>
                                    <span style={{ color: 'white', fontWeight: '600' }}>₹{(editingEvent.total_amount || 0).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.8)' }}>
                                    New Total Seats (min: {editingEvent.number_of_seats + 1})
                                </label>
                                <input 
                                    type="number" 
                                    min={editingEvent.number_of_seats + 1} 
                                    value={newSeatCount} 
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || editingEvent.number_of_seats + 1;
                                        setNewSeatCount(Math.max(editingEvent.number_of_seats + 1, val));
                                    }}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '8px', 
                                        border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)',
                                        color: 'white', fontSize: '1rem'
                                    }}
                                />
                            </div>
                            
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
                                    <span>Additional Seats:</span>
                                    <span style={{ color: 'white', fontWeight: '600' }}>+{additionalSeats}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
                                    <span>Price per Seat:</span>
                                    <span style={{ color: 'white' }}>₹{editingEvent.event_price.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
                                    <span>Additional Payment:</span>
                                    <span style={{ color: '#ff4d6d' }}>₹{additionalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {additionalSeats > 0 && (
                                <SwipeToPay 
                                    amount={additionalAmount}
                                    disabled={additionalSeats <= 0}
                                    onPaymentComplete={() => {
                                        setTimeout(() => {
                                            handleUpdateRegistration(editingEvent.registrationId, newSeatCount);
                                            handleCloseEdit();
                                        }, 1000);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Viewing Modal */}
            {viewingQr && (
                <div className="modal-overlay" onClick={() => setViewingQr(null)}>
                    <div className="event-detail-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
                        <div className="modal-header">
                            <h2>Your Event Ticket</h2>
                            <button className="close-btn" onClick={() => setViewingQr(null)}>×</button>
                        </div>
                        <div className="modal-content" style={{ textAlign: 'center', padding: '20px 30px 30px' }}>
                            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', fontSize: '0.95rem' }}>
                                <strong style={{ color: 'white' }}>{viewingQr.title}</strong>
                            </p>

                            <div style={{
                                display: 'inline-block', padding: '20px',
                                background: 'white', borderRadius: '16px', marginBottom: '20px'
                            }}>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/verify/${viewingQr.qr_token}`)}`}
                                    alt="Event QR Code"
                                    width="200" height="200"
                                    style={{ display: 'block' }}
                                />
                            </div>

                            <div style={{
                                background: 'rgba(0,0,0,0.2)', padding: '15px',
                                borderRadius: '10px', marginBottom: '15px', textAlign: 'left'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
                                    <span>📅 Date:</span>
                                    <span style={{ color: 'white' }}>{formatDate(viewingQr.date)} at {viewingQr.time}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
                                    <span>📍 Location:</span>
                                    <span style={{ color: 'white' }}>{viewingQr.location}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
                                    <span>🪑 Seats:</span>
                                    <span style={{ color: 'white', fontWeight: '600' }}>{viewingQr.number_of_seats}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)' }}>
                                    <span>💰 Paid:</span>
                                    <span style={{ color: '#38ef7d', fontWeight: '600' }}>₹{(viewingQr.total_amount || 0).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                Scan this QR code with your phone camera at the event entrance
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardHome;