import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminHome from './AdminHome.jsx';
import AdminEventRequests from './AdminEventRequests.jsx';
import AdminUsers from './AdminUsers.jsx';
import AdminEvents from './AdminEvents.jsx';
import AdminRegistrations from './AdminRegistrations.jsx';

function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminStats, setAdminStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const location = useLocation();

    // Decode admin name from stored token
    const getAdminName = () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return 'Admin';
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.name || 'Admin';
        } catch {
            return 'Admin';
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5001/api/events/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setAdminStats(data.stats);
                setRecentActivity(data.recentActivity);
            }
        } catch (error) {
            console.error('Failed to fetch admin stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    };

    const navItems = [
        { path: '/admin-dashboard', label: 'Dashboard', icon: '📊', exact: true },
        { path: '/admin-dashboard/requests', label: 'Event Requests', icon: '⚡',
          badge: adminStats?.pendingEvents || null },
        { path: '/admin-dashboard/users', label: 'Users', icon: '👥' },
        { path: '/admin-dashboard/events', label: 'All Events', icon: '📅' },
        { path: '/admin-dashboard/registrations', label: 'Registrations', icon: '📋' },
    ];

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar Toggle */}
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <span>☰</span>
            </button>

            {/* Admin Sidebar */}
            <div className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
                <div className="sidebar-header">
                    <h2>ADMIN PANEL</h2>
                </div>
                <nav className="admin-nav">
                    {navItems.map(item => {
                        const isActive = item.exact
                            ? location.pathname === item.path
                            : location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={isActive ? 'nav-item active' : 'nav-item'}
                                onClick={() => setSidebarOpen(false)}
                                style={{ position: 'relative' }}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                                {item.badge > 0 && (
                                    <span style={{
                                        marginLeft: 'auto', background: '#f87171',
                                        color: 'white', borderRadius: '20px',
                                        fontSize: '0.7rem', fontWeight: '700',
                                        padding: '1px 7px', minWidth: '20px',
                                        textAlign: 'center'
                                    }}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    <span className="nav-icon">🚪</span> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="admin-main-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <AdminHome
                                stats={adminStats}
                                recentActivity={recentActivity}
                                loading={statsLoading}
                                onRefresh={fetchStats}
                            />
                        }
                    />
                    <Route path="/requests" element={<AdminEventRequests />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path="/events" element={<AdminEvents />} />
                    <Route path="/registrations" element={<AdminRegistrations />} />
                </Routes>
            </div>
        </div>
    );
}

export default AdminDashboard;