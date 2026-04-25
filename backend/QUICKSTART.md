# Backend Quick Start Guide

## Files Structure Created

```
backend/
├── config/
│   └── database.js                 # MongoDB & Mongoose configuration
├── controllers/
│   ├── authController.js           # User registration & login
│   ├── eventController.js          # Event management (CRUD)
│   └── registrationController.js   # Event registrations
├── middleware/
│   └── authMiddleware.js           # JWT authentication middleware
├── routes/
│   ├── auth.js                    # Authentication endpoints
│   ├── events.js                  # Event management endpoints
│   └── registrations.js           # Registration endpoints
├── server.js                       # Main Express server
├── package.json                    # NPM dependencies
├── .env                           # Environment variables
├── .gitignore                     # Git ignore
├── README.md                      # Backend documentation
└── API_DOCUMENTATION.md           # Complete API reference
```

## Quick Start

### 1. Install MongoDB

**Windows:**
Download from https://www.mongodb.com/try/download/community and install

**Or use MongoDB Atlas (Cloud):**
Create account at https://www.mongodb.com/cloud/atlas

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

Edit `backend/.env`:
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=mongodb://localhost:27017/event_management
```

### 4. Start MongoDB (if local)

```bash
mongod
```

### 5. Run Backend Server

```bash
npm run dev
```

Server will start on `http://localhost:5001`

## Implemented Features

### Authentication ✅
- User registration with validation
- User login with JWT
- Password hashing with bcryptjs
- Email uniqueness check
- Automatic token generation

### Event Management ✅
- Create events (authenticated users)
- View all events (public)
- Filter events by category
- Search events
- Update events (organizer only)
- Delete events (organizer only)
- Get events by organizer

### Event Registration ✅
- Register for events (authenticated users)
- View personal registrations
- View event registrations (organizer/admin)
- Cancel registrations
- Seat availability tracking
- Event statistics (occupancy, registration count)

### Security ✅
- JWT token authentication
- Password hashing (bcryptjs)
- Input validation (express-validator)
- Admin/Organizer access control
- Email uniqueness enforcement
- CORS enabled

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Events
- `POST /api/events` - Create event (protected)
- `GET /api/events` - Get all events
- `GET /api/events/:eventId` - Get event details
- `PUT /api/events/:eventId` - Update event (protected)
- `DELETE /api/events/:eventId` - Delete event (protected)
- `GET /api/events/organizer/:organizerId` - Get organizer's events

### Registrations
- `POST /api/registrations/event/:eventId/register` - Register for event (protected)
- `GET /api/registrations/my-registrations` - Get user's registrations (protected)
- `GET /api/registrations/event/:eventId/registrations` - Get event registrations (protected)
- `GET /api/registrations/event/:eventId/statistics` - Get event statistics (protected)
- `DELETE /api/registrations/:registrationId/cancel` - Cancel registration (protected)

## Testing Endpoints

Use Postman or Thunder Client:

### 1. Register User
```
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile_number": "9123456789",
  "password": "Password@123",
  "rpassword": "Password@123",
  "role": "user"
}
```

### 2. Login
```
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password@123"
}
```

Copy the token from response and use in Authorization header:
```
Authorization: Bearer <token_here>
```

### 3. Create Event
```
POST http://localhost:5001/api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tech Conference 2024",
  "description": "Annual tech conference",
  "category": "Technology",
  "date": "2024-05-15",
  "time": "09:00",
  "location": "Convention Center",
  "price": 5001,
  "available_seats": 100,
  "duration": "8 hours"
}
```

## Environment Variables

```env
PORT                # Server port (default: 5001)
NODE_ENV            # Environment (development/production)
JWT_SECRET          # Secret key for JWT signing
MONGODB_URI         # MongoDB connection string
```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

## Mobile Number Format

- Indian format: 10 digits starting with 6-9
- Example: 9123456789

## Database Collections

### Users
- name, email, mobile_number, password (hashed), role, timestamps

### Events
- title, description, category, date, time, location, organizer_id, price, available_seats, duration, timestamps

### Registrations
- user_id, event_id, status, timestamps

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running (`mongod` command)
- Check MONGODB_URI in .env file
- Verify database name in connection string

### Port Already in Use
- Change PORT in .env file
- Or kill process using port: `lsof -ti:5001 | xargs kill -9`

### JWT Token Issues
- Token might be expired (7 days)
- Re-login to get new token
- Check JWT_SECRET matches in .env

## Next Steps

1. Connect frontend to backend APIs
2. Implement admin dashboard features
3. Add payment processing
4. Add email notifications
5. Implement real-time updates

## Support & Documentation

- See `API_DOCUMENTATION.md` for complete API reference
- See `README.md` for detailed backend setup
