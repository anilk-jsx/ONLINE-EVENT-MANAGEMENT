import React, { useState, useEffect } from 'react';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Fetch all users from the backend
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5001/api/auth/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenEdit = (user) => {
        setEditForm({
            name: user.name || '',
            mobile_number: user.mobile_number || '',
            location: user.location || '',
            role: user.role || 'user'
        });
        setEditingUser(user);
    };

    const handleSaveEdit = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('authToken');
            const { name, mobile_number, location } = editForm;
            const response = await fetch(`http://localhost:5001/api/auth/admin/users/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, mobile_number, location })
            });
            const data = await response.json();
            if (data.success) {
                setUsers(prev => prev.map(u => u._id === editingUser._id ? data.user : u));
                setEditingUser(null);
            } else {
                alert(data.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!confirm(`Are you sure you want to delete user "${userName}"? This will also delete all their registrations.`)) {
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5001/api/auth/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(prev => prev.filter(u => u._id !== userId));
            } else {
                alert(data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        regularUsers: users.filter(u => u.role === 'user').length
    };

    if (loading) {
        return (
            <div className="admin-content">
                <div className="admin-header">
                    <h1>User Management</h1>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

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
                    <h4>{stats.regularUsers}</h4>
                    <p>Regular Users</p>
                </div>
                <div className="stat-box">
                    <h4>{stats.admins}</h4>
                    <p>Admins</p>
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
                    {['All', 'user', 'admin'].map(role => (
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
                            <th>Location</th>
                            <th>Join Date</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user._id}>
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
                                    <td>{user.location || 'N/A'}</td>
                                    <td>{formatDate(user.created_at)}</td>
                                    <td>{user.mobile_number || 'N/A'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                className="btn-view-details"
                                                onClick={() => handleOpenEdit(user)}
                                                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleDeleteUser(user._id, user.name)}
                                                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-results">
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

            {/* Edit User Modal */}
            {editingUser && (
                <div className="modal-overlay" onClick={() => setEditingUser(null)}>
                    <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit User</h2>
                            <button className="close-btn" onClick={() => setEditingUser(null)}>×</button>
                        </div>
                        <div className="modal-content" style={{ padding: '20px 30px 30px' }}>
                            <div className="detail-row" style={{ marginBottom: '10px' }}>
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{editingUser.email}</span>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
                                        color: 'white', fontSize: '0.95rem', outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Mobile Number</label>
                                <input
                                    type="tel"
                                    value={editForm.mobile_number}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, mobile_number: e.target.value }))}
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
                                        color: 'white', fontSize: '0.95rem', outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Location</label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder="City, State"
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
                                        color: 'white', fontSize: '0.95rem', outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Role</label>
                                <div style={{
                                    padding: '10px 14px', borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
                                    color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem'
                                }}>
                                    {editingUser.role.charAt(0).toUpperCase() + editingUser.role.slice(1)}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="btn-cancel"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={saving}
                                    className="btn-approve"
                                    style={{ flex: 1 }}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;
