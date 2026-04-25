# How to Get MongoDB URI and JWT Secret

## 1. MongoDB URI

### Option A: Local MongoDB

#### Step 1: Install MongoDB Community Edition

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Install MongoDB as a Service" (recommended)
4. Complete the installation

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
```

#### Step 2: Start MongoDB

**Windows:**
- MongoDB should start automatically as a service
- Or run in Command Prompt:
```bash
mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

#### Step 3: Get Local MongoDB URI

Your local MongoDB URI is:
```
mongodb://localhost:27017/event_management
```

**Breakdown:**
- `mongodb://` - Protocol
- `localhost` - Server address (your computer)
- `27017` - Default MongoDB port
- `event_management` - Database name

---

### Option B: MongoDB Atlas (Cloud - Recommended)

#### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" or "Sign In"
3. Create a free account

#### Step 2: Create a New Project

1. Click "Create a Project"
2. Enter project name: "Event Management"
3. Click "Next" → "Create Project"

#### Step 3: Create a Cluster

1. Click "Create a Deployment"
2. Choose "M0" (Free tier) ✅
3. Select cloud provider: AWS/Google Cloud/Azure
4. Select region closest to you
5. Click "Create Deployment"
6. Wait 2-5 minutes for cluster creation

#### Step 4: Create Database User

1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Enter:
   - **Username:** `eventmanager`
   - **Password:** `YourSecurePassword@123`
   - Click "Create User"

#### Step 5: Get Connection String

1. Go to "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connection String" (2nd option)
4. Copy the URI

Your MongoDB Atlas URI looks like:
```
mongodb+srv://eventmanager:YourSecurePassword@123@cluster0.abc123.mongodb.net/event_management?retryWrites=true&w=majority
```

**Replace:**
- `eventmanager` - Your username
- `YourSecurePassword@123` - Your password
- `event_management` - Database name

---

## 2. JWT Secret

JWT Secret is a random string used to sign/verify tokens. You can generate it in several ways:

### Option A: Using Node.js (Recommended)

#### Step 1: Open Terminal/Command Prompt

#### Step 2: Run Node

```bash
node
```

#### Step 3: Generate Secret

```javascript
// In Node.js console, paste this:
require('crypto').randomBytes(32).toString('hex')

// Output will be something like:
// a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

Copy this output and use it as your JWT Secret!

### Option B: Using OpenSSL

```bash
openssl rand -hex 32
```

Output:
```
f3e4d5c6b7a89012345678901234567890abcdef1234567890abcdef12345678
```

### Option C: Use an Online Generator (Not Recommended for Production)

Go to: https://randomkeygen.com/

Use the "CodeIgniter Encryption Keys" section (256-bit)

---

## Complete .env File Example

Create `backend/.env` file with:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration (Choose ONE)

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/event_management

# OR MongoDB Atlas Cloud
# MONGODB_URI=mongodb+srv://eventmanager:YourPassword@cluster0.abc123.mongodb.net/event_management?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

## Step-by-Step Setup Guide

### For Local MongoDB:

```bash
# 1. Install MongoDB (Windows/Mac/Linux)
# 2. Start MongoDB
mongod

# 3. In backend folder, create .env
cd backend
touch .env  # On Mac/Linux
# or create manually on Windows

# 4. Add to .env:
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/event_management
JWT_SECRET=<generated_secret_here>

# 5. Run backend
npm run dev
```

### For MongoDB Atlas:

```bash
# 1. Create MongoDB Atlas account & cluster
# 2. Get connection string from Atlas

# 3. In backend folder, create .env

# 4. Add to .env:
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event_management?retryWrites=true&w=majority
JWT_SECRET=<generated_secret_here>

# 5. Run backend
npm run dev
```

---

## Verify Your Setup

### Check MongoDB Connection

```bash
# Test locally with mongo shell (if MongoDB installed)
mongosh

# Should show:
# > 

# List databases
> show databases

# Should show existing databases
```

### Test Backend Server

```bash
cd backend
npm run dev

# Should show:
# Server running on http://localhost:5001
# MongoDB connected successfully
```

### Test API Endpoint

```bash
# In another terminal, run:
curl http://localhost:5001/

# Should return:
# {"message":"Event Management API is running"}
```

---

## Common Issues & Solutions

### Issue 1: MongoDB Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Make sure MongoDB is running: `mongod`
- Check `.env` has correct `MONGODB_URI`
- For Atlas: Check username/password in connection string

### Issue 2: Atlas Connection Timeout
```
MongoServerSelectionError: connect ENOTFOUND cluster0.mongodb.net
```

**Solution:**
- Check internet connection
- Verify cluster is created in Atlas
- Add your IP to IP Whitelist in Atlas:
  1. Go to Security → Network Access
  2. Click "Add IP Address"
  3. Choose "Allow Access from Anywhere" (for development only)

### Issue 3: JWT Secret Not Set
```
Error: JWT_SECRET is undefined
```

**Solution:**
- Make sure `.env` file has `JWT_SECRET` set
- Reload server: `npm run dev`

### Issue 4: MongoDB Database Not Created
```
Solution: MongoDB creates database automatically on first insert
Just start using it!
```

---

## Security Best Practices

✅ **DO:**
- Generate random JWT secret (32+ characters)
- Keep `.env` file in `.gitignore`
- Use strong MongoDB password
- Use MongoDB Atlas IP whitelist
- Change default credentials in production

❌ **DON'T:**
- Commit `.env` to Git
- Share MongoDB credentials
- Use simple passwords
- Use same secret for all environments
- Hardcode secrets in code

---

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | 5001 |
| `NODE_ENV` | Environment | development / production |
| `MONGODB_URI` | Database connection | mongodb://... |
| `JWT_SECRET` | Token signing key | a1b2c3d4... |

---

## Quick Reference

### Local Setup
```env
MONGODB_URI=mongodb://localhost:27017/event_management
```

### Cloud Setup (Atlas)
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/event_management
```

### JWT Secret (Generate)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Final Checklist

- ✅ MongoDB installed and running (or Atlas cluster created)
- ✅ `.env` file created in `backend` folder
- ✅ `MONGODB_URI` added to `.env`
- ✅ `JWT_SECRET` added to `.env` (random 32+ char string)
- ✅ `PORT` set to 5001
- ✅ `NODE_ENV` set to development
- ✅ `.env` added to `.gitignore`
- ✅ Run `npm run dev` from backend folder
- ✅ Verify server is running

**All set! Your backend is ready to use.** 🚀
