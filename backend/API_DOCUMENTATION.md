# Event Management API Documentation

Complete REST API documentation for the Event Management System.

## Base URL

```
http://localhost:5001/api
```

## Authentication

Most endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Public:** ✅ Yes

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile_number": "9123456789",
  "password": "Password@123",
  "rpassword": "Password@123",
  "role": "user"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile_number": "9123456789",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

**Error Response (400/409):**
```json
{
  "success": false,
  "message": "Email already registered",
  "errors": []
}
```

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**Public:** ✅ Yes

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile_number": "9123456789",
    "role": "user",
    "created_at": "2024-01-21T10:30:00Z"
  },
  "token": "jwt_token_here"
}
```

---

## Event Endpoints

### 3. Create Event

**Endpoint:** `POST /events`

**Protected:** 🔒 Yes

**Request Body:**
```json
{
  "title": "Tech Conference 2024",
  "description": "Annual technology conference",
  "category": "Technology",
  "date": "2024-05-15",
  "time": "09:00",
  "location": "Convention Center, City",
  "price": 5001,
  "available_seats": 100,
  "duration": "8 hours"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "_id": "event_id_here",
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "category": "Technology",
    "date": "2024-05-15",
    "time": "09:00",
    "location": "Convention Center, City",
    "organizer_id": {
      "_id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "price": 5001,
    "available_seats": 100,
    "duration": "8 hours",
    "created_at": "2024-01-21T10:30:00Z"
  }
}
```

**Categories:**
- Technology
- Marketing
- Education
- Business
- Programming
- Other

---

### 4. Get All Events

**Endpoint:** `GET /events`

**Public:** ✅ Yes

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in title, description, location
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:**
```
GET /events?category=Technology&search=conference&page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "events": [
    {
      "_id": "event_id_here",
      "title": "Tech Conference 2024",
      "date": "2024-05-15",
      "time": "09:00",
      "location": "Convention Center",
      "price": 5001,
      "available_seats": 100
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_events": 45,
    "limit": 10
  }
}
```

---

### 5. Get Event by ID

**Endpoint:** `GET /events/:eventId`

**Public:** ✅ Yes

**URL Parameters:**
- `eventId` (required): MongoDB event ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Event retrieved successfully",
  "event": {
    "_id": "event_id_here",
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "category": "Technology",
    "date": "2024-05-15",
    "time": "09:00",
    "location": "Convention Center",
    "organizer_id": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "price": 5001,
    "available_seats": 100,
    "registered_count": 45,
    "available_seats_remaining": 55,
    "duration": "8 hours"
  }
}
```

---

### 6. Update Event

**Endpoint:** `PUT /events/:eventId`

**Protected:** 🔒 Yes (Organizer Only)

**Request Body:**
```json
{
  "title": "Tech Conference 2024 - Updated",
  "price": 6000,
  "available_seats": 150
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "event": { /* updated event object */ }
}
```

---

### 7. Delete Event

**Endpoint:** `DELETE /events/:eventId`

**Protected:** 🔒 Yes (Organizer Only)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### 8. Get Events by Organizer

**Endpoint:** `GET /events/organizer/:organizerId`

**Public:** ✅ Yes

**URL Parameters:**
- `organizerId` (required): MongoDB user ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "events": [ /* array of events */ ]
}
```

---

## Registration Endpoints

### 9. Register for Event

**Endpoint:** `POST /registrations/event/:eventId/register`

**Protected:** 🔒 Yes

**URL Parameters:**
- `eventId` (required): MongoDB event ID

**Success Response (201):**
```json
{
  "success": true,
  "message": "Successfully registered for event",
  "registration": {
    "_id": "registration_id_here",
    "user_id": {
      "_id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "event_id": {
      "_id": "event_id_here",
      "title": "Tech Conference 2024"
    },
    "status": "registered",
    "created_at": "2024-01-21T10:30:00Z"
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Already registered for this event"
}
```

---

### 10. Get My Registrations

**Endpoint:** `GET /registrations/my-registrations`

**Protected:** 🔒 Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "User registrations retrieved successfully",
  "registrations": [
    {
      "_id": "registration_id_here",
      "event_id": {
        "_id": "event_id_here",
        "title": "Tech Conference 2024",
        "date": "2024-05-15"
      },
      "status": "registered"
    }
  ]
}
```

---

### 11. Get Event Registrations

**Endpoint:** `GET /registrations/event/:eventId/registrations`

**Protected:** 🔒 Yes (Organizer/Admin Only)

**URL Parameters:**
- `eventId` (required): MongoDB event ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Event registrations retrieved successfully",
  "total_registrations": 45,
  "available_seats": 55,
  "registrations": [
    {
      "_id": "registration_id_here",
      "user_id": {
        "_id": "user_id_here",
        "name": "User Name",
        "email": "user@example.com",
        "mobile_number": "9123456789"
      },
      "status": "registered",
      "created_at": "2024-01-21T10:30:00Z"
    }
  ]
}
```

---

### 12. Get Event Statistics

**Endpoint:** `GET /registrations/event/:eventId/statistics`

**Protected:** 🔒 Yes (Organizer/Admin Only)

**URL Parameters:**
- `eventId` (required): MongoDB event ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Event statistics retrieved successfully",
  "statistics": {
    "event_id": "event_id_here",
    "total_registrations": 45,
    "active_registrations": 44,
    "cancelled_registrations": 1,
    "available_seats": 55,
    "total_seats": 100,
    "occupancy_rate": "45.00%"
  }
}
```

---

### 13. Cancel Registration

**Endpoint:** `DELETE /registrations/:registrationId/cancel`

**Protected:** 🔒 Yes (User/Admin Only)

**URL Parameters:**
- `registrationId` (required): MongoDB registration ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Registration cancelled successfully",
  "registration": {
    "_id": "registration_id_here",
    "status": "cancelled",
    "updated_at": "2024-01-21T10:30:00Z"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Event not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (development only)"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource exists |
| 500 | Server Error - Internal error |

---

## Response Format

All responses follow this format:

```json
{
  "success": true/false,
  "message": "Human readable message",
  "data": {},
  "errors": []
}
```

---

## Rate Limiting

Currently not implemented. May be added in future versions.

---

## Version

API Version: 1.0.0

---

## Support

For issues or questions, please contact the development team.
