import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './dashboard.css';
import DashboardHome from './DashboardHome.jsx';
import UpcomingEvents from './UpcomingEvents.jsx';
import BookEvents from './BookEvents.jsx';

function Dashboard() {
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [registeredEventIds, setRegisteredEventIds] = useState([1, 5]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        // For now, just reload or redirect to login
        window.location.href = '/';
    };

    const [userProfile] = useState({
        name: 'Anil Kumar Nayak',
        email: 'anil@gmail.com',
        phone: '+1 234 567 8900',
        joinDate: '2024-01-15',
        avatar: null,
        location: 'silicon university'
    });

    const [upcomingEvents] = useState([
        {
            id: 1,
            title: 'Tech Conference 2026',
            date: '2026-03-15',
            time: '9:00 AM',
            location: 'Silicon Valley Convention Center',
            price: 24999,
            category: 'Technology',
            description: 'Join industry leaders for cutting-edge tech discussions and networking opportunities',
            organizer: 'Tech Corp Inc.',
            duration: '8 hours',
            availableSeats: 150
        },
        {
            id: 2,
            title: 'Digital Marketing Summit',
            date: '2026-04-20',
            time: '10:00 AM',
            location: 'Downtown Business Center',
            price: 16999,
            category: 'Marketing',
            description: 'Learn the latest digital marketing strategies from industry experts',
            organizer: 'Marketing Pro Ltd.',
            duration: '6 hours',
            availableSeats: 85
        },
        {
            id: 3,
            title: 'AI & Machine Learning Workshop',
            date: '2026-05-10',
            time: '2:00 PM',
            location: 'University Tech Hub',
            price: 12499,
            category: 'Education',
            description: 'Hands-on workshop with AI experts covering latest ML techniques',
            organizer: 'AI Academy',
            duration: '4 hours',
            availableSeats: 60
        },
        {
            id: 4,
            title: 'Startup Pitch Competition',
            date: '2026-06-05',
            time: '11:00 AM',
            location: 'Innovation Center',
            price: 8299,
            category: 'Business',
            description: 'Watch emerging startups pitch to venture capitalists',
            organizer: 'Startup Hub',
            duration: '5 hours',
            availableSeats: 200
        }
    ]);

    const [registeredEvents] = useState([
        {
            id: 1,
            title: 'Tech Conference 2026',
            date: '2026-03-15',
            time: '9:00 AM',
            location: 'Silicon Valley Convention Center',
            category: 'Technology',
            registrationDate: '2026-01-20',
            status: 'Confirmed'
        },
        {
            id: 5,
            title: 'Web Development Bootcamp',
            date: '2026-02-28',
            time: '9:00 AM',
            location: 'Code Academy',
            category: 'Programming',
            registrationDate: '2026-01-15',
            status: 'Confirmed'
        }
    ]);

    const [bookedEvents, setBookedEvents] = useState([
        {
            id: 1,
            bookingId: 'BK001',
            title: 'Tech Conference 2026',
            date: '2026-03-15',
            time: '9:00 AM',
            location: 'Silicon Valley Convention Center',
            tickets: 2,
            totalAmount: 49998,
            bookingDate: '2026-01-20',
            status: 'Confirmed'
        },
        {
            id: 2,
            bookingId: 'BK002',
            title: 'Digital Marketing Summit',
            date: '2026-04-20',
            time: '10:00 AM',
            location: 'Downtown Business Center',
            tickets: 1,
            totalAmount: 16999,
            bookingDate: '2026-01-25',
            status: 'Pending'
        },
        {
            id: 3,
            bookingId: 'BK003',
            title: 'Design Workshop',
            date: '2026-02-15',
            time: '2:00 PM',
            location: 'Creative Studio',
            tickets: 1,
            totalAmount: 12499,
            bookingDate: '2026-01-28',
            status: 'Completed'
        }
    ]);

    const [newBooking, setNewBooking] = useState({
        eventTitle: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        tickets: 1,
        specialRequirements: ''
    });

    const handleNewBookingSubmit = (e) => {
        e.preventDefault();
        // Add new booking to bookedEvents with Pending status
        const newId = bookedEvents.length > 0 ? Math.max(...bookedEvents.map(ev => ev.id)) + 1 : 1;
        const newBookingObj = {
            id: newId,
            bookingId: `BK${String(newId).padStart(3, '0')}`,
            title: newBooking.eventTitle,
            date: newBooking.eventDate,
            time: newBooking.eventTime,
            location: newBooking.eventLocation,
            tickets: newBooking.tickets,
            totalAmount: 0, // You can calculate price if needed
            bookingDate: new Date().toISOString().split('T')[0],
            status: 'Pending'
        };
        setBookedEvents(prev => [...prev, newBookingObj]);
        setShowBookingForm(false);
        setNewBooking({
            eventTitle: '',
            eventDate: '',
            eventTime: '',
            eventLocation: '',
            tickets: 1,
            specialRequirements: ''
        });
    };

    const handleRegisterEvent = (eventId) => {
        if (!registeredEventIds.includes(eventId)) {
            setRegisteredEventIds([...registeredEventIds, eventId]);
            console.log(`Registered for event ${eventId}`);
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
            <div className="main-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <DashboardHome 
                                userProfile={userProfile}
                                registeredEvents={registeredEvents}
                                bookedEvents={bookedEvents}
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
                            />
                        } 
                    />
                </Routes>
            </div>

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
                                        value={newBooking.eventTitle}
                                        onChange={(e) => setNewBooking(prev => ({...prev, eventTitle: e.target.value}))}
                                        required
                                        placeholder="Enter event title"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Event Date</label>
                                        <input
                                            type="date"
                                            value={newBooking.eventDate}
                                            onChange={(e) => setNewBooking(prev => ({...prev, eventDate: e.target.value}))}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Event Time</label>
                                        <input
                                            type="time"
                                            value={newBooking.eventTime}
                                            onChange={(e) => setNewBooking(prev => ({...prev, eventTime: e.target.value}))}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Event Location</label>
                                    <input
                                        type="text"
                                        value={newBooking.eventLocation}
                                        onChange={(e) => setNewBooking(prev => ({...prev, eventLocation: e.target.value}))}
                                        required
                                        placeholder="Enter event location"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Number of Tickets</label>
                                    <select
                                        value={newBooking.tickets}
                                        onChange={(e) => setNewBooking(prev => ({...prev, tickets: parseInt(e.target.value)}))}
                                    >
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Special Requirements (Optional)</label>
                                    <textarea
                                        value={newBooking.specialRequirements}
                                        onChange={(e) => setNewBooking(prev => ({...prev, specialRequirements: e.target.value}))}
                                        placeholder="Any special requirements or notes..."
                                        rows="3"
                                    />
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