import React from 'react';

function AdminHome({ stats }) {
    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>System overview and management</p>
            </div>

            {/* Admin Stats Grid */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon users">
                        <span>👥</span>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon events">
                        <span>📅</span>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.totalEvents}</h3>
                        <p>Total Events</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon pending">
                        <span>⏳</span>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.pendingRequests}</h3>
                        <p>Pending Requests</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon bookings">
                        <span>🎫</span>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.totalRegistrations}</h3>
                        <p>Total Registrations</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <a href="/admin-dashboard/requests" className="action-card">
                        <div className="action-icon">⚡</div>
                        <h4>Approve Events</h4>
                        <p>Review and approve pending event requests</p>
                    </a>
                    <a href="/admin-dashboard/users" className="action-card">
                        <div className="action-icon">👤</div>
                        <h4>Manage Users</h4>
                        <p>View and manage all system users</p>
                    </a>
                    <a href="/admin-dashboard/events" className="action-card">
                        <div className="action-icon">📊</div>
                        <h4>View Events</h4>
                        <p>See all events in the system</p>
                    </a>
                    <a href="/admin-dashboard/registrations" className="action-card">
                        <div className="action-icon">📋</div>
                        <h4>Registrations</h4>
                        <p>View member registrations per event</p>
                    </a>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="admin-recent-activity">
                <h2>System Activity</h2>
                <div className="activity-timeline">
                    <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <p>3 new event requests submitted</p>
                            <span className="timeline-time">2 hours ago</span>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <p>5 new user registrations</p>
                            <span className="timeline-time">4 hours ago</span>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <p>Event approved by system</p>
                            <span className="timeline-time">1 day ago</span>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <p>50 new member registrations</p>
                            <span className="timeline-time">2 days ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
