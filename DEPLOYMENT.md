# 🚀 Deployment Guide

Complete step-by-step instructions for deploying the Hotel Booking Platform to production.

---

## Table of Contents

1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Environment Configuration](#environment-configuration)
5. [Testing After Deployment](#testing-after-deployment)
6. [Troubleshooting](#troubleshooting)

---

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and create an account
3. Verify your email

### Step 2: Create a Cluster

1. Click "Create a Deployment"
2. Select "M0 Free" tier
3. Choose your region (closest to your users)
4. Click "Create Deployment"
5. Wait 2-3 minutes for cluster creation

### Step 3: Create Database User

1. In the Atlas dashboard, go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Enter username and generate a strong password
5. **Save the credentials** - you'll need them

### Step 4: Get Connection String

1. Go to **Databases** → Click **Connect**
2. Select **Drivers** 
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<database_name>` with your values

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/hotel-booking?retryWrites=true&w=majority
```

### Step 5: Whitelist IP Addresses

1. Go to **Network Access**
2. Click **Add IP Address**
3. For production: 
   - Add Vercel IPs: `76.75.14.0/24`
   - Add Render: `0.0.0.0/0` (allows all - add specific IPs if known)
4. Click **Confirm**

### Step 6: Seed Sample Data

Connect to your database and run the seed script:

```bash
cd server
npm install
# Create .env with MONGO_URI
npm run seed
```

---

## Backend Deployment (Render)

### Step 1: Prepare GitHub Repository

```bash
# Make sure your code is clean
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Create Render Account

1. Visit [Render.com](https://render.com)
2. Sign up using GitHub
3. Authorize Render to access your repositories

### Step 3: Deploy Web Service

1. Click **New +** → **Web Service**
2. Select your repository
3. Configure:
   - **Name:** `hotel-booking-api` (or your choice)
   - **Environment:** `Node`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (if eligible) or Paid

### Step 4: Add Environment Variables

1. In Render dashboard, scroll to **Environment**
2. Add these variables:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-booking
JWT_SECRET=generate_strong_random_string_here
PORT=10000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
```

**To generate JWT_SECRET:**
```bash
# On your local machine
openssl rand -base64 32
```

3. Click **Create Web Service**
4. Render will automatically start deployment
5. Wait 5-10 minutes for the deployment to complete

### Step 5: Get Backend URL

- Once deployment succeeds, you'll see a URL like: `https://hotel-booking-api.onrender.com`
- **Save this URL** - you'll need it for frontend configuration

---

## Frontend Deployment (Vercel)

### Step 1: Push Code to GitHub

```bash
# Ensure all frontend code is committed
cd client
git add .
git commit -m "Prepare frontend for production"
git push origin main
```

### Step 2: Create Vercel Account

1. Visit [Vercel.com](https://vercel.com)
2. Sign up using GitHub
3. Authorize Vercel to access your repositories

### Step 3: Create New Project

1. Click **Add New...** → **Project**
2. Select your GitHub repository
3. Configure:
   - **Framework:** React
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 4: Add Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add:

```env
VITE_API_URL=https://hotel-booking-api.onrender.com
```

(Replace with your actual Render backend URL)

3. Click **Deploy**
4. Wait for deployment to complete (~2 minutes)

### Step 5: Get Frontend URL

- Your deployed site URL will be shown (e.g., `https://your-project-name.vercel.app`)
- **Save this URL**

### Step 6: Update Backend CORS

Back in Render dashboard:

1. Go to your backend service
2. Edit **Environment Variables**
3. Update `CLIENT_URL`:
```
CLIENT_URL=https://your-project-name.vercel.app
```
4. Click **Save** and Render will redeploy

---

## Environment Configuration

### Development (.env files)

#### `server/.env`
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/hotel-booking
PORT=5000
JWT_SECRET=dev_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### `client/.env`
```env
VITE_API_URL=http://localhost:5000
```

### Production (Set in Deployment Platform)

#### Vercel Environment Variables
```
VITE_API_URL=https://your-backend-domain.onrender.com
```

#### Render Environment Variables
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/hotel-booking
JWT_SECRET=your_production_secret
PORT=10000
NODE_ENV=production
CLIENT_URL=https://your-frontend.vercel.app
```

---

## Testing After Deployment

### 1. Test Backend Health

```bash
curl https://your-backend-domain.onrender.com/
# Expected: {"message":"Hotel Booking API is running"}
```

### 2. Test User Registration

```bash
curl -X POST https://your-backend-domain.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123",
    "phone": "+1234567890"
  }'
```

### 3. Test User Login

```bash
curl -X POST https://your-backend-domain.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### 4. Test Hotels API

```bash
curl https://your-backend-domain.onrender.com/api/hotels
```

### 5. Manual Testing Workflow

1. Visit your Vercel frontend URL
2. Register a new account
3. Search for hotels
4. Select a hotel and view details
5. Select a room
6. Complete checkout
7. View booking confirmation
8. Login as admin (admin@example.com / Admin@123)
9. View admin dashboard
10. Manage hotels, rooms, and bookings

---

## Troubleshooting

### Backend Won't Start on Render

**Error:** `MONGO_URI is undefined`
- ✅ **Solution:** Check Environment Variables in Render dashboard. Ensure `MONGO_URI` is set and reachable.

**Error:** `Connection timeout`
- ✅ **Solution:** Whitelist Render IP in MongoDB Atlas → Network Access

**Error:** `JWT_SECRET is not defined`
- ✅ **Solution:** Add `JWT_SECRET` to Render Environment Variables

### Frontend Can't Connect to Backend

**Error:** `CORS error`, `network error`, or `timeout`
- ✅ **Check:** Backend URL is correct in `VITE_API_URL`
- ✅ **Check:** Backend `CLIENT_URL` matches frontend domain
- ✅ **Check:** Backend is deployed and running (test with curl)
- ✅ **Verify:** No firewall/network blocking

### Vercel Build Fails

**Error:** `npm run build failed`
- ✅ **Solution:** Run `npm run build` locally to see the error
- ✅ **Check:** All imports are correct
- ✅ **Check:** Node version matches (16+)

**Error:** `VITE_API_URL not defined`
- ✅ **Solution:** Add to Vercel Environment Variables
- ✅ **Check:** Deployment restarted after adding env var

### Booking Flow Doesn't Work

**Error:** `Network error on checkout`
- ✅ **Check:** Backend is running
- ✅ **Check:** API URL in frontend is correct
- ✅ **Check:** User is logged in
- ✅ **Test:** Direct API call: `curl https://backend-url/api/hotels`

### Database Issues

**No data showing:**
- ✅ **Check:** Database seeding: `npm run seed`
- ✅ **Check:** MONGO_URI is correct
- ✅ **Check:** Database user has proper permissions
- ✅ **Check:** IP whitelist includes your Render deployment

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Database user created with strong password
- [ ] Sample data seeded
- [ ] Backend code pushed to GitHub
- [ ] Backend deployed on Render with all env vars
- [ ] Backend URL obtained (e.g., https://hotel-booking-api.onrender.com)
- [ ] Frontend code pushed to GitHub
- [ ] Frontend deployed on Vercel with VITE_API_URL
- [ ] Frontend URL obtained (e.g., https://hotel-booking.vercel.app)
- [ ] Backend CORS updated with frontend URL
- [ ] API health check passed
- [ ] User registration tested
- [ ] User login tested
- [ ] Hotel listing works
- [ ] Complete booking flow works
- [ ] Admin dashboard accessible
- [ ] All environment variables are production-safe (no hardcoded secrets)
- [ ] Mobile responsiveness verified
- [ ] No console errors or warnings

---

## Post-Deployment Maintenance

### Regular Tasks

- Monitor Render logs for errors
- Check MongoDB Atlas storage usage
- Update dependencies monthly
- Review analytics for usage patterns
- Monitor application performance

### Monitor Logs

**Render Backend Logs:**
1. Go to Render dashboard
2. Select your web service
3. Click **Logs** tab
4. Check for errors and warnings

**Vercel Frontend Logs:**
1. Go to Vercel dashboard
2. Select your project
3. Click **Deployments**
4. View logs for each deployment

---

## Scaling Recommendations

As your application grows:

1. **Database:** MongoDB Atlas → Paid tier (better performance, backups)
2. **Backend:** Render → Paid tier (faster response, better uptime)
3. **Frontend:** Vercel → Premium (better support, analytics)
4. **CDN:** Consider Cloudflare for frontend caching
5. **Images:** Move to Cloudinary for optimization
6. **Monitoring:** Add error tracking (Sentry, LogRocket)

---

**Last Updated:** May 2026  
**Deployment Status:** Ready for Production ✅
