# Event Management Backend API

Express.js backend API for the Event Management System with MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Server (local or cloud)
- npm (v6 or higher)

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. MongoDB Setup

#### Option A: Local MongoDB

1. **Install MongoDB** - Download from https://www.mongodb.com/try/download/community
2. **Start MongoDB Server:**
   ```bash
   mongod
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get connection string
3. Update `.env` with your connection string

### 3. Configure Environment

Edit `.env` file with your configuration:

```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
MONGODB_URI=mongodb://localhost:27017/event_management
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event_management
```

### 4. Run Server

**Development (with hot reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5001`

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "mobile_number": "9123456789",
    "password": "Password@123",
    "rpassword": "Password@123",
    "role": "user"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "mobile_number": "9123456789",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password@123"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "mobile_number": "9123456789",
      "role": "user",
      "created_at": "2024-01-21T10:30:00Z"
    },
    "token": "jwt_token_here"
  }
  ```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  mobile_number: String,
  password: String (hashed),
  role: String ('user' | 'admin'),
  created_at: Date,
  updated_at: Date
}
```

### Events Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String ('Technology' | 'Marketing' | 'Education' | 'Business' | 'Programming' | 'Other'),
  date: String,
  time: String,
  location: String,
  organizer_id: ObjectId (ref: User),
  price: Number,
  available_seats: Number,
  duration: String,
  created_at: Date,
  updated_at: Date
}
```

### Registrations Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  event_id: ObjectId (ref: Event),
  status: String ('registered' | 'completed' | 'cancelled'),
  created_at: Date,
  updated_at: Date
}
```

## Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB & Mongoose models
├── controllers/
│   └── authController.js     # Authentication logic
├── routes/
│   └── auth.js              # Auth routes with validation
├── middleware/              # (For future auth middleware)
├── .env                     # Environment variables
├── .gitignore              # Git ignore
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md               # This file
```

## Security Features

- ✅ Password hashing with bcryptjs (salt: 10)
- ✅ JWT token authentication (expires in 7 days)
- ✅ Input validation with express-validator
- ✅ Email uniqueness enforcement
- ✅ CORS enabled for development
- ✅ Error handling middleware
- ✅ Database indexes for performance

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

## Mobile Number Format

- Indian format: 10 digits starting with 6-9
- Example: 9123456789

## Error Responses

### Bad Request (400)
```json
{
  "success": false,
  "message": "Validation error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Registration failed",
  "error": "error_message"
}
```

## Development Tips

- Use MongoDB Compass for database visualization
- Test API endpoints with Postman or Thunder Client
- Check server logs for debugging
- JWT tokens can be decoded at jwt.io for verification

## Next Steps

1. Implement event management APIs (create, read, update, delete events)
2. Implement event registration APIs
3. Add authentication middleware for protected routes
4. Implement admin dashboard APIs
5. Add email verification
6. Implement password reset functionality
