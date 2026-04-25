import React, { useState, useEffect } from 'react';

function AdminEventRequests() {
    const [eventRequests, setEventRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Fetch all events from the backend
    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5001/api/events/admin/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setEventRequests(data.events);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailModal(true);
    };

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5001/api/events/admin/${id}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setEventRequests(prev =>
                    prev.map(req => req._id === id ? { ...req, status: 'approved' } : req)
                );
                setShowDetailModal(false);
            } else {
                alert(data.message || 'Failed to approve event');
            }
        } catch (error) {
            console.error('Approve error:', error);
            alert('Failed to approve event');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectSubmit = async (id) => {
        if (!rejectionReason.trim()) {
            alert('Please enter a rejection reason');
            return;
        }
        setActionLoading(id);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5001/api/events/admin/${id}/reject`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: rejectionReason })
            });
            const data = await response.json();
            if (data.success) {
                setEventRequests(prev =>
                    prev.map(req => req._id === id ? { ...req, status: 'rejected' } : req)
                );
                setShowRejectForm(null);
                setRejectionReason('');
                setShowDetailModal(false);
            } else {
                alert(data.message || 'Failed to reject event');
            }
        } catch (error) {
            console.error('Reject error:', error);
            alert('Failed to reject event');
        } finally {
            setActionLoading(null);
        }
    };

    const pendingRequests = eventRequests.filter(r => r.status === 'pending');
    const approvedCount = eventRequests.filter(r => r.status === 'approved').length;
    const rejectedCount = eventRequests.filter(r => r.status === 'rejected').length;

    if (loading) {
        return (
            <div className="admin-content">
                <div className="admin-header">
                    <h1>Event Requests</h1>
                    <p>Loading event requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Event Requests</h1>
                <p>Review and manage event approval requests</p>
            </div>

            {/* Stats */}
            <div className="request-stats">
                <div className="request-stat">
                    <span className="stat-number">{pendingRequests.length}</span>
                    <span className="stat-label">Pending</span>
                </div>
                <div className="request-stat">
                    <span className="stat-number">{approvedCount}</span>
                    <span className="stat-label">Approved</span>
                </div>
                <div className="request-stat">
                    <span className="stat-number">{rejectedCount}</span>
                    <span className="stat-label">Rejected</span>
                </div>
                <div className="request-stat">
                    <span className="stat-number">{eventRequests.length}</span>
                    <span className="stat-label">Total</span>
                </div>
            </div>

            {/* Requests List */}
            <div className="requests-list">
                {pendingRequests.length > 0 ? (
                    pendingRequests.map(request => (
                        <div key={request._id} className="request-card">
                            <div className="request-header">
                                <div className="request-title-section">
                                    <h3>{request.title}</h3>
                                    <span className="request-category">{request.category}</span>
                                </div>
                                <span className={`status-badge ${request.status}`}>
                                    {request.status}
                                </span>
                            </div>
                            <div className="request-info">
                                <div className="info-column">
                                    <p><strong>Organizer:</strong> {request.organizer_id?.name || 'Unknown'}</p>
                                    <p><strong>Date:</strong> {formatDate(request.date)} at {request.time}</p>
                                    <p><strong>Location:</strong> {request.location}</p>
                                </div>
                                <div className="info-column">
                                    <p><strong>Seats:</strong> {request.available_seats}</p>
                                    <p><strong>Price:</strong> ₹{(request.price || 0).toLocaleString('en-IN')}</p>
                                    <p><strong>Submitted:</strong> {formatDate(request.created_at)}</p>
                                </div>
                            </div>
                            <div className="request-description">
                                <p>{request.description || 'No description provided'}</p>
                            </div>
                            <div className="request-actions">
                                <button
                                    className="btn-view-details"
                                    onClick={() => handleViewDetails(request)}
                                >
                                    View Details
                                </button>
                                <button
                                    className="btn-approve"
                                    onClick={() => handleApprove(request._id)}
                                    disabled={actionLoading === request._id}
                                >
                                    {actionLoading === request._id ? '...' : '✓ Approve'}
                                </button>
                                <button
                                    className="btn-reject"
                                    onClick={() => setShowRejectForm(request._id)}
                                >
                                    ✕ Reject
                                </button>
                            </div>

                            {/* Reject Form */}
                            {showRejectForm === request._id && (
                                <div className="reject-form">
                                    <textarea
                                        placeholder="Enter rejection reason..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows="3"
                                    />
                                    <div className="form-buttons">
                                        <button
                                            className="btn-cancel"
                                            onClick={() => setShowRejectForm(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn-confirm-reject"
                                            onClick={() => handleRejectSubmit(request._id)}
                                            disabled={actionLoading === request._id}
                                        >
                                            {actionLoading === request._id ? 'Rejecting...' : 'Confirm Rejection'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-requests">
                        <p>No pending event requests</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedRequest && (
                <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Request Details</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowDetailModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <div className="detail-row">
                                <span className="detail-label">Event Title:</span>
                                <span className="detail-value">{selectedRequest.title}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Organizer:</span>
                                <span className="detail-value">{selectedRequest.organizer_id?.name || 'Unknown'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{selectedRequest.organizer_id?.email || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Category:</span>
                                <span className="detail-value">{selectedRequest.category}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Date & Time:</span>
                                <span className="detail-value">{formatDate(selectedRequest.date)} at {selectedRequest.time}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Location:</span>
                                <span className="detail-value">{selectedRequest.location}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Duration:</span>
                                <span className="detail-value">{selectedRequest.duration}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Available Seats:</span>
                                <span className="detail-value">{selectedRequest.available_seats}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Registrations:</span>
                                <span className="detail-value">{selectedRequest.registered_count || 0}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Ticket Price:</span>
                                <span className="detail-value">₹{(selectedRequest.price || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Event Type:</span>
                                <span className="detail-value">{selectedRequest.event_type}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Submitted:</span>
                                <span className="detail-value">{formatDate(selectedRequest.created_at)}</span>
                            </div>
                            <div className="detail-description">
                                <h4>Description</h4>
                                <p>{selectedRequest.description || 'No description provided'}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Close
                            </button>
                            {selectedRequest.status === 'pending' && (
                                <button
                                    className="btn-approve"
                                    onClick={() => handleApprove(selectedRequest._id)}
                                    disabled={actionLoading === selectedRequest._id}
                                >
                                    {actionLoading === selectedRequest._id ? 'Approving...' : '✓ Approve Event'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminEventRequests;
