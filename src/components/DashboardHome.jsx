import React from 'react';

function DashboardHome({ userProfile, registeredEvents, bookedEvents }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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
                                <span>{userProfile.phone}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Location:</span>
                                <span>{userProfile.location}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Member Since:</span>
                                <span>{formatDate(userProfile.joinDate)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
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
                        <p>Booked Events</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon total">
                        <span>💰</span>
                    </div>
                    <div className="stat-info">
                        <h3>₹{bookedEvents.reduce((total, event) => total + event.totalAmount, 0).toLocaleString('en-IN')}</h3>
                        <p>Total Spent</p>
                    </div>
                </div>
            </div>

            {/* Registered Events List */}
            <div className="registered-events-section">
                <h2>Events You're Registered For</h2>
                <div className="events-list">
                    {registeredEvents.map(event => (
                        <div key={event.id} className="event-item">
                            <div className="event-main-info">
                                <h4>{event.title}</h4>
                                <div className="event-meta">
                                    <span className="event-date">{formatDate(event.date)} at {event.time}</span>
                                    <span className="event-location">{event.location}</span>
                                    <span className={`event-category ${event.category.toLowerCase()}`}>
                                        {event.category}
                                    </span>
                                </div>
                            </div>
                            <div className="event-status">
                                <span className={`status-badge ${event.status.toLowerCase()}`}>
                                    {event.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardHome;