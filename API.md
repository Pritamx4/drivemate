# DriveMate API Reference

This file documents the backend API structure and how each endpoint is used by the frontend and admin flows.

## 1. API Overview

All backend endpoints are exposed from [server/server.js](server/server.js) under the `/api` prefix.

The API is grouped by feature:

- Auth: admin login and admin seeding
- Cars: public browsing and admin fleet management
- Bookings: customer booking requests and admin booking management
- Uploads: car image uploads for the admin panel
- Settings: public runtime settings used by the UI

## 2. Base Paths

- API base: `/api`
- Upload static path: `/uploads`
- Health check: `/health`
- Root check: `/`

## 3. Endpoint Reference

### 3.1 Auth

#### `POST /api/auth/login`

Defined in [server/routes/authRoutes.js](server/routes/authRoutes.js) and handled by [server/controllers/authController.js](server/controllers/authController.js).

Use:

- Authenticates the admin user
- Returns a JWT token on success

Frontend usage:

- [client/src/pages/AdminLogin.jsx](client/src/pages/AdminLogin.jsx) sends username and password here
- The returned token is stored in localStorage as `dm_admin_token`

Request body:

```json
{
  "username": "admin",
  "password": "secret"
}
```

Success response:

```json
{
  "_id": "...",
  "username": "admin",
  "token": "jwt-token"
}
```

#### `POST /api/auth/seed`

Defined in [server/routes/authRoutes.js](server/routes/authRoutes.js) and handled by [server/controllers/authController.js](server/controllers/authController.js).

Use:

- One-time admin creation endpoint
- Protected by the `ADMIN_SEED_SECRET` environment variable

Frontend usage:

- Not used by the normal UI flow

Request body:

```json
{
  "username": "admin",
  "password": "secret",
  "secret": "seed-secret"
}
```

### 3.2 Cars

#### `GET /api/cars`

Defined in [server/routes/carRoutes.js](server/routes/carRoutes.js) and handled by [server/controllers/carController.js](server/controllers/carController.js).

Use:

- Returns all cars for public browsing

Frontend usage:

- [client/src/context/CarContext.jsx](client/src/context/CarContext.jsx) fetches this on app load
- [client/src/pages/Home.jsx](client/src/pages/Home.jsx), [client/src/pages/Browse.jsx](client/src/pages/Browse.jsx), [client/src/pages/CarDetail.jsx](client/src/pages/CarDetail.jsx), and [client/src/pages/Booking.jsx](client/src/pages/Booking.jsx) all consume the car data through context

Access:

- Public

#### `POST /api/cars`

Defined in [server/routes/carRoutes.js](server/routes/carRoutes.js) and handled by [server/controllers/carController.js](server/controllers/carController.js).

Use:

- Adds a new car to the fleet

Frontend usage:

- [client/src/pages/AdminPanel.jsx](client/src/pages/AdminPanel.jsx) uses this when the admin submits the add-car modal

Access:

- Protected by JWT via [server/middleware/authMiddleware.js](server/middleware/authMiddleware.js)

#### `PUT /api/cars/:id`

Defined in [server/routes/carRoutes.js](server/routes/carRoutes.js) and handled by [server/controllers/carController.js](server/controllers/carController.js).

Use:

- Updates a car record
- Supports availability toggling and general edits

Frontend usage:

- [client/src/context/CarContext.jsx](client/src/context/CarContext.jsx) uses this for updates and availability toggles
- [client/src/pages/AdminPanel.jsx](client/src/pages/AdminPanel.jsx) uses it indirectly through the context

Access:

- Protected by JWT

#### `DELETE /api/cars/:id`

Defined in [server/routes/carRoutes.js](server/routes/carRoutes.js) and handled by [server/controllers/carController.js](server/controllers/carController.js).

Use:

- Deletes a car from the fleet

Frontend usage:

- [client/src/pages/AdminPanel.jsx](client/src/pages/AdminPanel.jsx) uses it through the car context

Access:

- Protected by JWT

### 3.3 Bookings

#### `POST /api/bookings`

Defined in [server/routes/bookingRoutes.js](server/routes/bookingRoutes.js) and handled by [server/controllers/bookingController.js](server/controllers/bookingController.js).

Use:

- Creates a new booking request
- Saves the customer details, rental dates, and total cost
- Returns the owner WhatsApp number so the frontend can open a chat after success

Frontend usage:

- [client/src/pages/Booking.jsx](client/src/pages/Booking.jsx) submits the booking form here

Access:

- Public

Request body fields:

- `carId`
- `carName`
- `fullName`
- `email`
- `phone`
- `address`
- `license`
- `pickupDate`
- `returnDate`
- `days`
- `totalCost`

Success response:

```json
{
  "message": "Booking saved",
  "booking": { }
}
```

#### `GET /api/bookings`

Defined in [server/routes/bookingRoutes.js](server/routes/bookingRoutes.js) and handled by [server/controllers/bookingController.js](server/controllers/bookingController.js).

Use:

- Returns all booking requests for admin review

Frontend usage:

- [client/src/pages/AdminPanel.jsx](client/src/pages/AdminPanel.jsx) loads bookings for the booking dashboard

Access:

- Protected by JWT

#### `PUT /api/bookings/:id`

Defined in [server/routes/bookingRoutes.js](server/routes/bookingRoutes.js) and handled by [server/controllers/bookingController.js](server/controllers/bookingController.js).

Use:

- Updates the booking status
- Allowed statuses: `Pending`, `Confirmed`, `Completed`, `Cancelled`

Frontend usage:

- [client/src/pages/AdminPanel.jsx](client/src/pages/AdminPanel.jsx) uses this from the booking table status selector

Access:

- Protected by JWT

### 3.4 Uploads

#### `POST /api/upload`

Defined in [server/routes/uploadRoutes.js](server/routes/uploadRoutes.js).

Use:

- Uploads a car image file
- Returns the stored image URL as a relative `/uploads/...` path

Frontend usage:

- [client/src/pages/AdminPanel.jsx](client/src/pages/AdminPanel.jsx) uses this in the add-car workflow

Access:

- Protected by JWT

Accepted file types:

- `jpg`
- `jpeg`
- `png`
- `webp`

### 3.5 Settings and Health

#### `GET /api/settings`

Defined in [server/server.js](server/server.js).

Use:

- Returns public runtime settings for the UI
- Currently exposes the owner WhatsApp number

Frontend usage:

- [client/src/components/Navbar.jsx](client/src/components/Navbar.jsx) uses it for the WhatsApp header action
- [client/src/components/Footer.jsx](client/src/components/Footer.jsx) uses it for social/contact actions
- [client/src/pages/Booking.jsx](client/src/pages/Booking.jsx) indirectly relies on the owner contact flow after booking submission

#### `GET /health`

Defined in [server/server.js](server/server.js).

Use:

- Simple backend health check

#### `GET /`

Defined in [server/server.js](server/server.js).

Use:

- Basic root response to confirm the API is running

## 4. Access Model

### Public endpoints

- `GET /api/cars`
- `POST /api/bookings`
- `GET /api/settings`
- `GET /health`
- `GET /`

### Protected endpoints

- `POST /api/cars`
- `PUT /api/cars/:id`
- `DELETE /api/cars/:id`
- `GET /api/bookings`
- `PUT /api/bookings/:id`
- `POST /api/upload`

Protected routes require a valid JWT in the `Authorization: Bearer <token>` header.

## 5. Frontend Usage Summary

- [client/src/context/CarContext.jsx](client/src/context/CarContext.jsx) is the main consumer of the cars API
- [client/src/pages/AdminLogin.jsx](client/src/pages/AdminLogin.jsx) calls the auth login endpoint
- [client/src/pages/Booking.jsx](client/src/pages/Booking.jsx) calls the booking creation endpoint
- [client/src/pages/AdminPanel.jsx](client/src/pages/AdminPanel.jsx) calls the protected car, booking, and upload endpoints
- [client/src/components/Navbar.jsx](client/src/components/Navbar.jsx) and [client/src/components/Footer.jsx](client/src/components/Footer.jsx) call the settings endpoint
