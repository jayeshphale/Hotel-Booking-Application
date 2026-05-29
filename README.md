# Hotel Booking Application

![Project Banner](./assets/project-banner.png)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/frontend-React-blue.svg)](#tech-stack)
[![Backend](https://img.shields.io/badge/backend-Node.js-green.svg)](#tech-stack)
[![Database](https://img.shields.io/badge/database-MongoDB-brightgreen.svg)](#tech-stack)
[![Deployment](https://img.shields.io/badge/deployment-Vercel%20%2B%20Render-blueviolet.svg)](DEPLOYMENT.md)

A premium SaaS-style hotel booking platform built for modern travel experiences, admin operations, and demo-ready payment workflows.

---

## Project Overview

Hotel Booking Application is a full-stack hotel reservation platform featuring:

- A polished **React + Vite** frontend for hotel search, room selection, checkout, and booking confirmation
- A secure **Node.js + Express** backend with MongoDB for persistence, authentication, and booking workflow management
- A complete **wallet payment system**, demo Razorpay payment fallback, and admin analytics dashboard
- Production-ready architecture designed for portfolio presentation and client-facing demos

---

## Features

### User Experience

- Hotel discovery with search, filters, and sorting
- Hotel details, room availability, and capacity-aware booking
- Modern checkout flow with guest details, payment options, and confirmation
- Demo Razorpay flow when credentials are unavailable
- Full wallet system with balance, top-up, transaction history, and wallet payment
- Booking history and user profile management

### Admin Experience

- Analytics dashboard with revenue trends, booking volume, and status breakdown
- Hotel and room management interfaces
- Booking management with status updates and search/filter support
- Customer insights and spending overview

### Platform Capabilities

- JWT authentication with role-based access control
- MongoDB-backed data storage with Mongoose models
- Demo payment system with safe fallback when Razorpay is not configured
- Responsive UI with professional Tailwind design
- Clean separation between frontend and backend code
- Production-grade documentation and deployment guidance

---

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer
- Payments: Razorpay demo fallback, wallet transactions, booking payments
- Admin UI: Recharts, custom stat cards, table filters, analytics charts
- Deployment: Vercel for frontend, Render/other provider for backend

---

## Folder Structure

```text
HOTEL BOOKING APPLICATION/
├─ client/                 # React frontend app
│  ├─ public/
│  ├─ src/
│  ├─ package.json
│  ├─ vite.config.js
│  └─ vercel.json
├─ server/                 # Express backend API
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ middleware/
│  ├─ utils/
│  ├─ server.js
│  ├─ package.json
│  └─ seed.js
├─ .env.example
├─ vercel.json
├─ README.md
├─ SETUP.md
├─ DEPLOYMENT.md
└─ CHECKLIST.md
```

---

## Environment Variables

### Root `.env.example`

The repository includes a root `.env.example` and environment templates in `client/.env.example` and `server/.env.example`.

### Frontend

- `VITE_API_URL` - API base URL for the backend
- `VITE_RAZORPAY_KEY_ID` - Razorpay key for demo/real payments

### Backend

- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port
- `JWT_SECRET` - Secret for JWT tokens
- `CLIENT_URL` - Frontend origin for CORS
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_KEY_SECRET` - Razorpay API secret
- `ETHEREAL_USER` - Optional test email user
- `ETHEREAL_PASS` - Optional test email password

---

## Installation

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd client
npm install
```

---

## Local Development

Start the backend server:

```bash
cd server
npm run dev
```

Start the frontend app:

```bash
cd client
npm run dev -- --host
```

Open `http://localhost:5173` in your browser.

---

## Production Build

Build the frontend for production:

```bash
cd client
npm run build
```

Verify backend syntax:

```bash
cd server
node --check server.js
```

---

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Hotels

- `GET /api/hotels`
- `GET /api/hotels/:id`

### Rooms

- `GET /api/rooms?hotelId=...`
- `GET /api/rooms/:id`

### Bookings

- `POST /api/bookings` (protected)
- `GET /api/bookings/my` (protected)
- `GET /api/bookings/:id` (protected)

### Payments

- `POST /api/payments/create-order`
- `POST /api/payments/verify`

### Wallets

- `GET /api/wallets/balance`
- `GET /api/wallets/transactions`
- `POST /api/wallets/topup`
- `POST /api/wallets/pay`

---

## Wallet System

- Realtime wallet balance and transaction history
- Demo wallet top-up flow
- Wallet-based booking payment flow
- Transaction records with credit/debit tracking
- Balance validation and safe deduction

---

## Demo Payment System

- Razorpay demo order generation when keys are absent
- Verified demo payment flow with secure fallback
- Proper receipt and order IDs in demo mode
- Full booking creation after demo verification

---

## Admin Credentials

Use the seeded admin user for local testing after running the seed script.

- **Email:** `admin@example.com`
- **Password:** `Admin@123`

> If the admin user is not available, run `npm run seed` in `server` to restore demo data.

---

## Screenshots

| Desktop | Mobile |
|---|---|
| ![Screenshot 1](./assets/screenshot-desktop.png) | ![Screenshot 2](./assets/screenshot-mobile.png) |

---

## Deployment

Read the full deployment guide in [DEPLOYMENT.md](./DEPLOYMENT.md).

### Recommended deployment flow

1. Deploy backend to Render or another Node host
2. Deploy frontend to Vercel using `client` as the root
3. Configure `VITE_API_URL` in Vercel and `CLIENT_URL` in backend

---

## Future Improvements

- Add real payment integration with Razorpay production keys
- Add booking cancellation/refund workflows
- Add user reviews and hotel ratings
- Add internationalization (i18n)
- Add admin user management and role audit logs
- Add email notifications for booking reminders

