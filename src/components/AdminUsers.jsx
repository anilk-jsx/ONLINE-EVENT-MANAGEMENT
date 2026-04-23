import React, { useState } from 'react';

function AdminUsers() {
    const [users] = useState([
        {
            id: 1,
            name: 'Anil Kumar Nayak',
            email: 'anil@gmail.com',
            role: 'user',
            joinDate: '2024-01-15',
            status: 'Active',
            phone: '+1 234 567 8900'
        },
        {
            id: 2,
            name: 'Priya Sharma',
            email: 'priya.sharma@email.com',
            role: 'user',
            joinDate: '2024-02-20',
            status: 'Active',
            phone: '+1 345 678 9012'
        },
        {
            id: 3,
            name: 'Rajesh Patel',
            email: 'rajesh.p@email.com',
            role: 'organizer',
            joinDate: '2024-03-10',
            status: 'Active',
            phone: '+1 456 789 0123'
        },
        {
            id: 4,
            name: 'Admin User',
            email: 'admin@email.com',
            role: 'admin',
            joinDate: '2023-12-01',
            status: 'Active',
            phone: '+1 567 890 1234'
        },
        {
            id: 5,
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            role: 'user',
            joinDate: '2024-04-05',
            status: 'Active',
            phone: '+1 678 901 2345'
        },
        {
            id: 6,
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            role: 'organizer',
            joinDate: '2024-01-25',
            status: 'Inactive',
            phone: '+1 789 012 3456'
        },
        {
            id: 7,
            name: 'Emma Wilson',
            email: 'emma.w@email.com',
            role: 'user',
            joinDate: '2024-03-15',
            status: 'Active',
            phone: '+1 890 123 4567'
        },
        {
            id: 8,
            name: 'David Martinez',
            email: 'david.m@email.com',
            role: 'user',
            joinDate: '2024-04-01',
            status: 'Active',
            phone: '+1 901 234 5678'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'Active').length,
        inactive: users.filter(u => u.status === 'Inactive').length,
        organizers: users.filter(u => u.role === 'organizer').length
    };

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>User Management</h1>
                <p>View and manage all registered users</p>
            </div>

            {/* Users Stats */}
            <div className="users-stats">
                <div className="stat-box">
                    <h4>{stats.total}</h4>
                    <p>Total Users</p>
                </div>
                <div className="stat-box">
                    <h4>{stats.active}</h4>
                    <p>Active Users</p>
                </div>
                <div className="stat-box">
                    <h4>{stats.inactive}</h4>
                    <p>Inactive Users</p>
                </div>
                <div className="stat-box">
                    <h4>{stats.organizers}</h4>
                    <p>Organizers</p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="users-filter">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <div className="role-buttons">
                    {['All', 'user', 'organizer', 'admin'].map(role => (
                        <button
                            key={role}
                            className={`role-btn ${roleFilter === role ? 'active' : ''}`}
                            onClick={() => setRoleFilter(role)}
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Join Date</th>
                            <th>Status</th>
                            <th>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">{user.name.charAt(0)}</div>
                                            <span>{user.name}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role}`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td>{formatDate(user.joinDate)}</td>
                                    <td>
                                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>{user.phone}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-results">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Results Count */}
            <div className="results-footer">
                <p>Showing {filteredUsers.length} of {users.length} users</p>
            </div>
        </div>
    );
}

export default AdminUsers;
