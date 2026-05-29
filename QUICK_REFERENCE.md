# ⚡ Quick Reference Guide

Fast reference for common development and deployment tasks.

---

## 🚀 Quick Start (Local Development)

```bash
# Terminal 1: Start Backend
cd server
npm install                    # First time only
npm run dev                    # Starts on http://localhost:5000

# Terminal 2: Start Frontend (new terminal)
cd client
npm install                    # First time only
npm run dev                    # Starts on http://localhost:5173
```

Visit http://localhost:5173 in your browser.

---

## 🔐 Test Accounts

### Admin Login
```
Email: admin@example.com
Password: Admin@123
```

### Demo User Login
```
Email: demo@example.com
Password: Demo@123
```

### Guest User Login
```
Email: guest@example.com
Password: Guest@123
```

All test accounts have demo wallet balance (₹500) pre-loaded for testing payment flows.

---

## 🌍 Production URLs

### Live Application
- **Frontend:** https://hotel-booking-application-enlq.vercel.app
- **Backend API:** https://hotel-booking-application-a5zz.onrender.com

### Database
- **MongoDB Atlas:** [Cloud Dashboard](https://www.mongodb.com/cloud/atlas)
  - Cluster: `cluster0.dptcofc.mongodb.net`
  - Database: `hotel-booking`

---

## 🛠️ Common Commands

### Frontend (client/)
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Backend (server/)
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm run seed` | Seed database with sample data |

---

## 📝 Environment Variables

### Backend (server/.env)
```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=any_random_string_for_dev
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (client/.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🌐 API Endpoints Quick Reference

### Auth
```
POST   /api/auth/register       Register new user
POST   /api/auth/login          User login
GET    /api/auth/me             Get current user (Protected)
```

### Hotels
```
GET    /api/hotels              Get all hotels
GET    /api/hotels/:id          Get hotel by ID
POST   /api/hotels              Create hotel (Admin)
PUT    /api/hotels/:id          Update hotel (Admin)
DELETE /api/hotels/:id          Delete hotel (Admin)
```

### Rooms
```
GET    /api/rooms?hotelId=:id   Get hotel rooms
POST   /api/rooms               Create room (Admin)
PUT    /api/rooms/:id           Update room (Admin)
DELETE /api/rooms/:id           Delete room (Admin)
```

### Bookings
```
POST   /api/bookings            Create booking (Protected)
GET    /api/bookings/my         Get user's bookings
GET    /api/bookings            Get all bookings (Admin)
PUT    /api/bookings/:id        Update booking status (Admin)
```

### Admin
```
GET    /api/admin/dashboard     Dashboard metrics
GET    /api/admin/customers     All customers
```

---

## 📱 Useful URLs

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin Panel: http://localhost:5173/admin
- API Health: http://localhost:5000/

---

## 🐛 Troubleshooting Quick Fixes

### Port Already in Use
```bash
# Windows PowerShell
lsof -i :5173
kill -9 <PID>

# Or change port
npm run dev -- --port 3000
```

### MongoDB Connection Error
- Check MONGO_URI in server/.env
- Verify username:password are correct
- Check IP whitelist in MongoDB Atlas includes 0.0.0.0/0

### Build Fails
```bash
cd client
rm -r node_modules
rm package-lock.json
npm install
npm run build
```

### CORS Error
- Check VITE_API_URL matches backend PORT
- Check backend CLIENT_URL matches frontend URL
- Restart both servers

---

## 📊 Deployment Links

Once deployed, your URLs will look like:
- **Frontend:** https://your-project.vercel.app
- **Backend:** https://your-api.onrender.com
- **Database:** MongoDB Atlas (no direct URL)

---

## 🔄 Deployment Checklist

**Before deploying:**
- [ ] Production build succeeds: `npm run build`
- [ ] No console errors or warnings
- [ ] .env files created with production values
- [ ] MongoDB Atlas cluster created
- [ ] GitHub repo pushed with all changes
- [ ] .env files added to .gitignore (no secrets!)

**Deployment steps:**
1. Create Vercel account and connect GitHub
2. Create Render account and connect GitHub
3. Create MongoDB Atlas cluster
4. Deploy backend on Render (set environment variables)
5. Deploy frontend on Vercel (set VITE_API_URL)
6. Test all features work on production

---

## 📚 Full Documentation

For detailed information, see:
- **[README.md](./README.md)** - Project overview
- **[SETUP.md](./SETUP.md)** - Local development setup
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment
- **[CHECKLIST.md](./CHECKLIST.md)** - Production validation
- **[PRODUCTION_SUMMARY.md](./PRODUCTION_SUMMARY.md)** - What's been done

---

## 🎯 Key Features to Test

### User Features
- [x] Sign up new account
- [x] Login with credentials
- [x] Search hotels
- [x] View hotel details
- [x] Select and book room
- [x] Complete checkout
- [x] View booking confirmation
- [x] Check "My Bookings"

### Admin Features
- [x] Login as admin
- [x] View dashboard analytics
- [x] Create new hotel
- [x] Add rooms to hotel
- [x] Update room availability
- [x] View all bookings
- [x] Update booking status
- [x] View customer list

---

## 💡 Pro Tips

### Development
- Use `console.log()` for debugging
- Check Network tab in DevTools for API calls
- Use React DevTools extension for component debugging
- Open Render/Vercel logs for production issues

### Performance
- Keep components small and focused
- Use React.memo() for expensive re-renders
- Debounce search inputs (already done)
- Lazy load components if app gets large

### Git
- Commit frequently with clear messages
- Use .gitignore to exclude node_modules and .env
- Keep main branch clean (use feature branches)
- Write descriptive commit messages

---

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

---

## 📞 Support

If you encounter issues:
1. Check the error message in console/terminal
2. Search the documentation files
3. Check the DEPLOYMENT.md troubleshooting section
4. Verify all environment variables are set correctly
5. Ensure all services (backend, MongoDB) are running

---

**Last Updated:** May 2026  
**Status:** ✅ Ready for Production
