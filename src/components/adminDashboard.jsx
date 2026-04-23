import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminHome from './AdminHome.jsx';
import AdminEventRequests from './AdminEventRequests.jsx';
import AdminUsers from './AdminUsers.jsx';
import AdminEvents from './AdminEvents.jsx';
import AdminRegistrations from './AdminRegistrations.jsx';

function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Mock stats for admin home
    const adminStats = {
        totalUsers: 8,
        totalEvents: 5,
        pendingRequests: 3,
        totalRegistrations: 18
    };

    const handleLogout = () => {
        window.location.href = '/';
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar Toggle Button */}
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <span>☰</span>
            </button>

            {/* Admin Sidebar */}
            <div className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
                <div className="sidebar-header">
                    <h2>ADMIN PANEL</h2>
                </div>
                <nav className="admin-nav">
                    <Link
                        to="/admin-dashboard"
                        className={location.pathname === '/admin-dashboard' ? 'nav-item active' : 'nav-item'}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="nav-icon">📊</span>
                        Dashboard
                    </Link>
                    <Link
                        to="/admin-dashboard/requests"
                        className={location.pathname === '/admin-dashboard/requests' ? 'nav-item active' : 'nav-item'}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="nav-icon">⚡</span>
                        Event Requests
                    </Link>
                    <Link
                        to="/admin-dashboard/users"
                        className={location.pathname === '/admin-dashboard/users' ? 'nav-item active' : 'nav-item'}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="nav-icon">👥</span>
                        Users
                    </Link>
                    <Link
                        to="/admin-dashboard/events"
                        className={location.pathname === '/admin-dashboard/events' ? 'nav-item active' : 'nav-item'}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="nav-icon">📅</span>
                        All Events
                    </Link>
                    <Link
                        to="/admin-dashboard/registrations"
                        className={location.pathname === '/admin-dashboard/registrations' ? 'nav-item active' : 'nav-item'}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="nav-icon">📋</span>
                        Registrations
                    </Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    <span className="nav-icon">🚪</span> Logout
                </button>
            </div>

            {/* Main Admin Content */}
            <div className="admin-main-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
                <Routes>
                    <Route
                        path="/"
                        element={<AdminHome stats={adminStats} />}
                    />
                    <Route
                        path="/requests"
                        element={<AdminEventRequests />}
                    />
                    <Route
                        path="/users"
                        element={<AdminUsers />}
                    />
                    <Route
                        path="/events"
                        element={<AdminEvents />}
                    />
                    <Route
                        path="/registrations"
                        element={<AdminRegistrations />}
                    />
                </Routes>
            </div>
        </div>
    );
}

export default AdminDashboard;