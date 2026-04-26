# DriveMate Architecture

This file documents the backend architecture, frontend architecture, and component design of the DriveMate project.

## 1. High-Level Overview

DriveMate is a full-stack car rental platform with:

- A React + Vite frontend for customers and admins
- An Express + MongoDB backend for data, authentication, and uploads
- JWT-based admin protection
- WhatsApp-based booking handoff for customer requests

## 2. Frontend Architecture

### 2.1 Runtime Stack

- React 19
- Vite
- React Router DOM
- React Helmet Async
- Lucide React icons

### 2.2 Frontend Entry Flow

The frontend starts from [client/src/main.jsx](client/src/main.jsx), which renders [client/src/App.jsx](client/src/App.jsx).

`App.jsx` defines the route tree and wraps the app with `CarProvider` so car data is available across the site.

### 2.3 Routing Structure

The app has two route groups:

- Public site routes
  - `/` home
  - `/cars` browse
  - `/cars/:id` car detail
  - `/booking/:id` booking form
  - `/confirmation` booking success screen
- Admin routes
  - `/admin-login` public login page
  - `/admin` protected dashboard

Shared layout behavior:

- Public pages share the same `Navbar` and `Footer`
- `ScrollToHash` supports section links like `/#about` and `/#contact`
- `PrivateRoute` prevents unauthenticated access to the admin dashboard

### 2.4 State Management

Global car state is handled in [client/src/context/CarContext.jsx](client/src/context/CarContext.jsx).

The context:

- Fetches the car list on app load
- Normalizes backend data for the UI
- Exposes `cars`, `loading`, `addCar`, `removeCar`, `updateCar`, `toggleAvailability`, and `refreshCars`
- Centralizes admin-authenticated car mutations

It also converts backend fields into frontend-friendly values such as:

- `_id` to `id`
- `isAvailable` to `available`
- relative upload paths to fully qualified image URLs

### 2.5 Frontend Configuration

- [client/src/config.js](client/src/config.js) defines `API_BASE_URL`
- The app uses `VITE_API_URL` when present, otherwise it falls back to `http://localhost:5000/api`

## 3. Component Design

### 3.1 Reusable Layout Components

#### Navbar

[client/src/components/Navbar.jsx](client/src/components/Navbar.jsx) is the public top navigation bar.

Responsibilities:

- Shows branding and navigation links
- Tracks scroll state for styling changes
- Handles mobile menu open/close behavior
- Fetches the owner WhatsApp number from `/api/settings`
- Opens WhatsApp directly from the header action

#### Footer

[client/src/components/Footer.jsx](client/src/components/Footer.jsx) is the shared site footer.

Responsibilities:

- Shows brand information and contact details
- Provides quick links and service links
- Uses a mobile accordion pattern for collapsible sections
- Reuses the backend WhatsApp setting for direct contact actions

#### PrivateRoute

[client/src/components/PrivateRoute.jsx](client/src/components/PrivateRoute.jsx) protects admin pages.

Responsibilities:

- Checks for `dm_admin_token` in localStorage
- Redirects unauthenticated users to `/admin-login`
- Provides simple session helpers for login and logout

### 3.2 Page Components

#### Home

[client/src/pages/Home.jsx](client/src/pages/Home.jsx)

- Hero landing section
- Date-based search entry point
- How-it-works section
- Feature highlights
- Featured cars grid
- CTA to browse the full fleet

#### Browse

[client/src/pages/Browse.jsx](client/src/pages/Browse.jsx)

- Full fleet listing
- Search, category, price, transmission, and availability filters
- Sort options
- Card grid for all available vehicles

#### CarDetail

[client/src/pages/CarDetail.jsx](client/src/pages/CarDetail.jsx)

- Detailed vehicle view
- Rental duration preview
- Feature/spec grid
- Customer review section
- Entry point to booking

#### Booking

[client/src/pages/Booking.jsx](client/src/pages/Booking.jsx)

- Customer details form
- Date inputs with localStorage autofill from the home search
- Cost summary
- Booking submission to the backend
- WhatsApp message handoff after successful save

#### Confirmation

[client/src/pages/Confirmation.jsx](client/src/pages/Confirmation.jsx)

- Success screen after booking submission
- Animated confetti effect
- Next-step guidance for the user

#### AdminLogin

[client/src/pages/AdminLogin.jsx](client/src/pages/AdminLogin.jsx)

- Username/password login form
- API login request
- Token persistence in localStorage
- Redirects logged-in admins directly to the dashboard

#### AdminPanel

[client/src/pages/AdminPanel.jsx](client/src/pages/AdminPanel.jsx)

- Fleet dashboard
- Booking management view
- Add car modal
- Image upload flow
- Availability toggle and delete actions
- Mobile bottom nav for smaller screens

### 3.3 Component Hierarchy

```text
App
├─ CarProvider
├─ Router
│  ├─ /admin-login
│  │  └─ AdminLogin
│  ├─ /admin
│  │  └─ PrivateRoute
│  │     └─ AdminPanel
│  └─ public layout
│     ├─ Navbar
│     ├─ Routes
│     │  ├─ Home
│     │  ├─ Browse
│     │  ├─ CarDetail
│     │  ├─ Booking
│     │  └─ Confirmation
│     └─ Footer
```

## 4. Backend Architecture

### 4.1 Runtime Stack

- Node.js + Express
- MongoDB with Mongoose
- JWT for admin authentication
- Multer for image upload handling
- CORS configured through environment-based allowed origins

### 4.2 Backend Entry Flow

The backend starts from [server/server.js](server/server.js), which:

1. Loads environment variables with `dotenv`
2. Connects to MongoDB through [server/config/db.js](server/config/db.js)
3. Configures CORS and JSON parsing
4. Mounts API routes under `/api`
5. Serves uploaded images from `/uploads`
6. Exposes `/health`, `/`, and `/api/settings`

### 4.3 API Layer

The backend is organized by feature:

- [server/routes/authRoutes.js](server/routes/authRoutes.js)
- [server/routes/carRoutes.js](server/routes/carRoutes.js)
- [server/routes/bookingRoutes.js](server/routes/bookingRoutes.js)
- [server/routes/uploadRoutes.js](server/routes/uploadRoutes.js)

Responsibilities:

- Auth routes handle admin login and one-time admin seeding
- Car routes expose fleet CRUD operations
- Booking routes handle customer booking creation and admin booking management
- Upload routes handle secure image uploads for car listings

### 4.4 Controllers

Business logic lives in the controller layer:

- [server/controllers/authController.js](server/controllers/authController.js)
  - Verifies admin credentials
  - Issues JWT tokens
  - Provides one-time admin seeding support
- [server/controllers/carController.js](server/controllers/carController.js)
  - Lists cars for public browsing
  - Creates, updates, and deletes cars for the admin panel
  - Normalizes `available` and `isAvailable` update payloads
- [server/controllers/bookingController.js](server/controllers/bookingController.js)
  - Saves new customer booking requests
  - Returns the owner WhatsApp number from environment settings
  - Allows admins to view and update booking status

### 4.5 Middleware

- [server/middleware/authMiddleware.js](server/middleware/authMiddleware.js) protects admin-only routes
- It reads `Bearer <token>` headers, verifies the JWT, and attaches the admin record to `req.admin`

### 4.6 Data Models

MongoDB collections are defined with Mongoose models:

- [server/models/Admin.js](server/models/Admin.js)
  - Stores admin username and hashed password
- [server/models/Car.js](server/models/Car.js)
  - Stores fleet details such as name, category, seats, price, image, rating, and availability
- [server/models/Booking.js](server/models/Booking.js)
  - Stores customer booking requests, rental dates, total cost, and status

### 4.7 Backend Request Flow

Public browsing flow:

1. Client requests `/api/cars`
2. Backend reads cars from MongoDB
3. Client normalizes the response in context and renders it in the UI

Booking flow:

1. Customer submits booking form from the frontend
2. Frontend POSTs booking data to `/api/bookings`
3. Backend persists the booking in MongoDB
4. Backend returns the booking ID and owner WhatsApp number
5. Frontend opens WhatsApp with a pre-filled message for confirmation

Admin flow:

1. Admin logs in through `/api/auth/login`
2. Backend returns a JWT
3. Frontend stores the token in localStorage
4. Protected admin calls send the token through the `Authorization` header

## 5. End-to-End Interaction Model

### Customer Journey

1. Customer lands on Home
2. They browse featured cars or jump to the full fleet
3. They open a car detail page
4. They fill out the booking form
5. The booking is saved on the backend
6. WhatsApp opens with a pre-filled booking message
7. The confirmation page explains what happens next

### Admin Journey

1. Admin opens `/admin-login`
2. Admin authenticates with username and password
3. The token is stored locally
4. Admin manages the fleet and bookings in `/admin`
5. Admin can add cars, upload images, toggle availability, and update booking status

## 6. Notes

- The frontend relies on API responses from the backend and does light normalization in `CarContext`
- Uploaded car images are served directly from the backend `uploads` directory
- The booking flow is intentionally lightweight: it stores the request in MongoDB and uses WhatsApp for owner confirmation
