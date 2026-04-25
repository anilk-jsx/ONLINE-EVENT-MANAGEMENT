import React from 'react';

function DashboardHome({ userProfile, registeredEvents, bookedEvents }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Calculate stats
    const pendingBookings = bookedEvents.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookedEvents.filter(b => b.status === 'approved').length;
    const completedBookings = 0; // Or based on another logic
    const totalAmountSpent = 0; // Replace with actual spent if available in future

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
                                </div>
                                <div className="event-status">
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
        </div>
    );
}

export default DashboardHome;