# 🛠️ Local Development Setup Guide

Step-by-step instructions for setting up the Hotel Booking Application on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16+ - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** (Free tier) - [Create Account](https://www.mongodb.com/cloud/atlas)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### Verify Installation

```bash
node --version      # Should be v16 or higher
npm --version       # Should be 8 or higher
git --version       # Should be 2.30 or higher
```

---

## Step 1: Get MongoDB Connection String

### Create Free MongoDB Atlas Cluster

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a free (M0) cluster:
   - Click **Create a Deployment**
   - Select **M0 Free**
   - Choose region closest to you
   - Click **Create Deployment**
4. Create a database user:
   - Go to **Database Access**
   - **Add New Database User**
   - Choose **Password** auth
   - Enter username (e.g., `hoteluser`)
   - Generate password (save it!)
   - Finish
5. Allow network access:
   - Go to **Network Access**
   - **Add IP Address**
   - Add `0.0.0.0/0` (allows local + external)
   - Confirm
6. Get connection string:
   - Cluster → **Connect** → **Drivers**
   - Copy the MongoDB URI
   - Replace `<username>` and `<password>` with your credentials

**Example URI:**
```
mongodb+srv://hoteluser:mypassword123@cluster0.xyz.mongodb.net/hotel-booking?retryWrites=true&w=majority
```

---

## Step 2: Clone Repository

```bash
# Clone the repository (if using Git)
git clone https://github.com/yourusername/hotel-booking-app.git
cd "HOTEL BOOKING APPLICATION"

# Or extract ZIP file if downloaded
```

---

## Step 3: Setup Backend (Node.js + Express)

### Install Dependencies

```bash
# Navigate to server directory
cd server

# Install npm packages
npm install

# You should see packages like:
# - express
# - mongoose
# - bcryptjs
# - jsonwebtoken
# - cors
# - dotenv
```

### Configure Environment Variables

```bash
# In the server directory, create .env file
# Windows (PowerShell)
New-Item -Path ".env" -ItemType File

# macOS/Linux
touch .env
```

Edit `.env` file and add:

```env
# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://hoteluser:mypassword123@cluster0.xyz.mongodb.net/hotel-booking?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (can be any string for development)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Client URL (frontend URL for CORS)
CLIENT_URL=http://localhost:5173
```

**⚠️ IMPORTANT:** Replace `hoteluser` and `mypassword123` with your actual MongoDB credentials!

### Test Database Connection

```bash
# Start the server
npm run dev

# You should see:
# [nodemon] starting `node server.js`
# Server running on port 5000
# MongoDB connected: cluster0.xyz.mongodb.net
```

If you see a MongoDB connection error:
- ✅ Check your MONGO_URI is correct
- ✅ Check MongoDB username/password
- ✅ Verify IP whitelist includes your local machine (0.0.0.0/0)
- ✅ Verify internet connection

### Seed Sample Data (Optional)

```bash
# While server is running in another terminal:
npm run seed

# This creates sample hotels, rooms, users, and bookings
# Gives you data to work with immediately
```

---

## Step 4: Setup Frontend (React + Vite)

### Install Dependencies

```bash
# In a new terminal, navigate to client
cd client

# Install npm packages
npm install

# You should see packages like:
# - react
# - vite
# - tailwindcss
# - axios
# - react-router-dom
# - framer-motion
# - recharts
```

### Configure Environment Variables

```bash
# In the client directory, create .env file
# Windows (PowerShell)
New-Item -Path ".env" -ItemType File

# macOS/Linux
touch .env
```

Edit `.env` file and add:

```env
# Backend API URL (must match backend PORT)
VITE_API_URL=http://localhost:5000
```

### Start Frontend Development Server

```bash
# Make sure you're in the client directory
npm run dev

# You should see:
# ✓ built in 1.23s
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

---

## Step 5: Access the Application

Now everything is running! Open your browser and visit:

### Main Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/

### Test Accounts

**Admin Account (Full Access)**
- Email: `admin@example.com`
- Password: `Admin@123`

**Regular User Account**
- Email: `user@example.com`
- Password: `User@123`

---

## Step 6: Project Structure Overview

```
client/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components (Home, Hotels, etc.)
│   ├── context/         # State management (Auth, Booking, Toast)
│   ├── services/        # API service calls
│   ├── hooks/           # Custom React hooks
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── vite.config.js       # Vite build configuration
├── tailwind.config.js   # Tailwind styling
└── package.json         # Dependencies

server/
├── controllers/         # Business logic
├── models/             # MongoDB schemas
├── routes/             # API endpoints
├── middleware/         # Auth, error handling
├── config/             # Database connection
├── app.js              # Express app setup
├── server.js           # Server startup
└── package.json        # Dependencies
```

---

## Common Development Commands

### Frontend Commands

```bash
cd client

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check build output size
npm run build -- --verbose
```

### Backend Commands

```bash
cd server

# Start development server with auto-reload (http://localhost:5000)
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed
```

---

## Testing the Application

### 1. User Registration

1. Visit http://localhost:5173
2. Click "Sign Up"
3. Fill in name, email, password, phone
4. Click "Register"
5. You should be logged in automatically

### 2. Browse Hotels

1. Go to "Hotels" page
2. Search by city name or hotel name
3. Try filters (rating, sorting)
4. Click on a hotel to view details

### 3. Make a Booking

1. Select a hotel and view details
2. Choose check-in and check-out dates
3. Select number of guests
4. Choose a room
5. Click "Proceed to Checkout"
6. Enter guest details
7. Confirm booking
8. You should see booking confirmation

### 4. View Your Bookings

1. Click "My Bookings" in navigation
2. See your booking history with status

### 5. Admin Dashboard (Requires Admin Login)

1. Go to http://localhost:5173/admin
2. Login with admin credentials (admin@example.com / Admin@123)
3. Explore:
   - **Dashboard:** View analytics and KPIs
   - **Hotels:** Create/edit/delete hotels
   - **Rooms:** Manage room inventory
   - **Bookings:** Track and manage bookings
   - **Customers:** View customer information

---

## Troubleshooting

### Port Already in Use

**Error:** `Port 5173 or 5000 is already in use`

```bash
# Find and kill process using the port
# Windows PowerShell
lsof -i :5173          # Find process
kill -9 <PID>          # Kill process

# macOS/Linux
lsof -i :5173
kill -9 PID

# Or change port in configuration
# server: change PORT in .env
# client: npm run dev -- --port 3000
```

### MongoDB Connection Failed

**Error:** `MONGO_URI is undefined` or `connection timeout`

**Solutions:**
1. ✅ Check `.env` file exists in `server/` directory
2. ✅ Check MONGO_URI is correct (username, password, cluster)
3. ✅ Verify username/password are exactly right (case-sensitive!)
4. ✅ Check MongoDB Atlas IP whitelist includes your machine
5. ✅ Verify internet connection
6. ✅ Check MongoDB Atlas cluster is running

### API Calls Failing with CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. ✅ Verify `VITE_API_URL` is correct in client `.env`
2. ✅ Verify backend `CLIENT_URL` is correct in server `.env`
3. ✅ Restart backend server after env changes
4. ✅ Check backend is running on correct port

### Build Errors

**Error:** `npm run build` fails

```bash
# Try these steps:
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Hot Reload Not Working

```bash
# Windows: Issues with file watching
# Solution: Set CHOKIDAR_USEPOLLING=true
$env:CHOKIDAR_USEPOLLING="true"
npm run dev

# macOS/Linux
CHOKIDAR_USEPOLLING=true npm run dev
```

---

## Tips for Development

### Use VS Code Extensions

Recommended extensions for productivity:

1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **Prettier** (Code formatter)
4. **Thunder Client** or **Postman** (API testing)
5. **MongoDB for VS Code**

### API Testing

Use Thunder Client (VS Code) or Postman:

```bash
# Test login endpoint
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "User@123"
}
```

### Check Console for Errors

1. **Frontend:** Open browser DevTools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab for API calls
2. **Backend:** Check terminal output for errors

### Debug Mode

Add `console.log()` statements:

```javascript
// client/src/pages/Home.jsx
console.log('Fetching hotels...');
const hotels = await fetchHotels();
console.log('Fetched:', hotels);

// server/controllers/hotelController.js
console.log('Request:', req.body);
const hotel = await Hotel.create(req.body);
console.log('Created:', hotel);
```

---

## Next Steps

Once you have everything working locally:

1. ✅ Explore the codebase
2. ✅ Understand the folder structure
3. ✅ Make a small change (e.g., change button color)
4. ✅ See the changes reflected instantly (hot reload)
5. ✅ Test the complete booking flow
6. ✅ Review admin dashboard features
7. ✅ Study how the API wrapper works (client/src/services/api.js)

---

## Getting Help

If you're stuck:

1. Check error messages in terminal or browser console
2. Review the [README.md](./README.md) for project overview
3. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
4. Verify all `.env` files are correctly configured
5. Ensure Node.js and npm are properly installed
6. Try clearing cache: `npm cache clean --force`

---

## Performance Tips

### Frontend
- React DevTools Profiler to check render performance
- Lighthouse audit (DevTools → Lighthouse)
- Check Network tab for slow API calls

### Backend
- Use Postman to test API response times
- Check MongoDB Atlas Metrics for database performance
- Monitor server logs for slow operations

---

**Happy Coding! 🚀**

Last Updated: May 2026
