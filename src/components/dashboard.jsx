import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './dashboard.css';
import DashboardHome from './DashboardHome.jsx';
import UpcomingEvents from './UpcomingEvents.jsx';
import BookEvents from './BookEvents.jsx';

function Dashboard() {
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [registeredEventIds, setRegisteredEventIds] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/';
    };

    const [userProfile, setUserProfile] = useState({});
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [bookedEvents, setBookedEvents] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
            
            const [profileRes, upcomingRes, bookedRes, registeredRes] = await Promise.all([
                fetch('http://localhost:5001/api/auth/profile', { headers }),
                fetch('http://localhost:5001/api/events/upcoming'),
                fetch('http://localhost:5001/api/events/my-events', { headers }),
                fetch('http://localhost:5001/api/registrations/my-registrations', { headers })
            ]);

            const profileData = await profileRes.json();
            const upcomingData = await upcomingRes.json();
            const bookedData = await bookedRes.json();
            const registeredData = await registeredRes.json();

            if (profileData.success) setUserProfile(profileData.user);
            if (upcomingData.success) setUpcomingEvents(upcomingData.events);
            if (bookedData.success) setBookedEvents(bookedData.events);
            if (registeredData.success) {
                const mappedRegistrations = registeredData.registrations.map(r => ({
                    ...r.event_id,
                    registrationDate: r.created_at,
                    status: r.status,
                    registrationId: r._id,
                    number_of_seats: r.number_of_seats || 1,
                    total_amount: r.total_amount || 0,
                    event_price: r.event_id?.price || 0,
                    qr_token: r.qr_token
                }));
                setRegisteredEvents(mappedRegistrations);
                setRegisteredEventIds(mappedRegistrations.map(r => r._id));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const [newBooking, setNewBooking] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: 'Other',
        event_type: 'public',
        price: 0,
        available_seats: 1,
        duration: '1 hour'
    });

    const handleNewBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5001/api/events', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    ...newBooking,
                    price: Number(newBooking.price),
                    available_seats: Number(newBooking.available_seats)
                })
            });
            const data = await response.json();
            if (data.success) {
                setBookedEvents(prev => [data.event, ...prev]);
                setShowBookingForm(false);
                setNewBooking({
                    title: '', date: '', time: '', location: '', description: '',
                    category: 'Other', event_type: 'public', price: 0, available_seats: 1, duration: '1 hour'
                });
                alert('Event booked successfully and is pending admin approval.');
            } else {
                alert(data.message || 'Failed to book event');
            }
        } catch (error) {
            console.error('Error booking event:', error);
            alert('Failed to book event');
        }
    };

    const handleRegisterEvent = async (eventId, numberOfSeats = 1) => {
        if (!registeredEventIds.includes(eventId)) {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:5001/api/registrations/event/${eventId}/register`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ number_of_seats: numberOfSeats })
                });
                const data = await response.json();
                if (data.success) {
                    setRegisteredEventIds([...registeredEventIds, eventId]);
                    fetchDashboardData();
                    return { success: true, qr_token: data.qr_token };
                } else {
                    alert(data.message || 'Failed to register');
                }
            } catch (error) {
                console.error('Error registering:', error);
                alert('Failed to register for event');
            }
        }
    };

    const handleUpdateRegistration = async (registrationId, newNumberOfSeats) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5001/api/registrations/${registrationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ number_of_seats: newNumberOfSeats })
            });
            const data = await response.json();
            if (data.success) {
                fetchDashboardData();
                alert(data.message);
            } else {
                alert(data.message || 'Failed to update registration');
            }
        } catch (error) {
            console.error('Error updating registration:', error);
            alert('Failed to update registration');
        }
    };

    const handleEditEvent = async (eventId, updatedData) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5001/api/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            const data = await response.json();
            if (data.success) {
                fetchDashboardData();
                alert('Event updated successfully!');
                return true;
            } else {
                alert(data.message || 'Failed to update event');
                return false;
            }
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update event');
            return false;
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5001/api/events/${eventId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                fetchDashboardData();
                alert('Event deleted successfully!');
            } else {
                alert(data.message || 'Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event');
        }
    };

    const fetchEventMembers = async (eventId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5001/api/registrations/event/${eventId}/registrations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                return data.registrations || [];
            } else {
                alert(data.message || 'Failed to fetch members');
                return [];
            }
        } catch (error) {
            console.error('Error fetching event members:', error);
            alert('Failed to fetch members');
            return [];
        }
    };

    // Sidebar component with routing
    const SidebarWithRouter = () => {
        const location = useLocation();
        return (
            <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
                <div className="sidebar-header">
                    <h2>ASAS EVENTS</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link 
                        to="/dashboard"
                        className={location.pathname === '/dashboard' ? 'nav-item active' : 'nav-item'}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="nav-icon">🏠</span>
                        Dashboard
                    </Link>
                    <Link 
                        to="/dashboard/upcoming"
                        className={location.pathname === '/dashboard/upcoming' ? 'nav-item active' : 'nav-item'}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="nav-icon">📅</span>
                        Upcoming Events
                    </Link>
                    <Link 
                        to="/dashboard/book"
                        className={location.pathname === '/dashboard/book' ? 'nav-item active' : 'nav-item'}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="nav-icon">🎫</span>
                        Book Events
                    </Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    <span className="nav-icon">🚪</span> Logout
                </button>
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar toggle for mobile */}
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <span>☰</span>
            </button>
            {/* Sidebar */}
            <SidebarWithRouter />

            {/* Main Content */}
            {loading ? (
                <div className="main-content loading">Loading dashboard...</div>
            ) : (
                <div className="main-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <DashboardHome 
                                userProfile={userProfile}
                                registeredEvents={registeredEvents}
                                bookedEvents={bookedEvents}
                                handleUpdateRegistration={handleUpdateRegistration}
                            />
                        } 
                    />
                    <Route 
                        path="/upcoming" 
                        element={
                            <UpcomingEvents 
                                upcomingEvents={upcomingEvents}
                                registeredEventIds={registeredEventIds}
                                handleRegisterEvent={handleRegisterEvent}
                            />
                        } 
                    />
                    <Route 
                        path="/book" 
                        element={
                            <BookEvents 
                                bookedEvents={bookedEvents}
                                setShowBookingForm={setShowBookingForm}
                                handleEditEvent={handleEditEvent}
                                handleDeleteEvent={handleDeleteEvent}
                                fetchEventMembers={fetchEventMembers}
                            />
                        } 
                    />
                </Routes>
            </div>
            )}

            {/* Booking Form Modal */}
            {showBookingForm && (
                    <div className="modal-overlay">
                        <div className="booking-form-modal">
                            <div className="modal-header">
                                <h3>Book New Event</h3>
                                <button 
                                    className="close-btn"
                                    onClick={() => setShowBookingForm(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleNewBookingSubmit} className="booking-form">
                                <div className="form-group">
                                    <label>Event Title</label>
                                    <input
                                        type="text"
                                        value={newBooking.title}
                                        onChange={(e) => setNewBooking(prev => ({...prev, title: e.target.value}))}
                                        required
                                        placeholder="Enter event title"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={newBooking.description}
                                        onChange={(e) => setNewBooking(prev => ({...prev, description: e.target.value}))}
                                        placeholder="Event description"
                                        rows="2"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            value={newBooking.category}
                                            onChange={(e) => setNewBooking(prev => ({...prev, category: e.target.value}))}
                                        >
                                            {['Technology', 'Marketing', 'Education', 'Business', 'Programming', 'Other'].map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Event Type</label>
                                        <select
                                            value={newBooking.event_type}
                                            onChange={(e) => setNewBooking(prev => ({...prev, event_type: e.target.value}))}
                                        >
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Event Date</label>
                                        <input
                                            type="date"
                                            value={newBooking.date}
                                            onChange={(e) => setNewBooking(prev => ({...prev, date: e.target.value}))}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Event Time</label>
                                        <input
                                            type="time"
                                            value={newBooking.time}
                                            onChange={(e) => setNewBooking(prev => ({...prev, time: e.target.value}))}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <input
                                            type="text"
                                            value={newBooking.duration}
                                            onChange={(e) => setNewBooking(prev => ({...prev, duration: e.target.value}))}
                                            required
                                            placeholder="e.g. 2 hours"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Event Location</label>
                                    <input
                                        type="text"
                                        value={newBooking.location}
                                        onChange={(e) => setNewBooking(prev => ({...prev, location: e.target.value}))}
                                        required
                                        placeholder="Enter event location"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Available Seats</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={newBooking.available_seats}
                                            onChange={(e) => setNewBooking(prev => ({...prev, available_seats: e.target.value}))}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Ticket Price (₹)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={newBooking.price}
                                            onChange={(e) => setNewBooking(prev => ({...prev, price: e.target.value}))}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowBookingForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-submit">
                                        Book Event
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default Dashboard;