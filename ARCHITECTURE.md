# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌─────────────┐  │
│  │ Register │  │  Login   │  │ Dashboard  │  │    Admin    │  │
│  │  Form    │  │  Form    │  │  (Events)  │  │ Dashboard  │  │
│  └────┬─────┘  └────┬─────┘  └────┬───────┘  └──────┬──────┘  │
│       │             │             │                 │          │
└───────┼─────────────┼─────────────┼─────────────────┼──────────┘
        │             │             │                 │
        │ HTTP REST API Calls with JSON               │
        │             │             │                 │
┌───────┼─────────────┼─────────────┼─────────────────┼──────────┐
│       │             │             │                 │          │
│  ┌────▼─────────────▼─────────────▼─────────────────▼──────┐   │
│  │          EXPRESS.JS SERVER (Backend)                   │   │
│  │                                                        │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │          Router & Route Handlers              │   │   │
│  │  │  ┌──────────┐  ┌────────┐  ┌──────────────┐   │   │   │
│  │  │  │  Auth    │  │ Events │  │Registrations │   │   │   │
│  │  │  │ Routes   │  │Routes  │  │  Routes      │   │   │   │
│  │  │  └────┬─────┘  └───┬────┘  └──────┬───────┘   │   │   │
│  │  └───────┼────────────┼──────────────┼──────────┘   │   │
│  │          │            │              │              │   │
│  │  ┌───────▼────────────▼──────────────▼──────────┐   │   │
│  │  │         Controllers (Business Logic)        │   │   │
│  │  │  ┌──────────┐  ┌────────┐  ┌──────────────┐ │   │   │
│  │  │  │   Auth   │  │ Event  │  │Registration  │ │   │   │
│  │  │  │Controller│  │Control │  │  Controller  │ │   │   │
│  │  │  └────┬─────┘  └───┬────┘  └──────┬───────┘ │   │   │
│  │  └───────┼────────────┼──────────────┼────────┘   │   │   │
│  │          │            │              │            │   │   │
│  │  ┌───────▼────────────▼──────────────▼────────┐   │   │   │
│  │  │    Middleware & Validation Layer          │   │   │   │
│  │  │  ┌──────────────────────────────────────┐ │   │   │   │
│  │  │  │  • Auth Middleware (JWT)             │ │   │   │   │
│  │  │  │  • Input Validation                  │ │   │   │   │
│  │  │  │  • Error Handling                    │ │   │   │   │
│  │  │  └──────────────────────────────────────┘ │   │   │   │
│  │  └──────────────────────────────────────────┘   │   │   │
│  │          │                                      │   │   │
│  │  ┌───────▼──────────────────────────────────┐   │   │   │
│  │  │     Database Access Layer                │   │   │   │
│  │  │  ┌────────────────────────────────────┐  │   │   │   │
│  │  │  │      Mongoose Models               │  │   │   │   │
│  │  │  │  • User Schema                     │  │   │   │   │
│  │  │  │  • Event Schema                    │  │   │   │   │
│  │  │  │  • Registration Schema             │  │   │   │   │
│  │  │  └────────────────────────────────────┘  │   │   │   │
│  │  └──────────────────┬───────────────────────┘   │   │   │
│  │                     │                          │   │   │
│  └─────────────────────┼──────────────────────────┘   │   │
│                        │                              │   │
└────────────────────────┼──────────────────────────────┘   │
                         │                                  │
        ┌────────────────▼────────────────┐                │
        │   MongoDB Database              │                │
        │                                 │                │
        │  ┌──────┐  ┌────────┐           │                │
        │  │Users │  │ Events │  ┌─────────────┐          │
        │  │      │  │        │  │Registrations│          │
        │  └──────┘  └────────┘  └─────────────┘          │
        │                                 │                │
        └─────────────────────────────────┘                │
                                                           │
└───────────────────────────────────────────────────────────┘
```

## Request Flow Diagram

### Registration Flow
```
Frontend Form
    │
    ├─ Validate Input (regex, length, etc.)
    │
    └─► POST /api/auth/register
        │
        ├─ Express Router
        │
        ├─ Validation Middleware (express-validator)
        │
        ├─ Auth Controller
        │   ├─ Check if email exists
        │   ├─ Hash password (bcryptjs)
        │   └─ Create User in MongoDB
        │
        ├─ Generate JWT Token
        │
        └─► Response with User & Token
            │
            └─ Frontend stores token & redirects
```

### Event Registration Flow
```
Authenticated User (with JWT Token)
    │
    └─► POST /api/registrations/event/{eventId}/register
        │
        ├─ Auth Middleware
        │   ├─ Verify JWT Token
        │   └─ Extract User Info
        │
        ├─ Registration Controller
        │   ├─ Check Event Exists
        │   ├─ Check Duplicate Registration
        │   ├─ Check Available Seats
        │   └─ Create Registration in MongoDB
        │
        └─► Response with Registration Details
            │
            └─ Frontend updates UI
```

## Database Schema

```
┌─────────────────────────┐
│        USERS            │
├─────────────────────────┤
│ _id         (ObjectId)  │
│ name        (String)    │◄──────┐
│ email       (String)*   │       │
│ mobile      (String)    │       │
│ password    (String)    │       │ One-to-Many
│ role        (String)    │       │ Relationship
│ created_at  (Date)      │       │
│ updated_at  (Date)      │       │
└─────────────────────────┘       │
                                  │
┌─────────────────────────┐       │
│       EVENTS            │       │
├─────────────────────────┤       │
│ _id         (ObjectId)  │       │
│ title       (String)    │       │
│ description (String)    │       │
│ category    (String)    │       │
│ date        (String)    │       │
│ time        (String)    │       │
│ location    (String)    │       │
│ organizer_id(ObjectId)  │───────┘
│ price       (Number)    │
│ available   (Number)    │
│ duration    (String)    │
│ created_at  (Date)      │
│ updated_at  (Date)      │
└──────────┬──────────────┘
           │ One-to-Many
           │ Relationship
           │
┌──────────▼────────────────┐
│    REGISTRATIONS         │
├──────────────────────────┤
│ _id        (ObjectId)    │
│ user_id    (ObjectId)*   │ ◄─── Foreign Key (User)
│ event_id   (ObjectId)*   │ ◄─── Foreign Key (Event)
│ status     (String)      │ (registered/cancelled)
│ created_at (Date)        │
│ updated_at (Date)        │
└──────────────────────────┘
* = Unique Index
```

## Authentication Flow

```
1. User Registration
   │
   ├─ Password Hashing (bcryptjs, salt=10)
   ├─ Email Validation & Uniqueness Check
   ├─ Create User Document
   │
   └─► Generate JWT Token
       Payload: { id, email, role }
       Duration: 7 days

2. User Login
   │
   ├─ Find User by Email
   ├─ Compare Password (bcryptjs.compare)
   │
   └─► Generate JWT Token (same as registration)

3. Protected API Call
   │
   ├─ Client sends Authorization header
   │  Header: "Bearer <jwt_token>"
   │
   ├─ Auth Middleware verifies token
   │  ├─ Extract token from header
   │  ├─ Verify signature & expiry
   │  ├─ Decode payload
   │  │
   │  └─► Attach user info to request
   │
   └─► Route handler processes request
       with authenticated user context
```

## Error Handling Flow

```
API Request
    │
    ├─ Route Handler
    │   ├─ Input Validation (express-validator)
    │   │   │
    │   │   ├─ ✓ Valid
    │   │   │   └─► Controller
    │   │   │
    │   │   └─ ✗ Invalid
    │   │       └─► 400 Bad Request (Validation Errors)
    │   │
    │   ├─ Auth Check (if protected)
    │   │   │
    │   │   ├─ ✓ Valid Token
    │   │   │   └─► Controller
    │   │   │
    │   │   └─ ✗ Invalid/Expired Token
    │   │       └─► 401 Unauthorized
    │   │
    │   └─ Business Logic
    │       │
    │       ├─ ✓ Success
    │       │   └─► 200/201 OK/Created
    │       │
    │       └─ ✗ Errors
    │           ├─► 403 Forbidden (Access Denied)
    │           ├─► 404 Not Found (Resource Not Found)
    │           ├─► 409 Conflict (Duplicate Entry)
    │           └─► 500 Server Error
    │
    └─► Error Middleware
        │
        ├─ Log Error
        └─► Return Error Response
```

## Deployment Architecture

```
┌──────────────────────────┐
│   Production Server      │
├──────────────────────────┤
│                          │
│  ┌────────────────────┐  │
│  │  Express App       │  │
│  │  (Clustered)       │  │
│  └────────────┬───────┘  │
│               │          │
│  ┌────────────▼────────┐ │
│  │  Load Balancer      │ │
│  │  (Nginx/HAProxy)    │ │
│  └─────────┬──────────┘ │
│            │            │
└────────────┼────────────┘
             │
    ┌────────▼────────┐
    │  MongoDB Atlas  │
    │  (Cloud DB)     │
    └─────────────────┘
```

---

This architecture ensures:
- ✅ Scalability
- ✅ Security
- ✅ Maintainability
- ✅ Performance
- ✅ Clear separation of concerns
