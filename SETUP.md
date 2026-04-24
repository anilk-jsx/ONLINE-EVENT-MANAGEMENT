# Event Management System - Setup Guide

Complete setup for running both frontend and backend with MongoDB.

## Project Structure

```
ONLINE-EVENT-MANAGEMENT/
├── src/                 # React Frontend
├── backend/            # Express Backend with MongoDB
├── package.json        # Frontend dependencies
└── backend/package.json # Backend dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Server (local or MongoDB Atlas cloud account)

## Installation & Running

### 1. MongoDB Setup

#### Option A: Local MongoDB
Download and install MongoDB from https://www.mongodb.com/try/download/community

Start MongoDB:
```bash
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get connection string
3. Update `.env` in backend folder

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server will start on `http://localhost:5000`

### 3. Frontend Setup (in another terminal)

```bash
npm install
npm run dev
```

Frontend will start on `http://localhost:5173`

## Database Configuration

Update `backend/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=mongodb://localhost:27017/event_management
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event_management
```

## API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "mobile_number": "9123456789",
  "password": "Password@123",
  "rpassword": "Password@123",
  "role": "user"
}
```

#### Login
```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "Password@123"
}
```

### Events

#### Create Event (Protected)
```
POST /api/events
Headers: Authorization: Bearer <token>
Body: {
  "title": "Tech Conference",
  "description": "Annual tech conference",
  "category": "Technology",
  "date": "2024-05-15",
  "time": "09:00",
  "location": "Convention Center",
  "price": 5000,
  "available_seats": 100,
  "duration": "8 hours"
}
```

#### Get All Events
```
GET /api/events?category=Technology&search=tech&page=1&limit=10
```

#### Get Event by ID
```
GET /api/events/{eventId}
```

#### Update Event (Protected, Owner Only)
```
PUT /api/events/{eventId}
Headers: Authorization: Bearer <token>
Body: { updated fields }
```

#### Delete Event (Protected, Owner Only)
```
DELETE /api/events/{eventId}
Headers: Authorization: Bearer <token>
```

#### Get Events by Organizer
```
GET /api/events/organizer/{organizerId}
```

### Registrations

#### Register for Event (Protected)
```
POST /api/registrations/event/{eventId}/register
Headers: Authorization: Bearer <token>
```

#### Get My Registrations (Protected)
```
GET /api/registrations/my-registrations
Headers: Authorization: Bearer <token>
```

#### Get Event Registrations (Protected, Organizer/Admin)
```
GET /api/registrations/event/{eventId}/registrations
Headers: Authorization: Bearer <token>
```

#### Get Event Statistics (Protected, Organizer/Admin)
```
GET /api/registrations/event/{eventId}/statistics
Headers: Authorization: Bearer <token>
```

#### Cancel Registration (Protected)
```
DELETE /api/registrations/{registrationId}/cancel
Headers: Authorization: Bearer <token>
```

## Features Implemented

### Backend ✅
- [x] Express server with MongoDB/Mongoose
- [x] User registration with validation
- [x] User login with JWT
- [x] Event management (CRUD)
- [x] Event registration system
- [x] Authentication middleware
- [x] Admin/Organizer access control
- [x] Event statistics

### Frontend ✅
- [x] Registration form with API integration
- [x] Login form with hardcoded auth (ready to update)
- [x] Forgot password
- [x] User and Admin dashboards

## Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB/Mongoose setup
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── eventController.js    # Event management
│   └── registrationController.js # Event registrations
├── middleware/
│   └── authMiddleware.js     # JWT authentication
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── events.js            # Event endpoints
│   └── registrations.js     # Registration endpoints
├── .env                     # Environment variables
├── .gitignore              # Git ignore
├── package.json            # Dependencies
├── server.js               # Main server
└── README.md              # Backend documentation
```

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication (7 days expiry)
- ✅ Input validation with express-validator
- ✅ Email uniqueness enforcement
- ✅ Organizer/Admin access control
- ✅ CORS configuration
- ✅ Error handling

## Development

Run both servers concurrently:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## Testing

Use Postman or Thunder Client to test endpoints:
1. Register a user
2. Login to get JWT token
3. Use token in Authorization header for protected endpoints

## Next Steps

1. Update login.jsx to use backend API
2. Integrate event management with frontend
3. Add admin dashboard functionality
4. Implement payment processing
5. Add email notifications

