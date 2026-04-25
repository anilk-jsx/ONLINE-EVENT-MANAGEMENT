import React from 'react';
import { Link } from 'react-router-dom';

function AdminHome({ stats, recentActivity = [], loading, onRefresh }) {

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const skeletonStyle = {
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '8px',
        animation: 'pulse 1.5s ease-in-out infinite',
        height: '36px', width: '60px'
    };

    const statCards = [
        {
            label: 'Total Users',
            value: stats?.totalUsers,
            icon: '👥',
            cls: 'users',
            sub: null
        },
        {
            label: 'Total Events',
            value: stats?.totalEvents,
            icon: '📅',
            cls: 'events',
            sub: stats ? `${stats.approvedEvents} approved · ${stats.pendingEvents} pending` : null
        },
        {
            label: 'Pending Requests',
            value: stats?.pendingEvents,
            icon: '⏳',
            cls: 'pending',
            sub: stats ? `${stats.rejectedEvents} rejected` : null
        },
        {
            label: 'Total Registrations',
            value: stats?.totalRegistrations,
            icon: '🎫',
            cls: 'bookings',
            sub: stats ? `${stats.activeRegistrations} active` : null
        },
        {
            label: 'Estimated Revenue',
            value: stats ? `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}` : null,
            icon: '💰',
            cls: 'events',
            sub: stats ? `from ${stats.activeRegistrations} active bookings` : null
        },
        {
            label: 'Cancelled',
            value: stats?.cancelledRegistrations,
            icon: '🚫',
            cls: 'pending',
            sub: stats
                ? `${stats.totalRegistrations > 0
                    ? Math.round((stats.cancelledRegistrations / stats.totalRegistrations) * 100)
                    : 0}% of total`
                : null
        },
    ];

    return (
        <div className="admin-content">
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>System overview and management</p>
                </div>
                <button
                    onClick={onRefresh}
                    style={{
                        padding: '8px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)',
                        cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {statCards.map((card) => (
                    <div key={card.label} className="admin-stat-card">
                        <div className={`admin-stat-icon ${card.cls}`}>
                            <span>{card.icon}</span>
                        </div>
                        <div className="admin-stat-info">
                            {loading ? (
                                <div style={skeletonStyle} />
                            ) : (
                                <h3>{card.value ?? '—'}</h3>
                            )}
                            <p>{card.label}</p>
                            {card.sub && !loading && (
                                <span style={{
                                    fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)',
                                    display: 'block', marginTop: '2px'
                                }}>
                                    {card.sub}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/admin-dashboard/requests" className="action-card" style={{ textDecoration: 'none' }}>
                        <div className="action-icon">⚡</div>
                        <h4>Approve Events</h4>
                        <p>Review and approve pending event requests
                            {stats?.pendingEvents > 0 && (
                                <strong style={{ color: '#f87171' }}> ({stats.pendingEvents} pending)</strong>
                            )}
                        </p>
                    </Link>
                    <Link to="/admin-dashboard/users" className="action-card" style={{ textDecoration: 'none' }}>
                        <div className="action-icon">👤</div>
                        <h4>Manage Users</h4>
                        <p>View and manage all {stats?.totalUsers || ''} system users</p>
                    </Link>
                    <Link to="/admin-dashboard/events" className="action-card" style={{ textDecoration: 'none' }}>
                        <div className="action-icon">📊</div>
                        <h4>View Events</h4>
                        <p>See all {stats?.totalEvents || ''} events in the system</p>
                    </Link>
                    <Link to="/admin-dashboard/registrations" className="action-card" style={{ textDecoration: 'none' }}>
                        <div className="action-icon">📋</div>
                        <h4>Registrations</h4>
                        <p>View {stats?.totalRegistrations || ''} member registrations per event</p>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="admin-recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-timeline">
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="timeline-item">
                                <div className="timeline-dot" />
                                <div className="timeline-content">
                                    <div style={{ ...skeletonStyle, width: '70%', height: '14px', marginBottom: '6px' }} />
                                    <div style={{ ...skeletonStyle, width: '30%', height: '10px' }} />
                                </div>
                            </div>
                        ))
                    ) : recentActivity.length > 0 ? (
                        recentActivity.map((item, idx) => (
                            <div key={idx} className="timeline-item">
                                <div className="timeline-dot" />
                                <div className="timeline-content">
                                    <p>
                                        <span style={{ marginRight: '6px' }}>{item.icon}</span>
                                        {item.text}
                                    </p>
                                    <span className="timeline-time">{formatTime(item.time)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="timeline-item">
                            <div className="timeline-dot" />
                            <div className="timeline-content">
                                <p style={{ color: 'rgba(255,255,255,0.4)' }}>No recent activity</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
