# Bari Sathi Server

This repository contains the backend server for the Bari Sathi project. It serves as the main API backend, handling authentication, listings, and bookings. The server is built using Node.js and Express and supports JWT-based authentication, user role management, and more.

## Live Demo

- **Live URL:** [https://barisathi-server.vercel.app/api](https://barisathi-server.vercel.app/api)

## Repository Links

- **Server Repository:** [github.com/shahadathhs/barisathi-server](https://github.com/shahadathhs/barisathi-server)
- **Client Repository:** [github.com/shahadathhs/barisathi](https://github.com/shahadathhs/barisathi)

## Table of Contents

- [Features](#features)
- [📦 Packages Used](#-packages-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [🗄️ Models & Schemas](#️-models--schemas)

## Features

- **Authentication:** User registration, login, profile updates, password changes, and role management.
- **Listings Management:** CRUD operations for listings (create, read, update, delete).
- **Bookings Management:** Create bookings, fetch booking details, update booking status, and delete bookings.
- **Role-Based Access Control:** Different endpoints accessible based on user roles (ADMIN, LANDLORD, TENANT).
- **Middleware Integration:** Includes API info logging, error handling, and request validation.

## 📦 Packages Used

### Dependencies

| Package      | Version |
| ------------ | ------- |
| bcryptjs     | ^3.0.0  |
| cors         | ^2.8.5  |
| dotenv       | ^16.4.5 |
| express      | ^4.21.1 |
| jsonwebtoken | ^9.0.2  |
| mongoose     | ^8.8.2  |
| ms           | ^2.1.3  |
| nodemon      | ^3.1.7  |
| winston      | ^3.17.0 |
| zod          | ^3.23.8 |

### Dev Dependencies

| Package                          | Version  |
| -------------------------------- | -------- |
| @eslint/js                       | ^9.15.0  |
| @types/cors                      | ^2.8.17  |
| @types/express                   | ^5.0.0   |
| @types/jsonwebtoken              | ^9.0.8   |
| @types/node                      | ^22.9.1  |
| @typescript-eslint/eslint-plugin | ^8.15.0  |
| @typescript-eslint/parser        | ^8.15.0  |
| eslint                           | ^9.15.0  |
| eslint-define-config             | ^2.1.0   |
| eslint-plugin-import             | ^2.31.0  |
| globals                          | ^15.12.0 |
| prettier                         | ^3.3.3   |
| ts-node-dev                      | ^2.0.0   |
| tsc-alias                        | ^1.8.13  |
| tsconfig-paths                   | ^4.2.0   |
| typescript                       | ^5.7.3   |
| typescript-eslint                | ^8.15.0  |

## Getting Started

### Prerequisites

- **Node.js:** Ensure you have Node.js installed (version 14 or above is recommended).
- **npm:** Comes bundled with Node.js.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/shahadathhs/barisathi-server.git
   cd barisathi-server
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory based on the provided example (`.env.example`). Here is a sample configuration:

```dotenv
# General
PORT=8080
NODE_ENV=development

# Database
DATABASE_URL=<your-mongo-uri>

# JWT
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=1d
```

Replace placeholders with your actual values.

## Running Locally

To run the server locally, follow these steps:

1. **Ensure your `.env` file is properly configured.**

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**

   ```bash
   npm run start:dev
   ```

   This command will start the server on the port specified in your `.env` file (default is 5000). The server supports hot reloading for a smoother development experience.

4. **Access the Server:**

   - Open your browser and navigate to `http://localhost:8080/` to see the welcome message.
   - Access the root API route at `http://localhost:8080/api` for more details.

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint                    | Description                 | Auth                    |
| ------ | --------------------------- | --------------------------- | ----------------------- |
| POST   | `/api/auth/register`        | Register new user           | Public                  |
| POST   | `/api/auth/login`           | Login user                  | Public                  |
| PATCH  | `/api/auth/update-profile`  | Update own profile          | LANDLORD, TENANT, ADMIN |
| PATCH  | `/api/auth/update-password` | Change own password         | Any authenticated       |
| POST   | `/api/auth/:id/delete`      | Soft-delete user            | LANDLORD, TENANT        |
| GET    | `/api/auth/getAll`          | List all users              | ADMIN                   |
| PATCH  | `/api/auth/:id/role`        | Change a user’s role        | ADMIN                   |
| PATCH  | `/api/auth/:id/active`      | Toggle user active/inactive | ADMIN                   |

### Listing Routes (`/api/listings`)

| Method | Endpoint                 | Description                         | Auth            |
| ------ | ------------------------ | ----------------------------------- | --------------- |
| POST   | `/api/listings/`         | Create a listing                    | LANDLORD        |
| GET    | `/api/listings/`         | Get all listings                    | Public          |
| GET    | `/api/listings/landlord` | Get listings for logged-in landlord | LANDLORD        |
| GET    | `/api/listings/:id`      | Get listing details                 | Public          |
| PATCH  | `/api/listings/:id`      | Update a listing                    | LANDLORD, ADMIN |
| DELETE | `/api/listings/:id`      | Delete a listing                    | LANDLORD, ADMIN |

### Booking Routes (`/api/bookings`)

| Method | Endpoint                   | Description             | Auth                    |
| ------ | -------------------------- | ----------------------- | ----------------------- |
| POST   | `/api/bookings/`           | Create a booking        | TENANT                  |
| GET    | `/api/bookings/`           | Get all bookings        | ADMIN                   |
| GET    | `/api/bookings/tenant`     | Get tenant’s bookings   | TENANT                  |
| GET    | `/api/bookings/landlord`   | Get landlord’s bookings | LANDLORD                |
| GET    | `/api/bookings/:id`        | Get booking details     | ADMIN, LANDLORD, TENANT |
| PATCH  | `/api/bookings/:id/status` | Update booking status   | LANDLORD, TENANT        |
| DELETE | `/api/bookings/:id`        | Delete a booking        | ADMIN                   |

## 🗄️ Models & Schemas

### Mongoose Models

- **User** (`src/modules/auth/auth.model.ts`)  
  Fields: `name`, `email` (unique), `phone` (unique), `password` (hashed), `role` (enum), `isActive`, `isDeleted`, timestamps.  
  Methods: `matchPassword()`, `updatePassword()`, `toProfileJSON()`, `isAdmin()`.

- **Listing** (`src/modules/listing/listing.model.ts`)  
  Fields: `location`, `description`, `rentAmount`, `bedrooms`, `images[]`, `amenities[]`, `landlord` (ref), timestamps.

- **Booking** (`src/modules/booking/booking.model.ts`)  
  Fields: `_id`, `listing` (ref), `landlord` (ref), `tenant` (ref), `tenantMessage`, `status` (enum), `checkInDate`, `checkOutDate`, timestamps.

### Zod Validation Schemas

- **AuthValidation** (`src/modules/auth/auth.validation.ts`)

  - `registerUserZodSchema` (name, email, phone, password, role)
  - `updateProfileZodSchema` (name, email, phone)

- **ListingValidation** (`src/modules/listing/listing.validation.ts`)

  - `createListingSchema` (location, description, rentAmount, bedrooms, images?, amenities?)
  - `updateListingSchema` (optional fields for updates)

- **BookingValidation** (`src/modules/booking/booking.validation.ts`)
  - `createBookingSchema` (listing, checkInDate, checkOutDate, tenantMessage, landlord)
  - `updateBookingSchema` (status enum)

---
