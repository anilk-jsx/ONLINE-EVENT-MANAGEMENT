import React, { useState, useEffect } from 'react';

function AdminRegistrations() {
    const [grouped, setGrouped] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRegistrations, setTotalRegistrations] = useState(0);
    const [expandedEvent, setExpandedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [cancelling, setCancelling] = useState(null); // registrationId being cancelled

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const fetchRegistrations = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5001/api/registrations/admin/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setGrouped(data.grouped);
                setTotalRegistrations(data.total_registrations);
            }
        } catch (error) {
            console.error('Failed to fetch registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleCancelRegistration = async (registrationId, eventGroupId) => {
        if (!confirm('Are you sure you want to cancel this registration?')) return;
        setCancelling(registrationId);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5001/api/registrations/admin/${registrationId}/cancel`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                // Update the local state: mark registration as cancelled
                setGrouped(prev => prev.map(group => {
                    if (group.eventId !== eventGroupId) return group;
                    return {
                        ...group,
                        registrations: group.registrations.map(r =>
                            r._id === registrationId ? { ...r, status: 'cancelled' } : r
                        )
                    };
                }));
            } else {
                alert(data.message || 'Failed to cancel registration');
            }
        } catch (error) {
            console.error('Error cancelling registration:', error);
            alert('Failed to cancel registration');
        } finally {
            setCancelling(null);
        }
    };

    // Apply search + status filter
    const filteredGrouped = grouped
        .map(group => {
            const filteredRegs = statusFilter === 'all'
                ? group.registrations
                : group.registrations.filter(r => r.status === statusFilter);
            return { ...group, registrations: filteredRegs };
        })
        .filter(group =>
            group.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
            group.registrations.length > 0
        );

    // Stats
    const activeCount = grouped.reduce((sum, g) =>
        sum + g.registrations.filter(r => r.status === 'registered').length, 0);
    const cancelledCount = grouped.reduce((sum, g) =>
        sum + g.registrations.filter(r => r.status === 'cancelled').length, 0);
    const eventsWithRegs = grouped.length;
    const avgPerEvent = eventsWithRegs > 0 ? Math.ceil(totalRegistrations / eventsWithRegs) : 0;

    const statusBadge = (status) => {
        const styles = {
            registered: { background: 'rgba(56,239,125,0.15)', color: '#38ef7d', border: '1px solid rgba(56,239,125,0.3)' },
            cancelled: { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' },
            completed: { background: 'rgba(99,179,237,0.15)', color: '#63b3ed', border: '1px solid rgba(99,179,237,0.3)' },
        };
        return (
            <span style={{
                ...( styles[status] || styles.registered),
                padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem',
                fontWeight: '600', textTransform: 'capitalize', whiteSpace: 'nowrap'
            }}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="admin-content">
                <div className="admin-header">
                    <h1>Member Registrations</h1>
                    <p>Loading registrations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Member Registrations</h1>
                <p>View and manage all registrations grouped by event</p>
            </div>

            {/* Stats */}
            <div className="registration-stats">
                <div className="stat-box">
                    <h4>{eventsWithRegs}</h4>
                    <p>Events with Registrations</p>
                </div>
                <div className="stat-box">
                    <h4>{totalRegistrations}</h4>
                    <p>Total Registrations</p>
                </div>
                <div className="stat-box">
                    <h4>{activeCount}</h4>
                    <p>Active</p>
                </div>
                <div className="stat-box">
                    <h4>{cancelledCount}</h4>
                    <p>Cancelled</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search by event name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    style={{ flex: '1', minWidth: '200px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'registered', 'cancelled', 'completed'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            style={{
                                padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem',
                                fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                                border: statusFilter === s ? 'none' : '1px solid rgba(255,255,255,0.15)',
                                background: statusFilter === s
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    : 'rgba(255,255,255,0.05)',
                                color: 'white', textTransform: 'capitalize'
                            }}
                        >
                            {s === 'all' ? 'All' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grouped Accordion */}
            <div className="registrations-container">
                {filteredGrouped.length > 0 ? (
                    filteredGrouped.map((group) => {
                        const activeRegs = group.registrations.filter(r => r.status === 'registered');
                        const bookedSeats = activeRegs.reduce((s, r) => s + (r.number_of_seats || 1), 0);
                        const revenue = activeRegs.reduce((s, r) => s + (r.total_amount || 0), 0);

                        return (
                            <div key={group.eventId} className="event-registrations-card">
                                {/* Accordion Header */}
                                <div
                                    className="event-registration-header"
                                    onClick={() => setExpandedEvent(
                                        expandedEvent === group.eventId ? null : group.eventId
                                    )}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="header-content">
                                        <h3>{group.eventTitle}</h3>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                                                📅 {formatDate(group.eventDate)} {group.eventTime && `at ${group.eventTime}`}
                                            </span>
                                            {group.eventLocation && (
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                                                    📍 {group.eventLocation}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="header-stats" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: 'white', fontWeight: '700', fontSize: '1rem' }}>
                                                {group.registrations.length}
                                            </div>
                                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>registrations</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: '#38ef7d', fontWeight: '700', fontSize: '1rem' }}>
                                                ₹{revenue.toLocaleString('en-IN')}
                                            </div>
                                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>revenue</div>
                                        </div>
                                        <span className="expand-icon" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', minWidth: '16px' }}>
                                            {expandedEvent === group.eventId ? '▼' : '▶'}
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded Members Table */}
                                {expandedEvent === group.eventId && (
                                    <div className="members-list">
                                        {/* Sub-stats bar */}
                                        <div style={{
                                            display: 'flex', gap: '24px', padding: '12px 16px',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                                                🟢 <strong style={{ color: '#38ef7d' }}>{activeRegs.length}</strong> active
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                                                🔴 <strong style={{ color: '#f87171' }}>
                                                    {group.registrations.filter(r => r.status === 'cancelled').length}
                                                </strong> cancelled
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                                                💺 <strong style={{ color: 'white' }}>{bookedSeats}</strong> seats booked
                                                {group.totalSeats ? ` / ${group.totalSeats} total` : ''}
                                            </span>
                                        </div>

                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Member</th>
                                                    <th>Email</th>
                                                    <th>Seats</th>
                                                    <th>Amount</th>
                                                    <th>Registered On</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {group.registrations.map((reg) => (
                                                    <tr key={reg._id} style={{
                                                        opacity: reg.status === 'cancelled' ? 0.55 : 1
                                                    }}>
                                                        <td>
                                                            <div className="member-cell">
                                                                <div className="member-avatar">
                                                                    {(reg.user_id?.name || '?').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontWeight: '500' }}>
                                                                        {reg.user_id?.name || 'Unknown'}
                                                                    </div>
                                                                    {reg.user_id?.mobile_number && (
                                                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
                                                                            {reg.user_id.mobile_number}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                                            {reg.user_id?.email || '—'}
                                                        </td>
                                                        <td style={{ textAlign: 'center', fontWeight: '600' }}>
                                                            {reg.number_of_seats || 1}
                                                        </td>
                                                        <td style={{ color: '#38ef7d', fontWeight: '600' }}>
                                                            {reg.total_amount > 0
                                                                ? `₹${reg.total_amount.toLocaleString('en-IN')}`
                                                                : <span style={{ color: 'rgba(255,255,255,0.4)' }}>Free</span>
                                                            }
                                                        </td>
                                                        <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                                                            {formatDate(reg.created_at)}
                                                        </td>
                                                        <td>{statusBadge(reg.status)}</td>
                                                        <td>
                                                            {reg.status === 'registered' ? (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCancelRegistration(reg._id, group.eventId);
                                                                    }}
                                                                    disabled={cancelling === reg._id}
                                                                    style={{
                                                                        padding: '4px 12px', fontSize: '0.75rem',
                                                                        borderRadius: '6px',
                                                                        border: '1px solid rgba(248,113,113,0.4)',
                                                                        background: 'rgba(248,113,113,0.1)',
                                                                        color: '#f87171', cursor: 'pointer',
                                                                        transition: 'all 0.2s',
                                                                        opacity: cancelling === reg._id ? 0.6 : 1
                                                                    }}
                                                                    onMouseEnter={e => {
                                                                        e.currentTarget.style.background = 'rgba(248,113,113,0.25)';
                                                                    }}
                                                                    onMouseLeave={e => {
                                                                        e.currentTarget.style.background = 'rgba(248,113,113,0.1)';
                                                                    }}
                                                                >
                                                                    {cancelling === reg._id ? '...' : 'Cancel'}
                                                                </button>
                                                            ) : (
                                                                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>—</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="no-results">
                        <p>{totalRegistrations === 0 ? 'No registrations found' : 'No results match your search'}</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="registrations-summary">
                <p>
                    Showing {filteredGrouped.reduce((s, g) => s + g.registrations.length, 0)} registrations
                    across {filteredGrouped.length} events
                </p>
            </div>
        </div>
    );
}

export default AdminRegistrations;
