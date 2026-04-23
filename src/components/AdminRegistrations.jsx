import React, { useState } from 'react';

function AdminRegistrations() {
    const [registrations] = useState([
        {
            eventId: 1,
            eventTitle: 'Tech Conference 2026',
            date: '2026-03-15',
            members: [
                { id: 1, name: 'Anil Kumar Nayak', email: 'anil@gmail.com', registeredDate: '2026-01-20' },
                { id: 2, name: 'Priya Sharma', email: 'priya.sharma@email.com', registeredDate: '2026-01-22' },
                { id: 3, name: 'Rajesh Patel', email: 'rajesh.p@email.com', registeredDate: '2026-01-25' }
            ]
        },
        {
            eventId: 2,
            eventTitle: 'Digital Marketing Summit',
            date: '2026-04-20',
            members: [
                { id: 4, name: 'Sarah Johnson', email: 'sarah.j@email.com', registeredDate: '2026-02-10' },
                { id: 5, name: 'Michael Chen', email: 'michael.chen@email.com', registeredDate: '2026-02-15' }
            ]
        },
        {
            eventId: 3,
            eventTitle: 'AI & Machine Learning Workshop',
            date: '2026-05-10',
            members: [
                { id: 6, name: 'Emma Wilson', email: 'emma.w@email.com', registeredDate: '2026-02-20' },
                { id: 7, name: 'David Martinez', email: 'david.m@email.com', registeredDate: '2026-02-22' },
                { id: 8, name: 'Alex Thompson', email: 'alex.t@email.com', registeredDate: '2026-02-25' },
                { id: 9, name: 'Jessica Lee', email: 'jessica.l@email.com', registeredDate: '2026-03-01' }
            ]
        },
        {
            eventId: 4,
            eventTitle: 'Startup Pitch Competition',
            date: '2026-06-05',
            members: [
                { id: 10, name: 'Chris Evans', email: 'chris.e@email.com', registeredDate: '2026-03-05' },
                { id: 11, name: 'Diana Ross', email: 'diana.r@email.com', registeredDate: '2026-03-08' },
                { id: 12, name: 'John Smith', email: 'john.s@email.com', registeredDate: '2026-03-10' },
                { id: 13, name: 'Kate Miller', email: 'kate.m@email.com', registeredDate: '2026-03-12' },
                { id: 14, name: 'Luke Anderson', email: 'luke.a@email.com', registeredDate: '2026-03-15' },
                { id: 15, name: 'Nancy Brown', email: 'nancy.b@email.com', registeredDate: '2026-03-18' }
            ]
        },
        {
            eventId: 5,
            eventTitle: 'Web Development Bootcamp',
            date: '2026-05-15',
            members: [
                { id: 16, name: 'Oscar White', email: 'oscar.w@email.com', registeredDate: '2026-03-20' },
                { id: 17, name: 'Peter Green', email: 'peter.g@email.com', registeredDate: '2026-03-22' }
            ]
        }
    ]);

    const [expandedEvent, setExpandedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const totalRegistrations = registrations.reduce((sum, reg) => sum + reg.members.length, 0);
    const averagePerEvent = Math.ceil(totalRegistrations / registrations.length);

    const filteredRegistrations = registrations.filter(reg =>
        reg.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Member Registrations</h1>
                <p>View all member registrations grouped by event</p>
            </div>

            {/* Registration Stats */}
            <div className="registration-stats">
                <div className="stat-box">
                    <h4>{registrations.length}</h4>
                    <p>Events with Registrations</p>
                </div>
                <div className="stat-box">
                    <h4>{totalRegistrations}</h4>
                    <p>Total Registrations</p>
                </div>
                <div className="stat-box">
                    <h4>{averagePerEvent}</h4>
                    <p>Average per Event</p>
                </div>
                <div className="stat-box">
                    <h4>{Math.max(...registrations.map(r => r.members.length))}</h4>
                    <p>Max per Event</p>
                </div>
            </div>

            {/* Search */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Registrations by Event */}
            <div className="registrations-container">
                {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((registration) => (
                        <div key={registration.eventId} className="event-registrations-card">
                            <div
                                className="event-registration-header"
                                onClick={() => setExpandedEvent(
                                    expandedEvent === registration.eventId ? null : registration.eventId
                                )}
                            >
                                <div className="header-content">
                                    <h3>{registration.eventTitle}</h3>
                                    <p className="event-date">{formatDate(registration.date)}</p>
                                </div>
                                <div className="header-stats">
                                    <span className="member-count">
                                        {registration.members.length} members
                                    </span>
                                    <span className="expand-icon">
                                        {expandedEvent === registration.eventId ? '▼' : '▶'}
                                    </span>
                                </div>
                            </div>

                            {/* Expanded Members List */}
                            {expandedEvent === registration.eventId && (
                                <div className="members-list">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Member Name</th>
                                                <th>Email</th>
                                                <th>Registration Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registration.members.map((member) => (
                                                <tr key={member.id}>
                                                    <td>
                                                        <div className="member-cell">
                                                            <div className="member-avatar">
                                                                {member.name.charAt(0)}
                                                            </div>
                                                            <span>{member.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>{member.email}</td>
                                                    <td>{formatDate(member.registeredDate)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No registrations found</p>
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="registrations-summary">
                <p>Total: {filteredRegistrations.reduce((sum, reg) => sum + reg.members.length, 0)} registrations across {filteredRegistrations.length} events</p>
            </div>
        </div>
    );
}

export default AdminRegistrations;
