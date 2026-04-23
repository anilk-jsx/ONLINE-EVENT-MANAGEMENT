import React, { useState } from 'react';

function AdminEventRequests() {
    const [eventRequests, setEventRequests] = useState([
        {
            id: 1,
            title: 'Web Development Bootcamp',
            organizer: 'Tech Academy',
            date: '2026-05-15',
            time: '10:00 AM',
            location: 'Virtual',
            category: 'Programming',
            description: 'Comprehensive web development bootcamp covering HTML, CSS, JavaScript, React, and Node.js',
            status: 'Pending',
            submittedDate: '2026-04-08'
        },
        {
            id: 2,
            title: 'Data Science Workshop',
            organizer: 'Data Institute',
            date: '2026-06-10',
            time: '2:00 PM',
            location: 'Conference Hall A',
            category: 'Education',
            description: 'Hands-on workshop on Python, data analysis, and machine learning fundamentals',
            status: 'Pending',
            submittedDate: '2026-04-07'
        },
        {
            id: 3,
            title: 'Cybersecurity Summit 2026',
            organizer: 'Security Experts Inc',
            date: '2026-07-20',
            time: '9:00 AM',
            location: 'Downtown Convention Center',
            category: 'Technology',
            description: 'International summit on latest cybersecurity threats and defense mechanisms',
            status: 'Pending',
            submittedDate: '2026-04-06'
        }
    ]);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(null);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailModal(true);
    };

    const handleApprove = (id) => {
        setEventRequests(prev =>
            prev.map(req =>
                req.id === id ? { ...req, status: 'Approved' } : req
            )
        );
        setShowDetailModal(false);
    };

    const handleRejectSubmit = (id) => {
        if (!rejectionReason.trim()) {
            alert('Please enter a rejection reason');
            return;
        }
        setEventRequests(prev =>
            prev.map(req =>
                req.id === id ? { ...req, status: 'Rejected' } : req
            )
        );
        setShowRejectForm(null);
        setRejectionReason('');
        setShowDetailModal(false);
    };

    const pendingRequests = eventRequests.filter(r => r.status === 'Pending');

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
                    <span className="stat-number">{eventRequests.filter(r => r.status === 'Approved').length}</span>
                    <span className="stat-label">Approved</span>
                </div>
                <div className="request-stat">
                    <span className="stat-number">{eventRequests.filter(r => r.status === 'Rejected').length}</span>
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
                        <div key={request.id} className="request-card">
                            <div className="request-header">
                                <div className="request-title-section">
                                    <h3>{request.title}</h3>
                                    <span className="request-category">{request.category}</span>
                                </div>
                                <span className={`status-badge ${request.status.toLowerCase()}`}>
                                    {request.status}
                                </span>
                            </div>
                            <div className="request-info">
                                <div className="info-column">
                                    <p><strong>Organizer:</strong> {request.organizer}</p>
                                    <p><strong>Date:</strong> {formatDate(request.date)} at {request.time}</p>
                                    <p><strong>Location:</strong> {request.location}</p>
                                </div>
                                <div className="info-column">
                                    <p><strong>Submitted:</strong> {formatDate(request.submittedDate)}</p>
                                </div>
                            </div>
                            <div className="request-description">
                                <p>{request.description}</p>
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
                                    onClick={() => handleApprove(request.id)}
                                >
                                    ✓ Approve
                                </button>
                                <button
                                    className="btn-reject"
                                    onClick={() => setShowRejectForm(request.id)}
                                >
                                    ✕ Reject
                                </button>
                            </div>

                            {/* Reject Form */}
                            {showRejectForm === request.id && (
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
                                            onClick={() => handleRejectSubmit(request.id)}
                                        >
                                            Confirm Rejection
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
                                <span className="detail-value">{selectedRequest.organizer}</span>
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
                                <span className="detail-label">Submitted:</span>
                                <span className="detail-value">{formatDate(selectedRequest.submittedDate)}</span>
                            </div>
                            <div className="detail-description">
                                <h4>Description</h4>
                                <p>{selectedRequest.description}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="btn-approve"
                                onClick={() => {
                                    handleApprove(selectedRequest.id);
                                }}
                            >
                                ✓ Approve Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminEventRequests;
