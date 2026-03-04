# DesiGuide - Travel Management System

A comprehensive travel management platform with an admin dashboard and backend API, designed to manage destinations, packages, guides, bookings, and users.

## 🌐 Live Demo

Explore the live deployed applications:

### 🏠 User Dashboard
**URL**: [https://desiguide.vercel.app](https://desiguide.vercel.app)

**Test Credentials:**
- **Email**: `user@gmail.com`
- **Password**: `password`

### 👨‍💼 Admin Dashboard
**URL**: [https://admindesiguide.vercel.app](https://admindesiguide.vercel.app)

**Test Credentials:**
- **Email**: `admin@gmail.com`
- **Password**: `password`

### 🎒 Supporter/Guide Dashboard
**URL**: [https://supporterdesiguide.vercel.app](https://supporterdesiguide.vercel.app)

**Test Credentials:**

| Role | Email | Password |
|------|-------|----------|
| Guide | `guide@gmail.com` | `password` |
| Accommodation Provider | `ap@gmail.com` | `password` |
| Transport Provider | `tp@gmail.com` | `password` |

> ⚠️ **Note**: These are demo credentials for testing purposes only. Do not use these credentials for production environments. Change all default passwords before deploying to production.

## 📋 Table of Contents

- [Live Demo](#live-demo)
- [Overview](#overview)
- [Architecture](#architecture)
- [User Roles & Access Control](#user-roles--access-control)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development Guide](#development-guide)
- [Deployment](#deployment)

## 🎯 Overview

DesiGuide is a full-stack travel management system that consists of multiple components:

1. **User Dashboard** ([desiguide.vercel.app](https://desiguide.vercel.app)) - A React-based customer interface for browsing destinations, booking packages, and managing trips
2. **Supporter Dashboard** ([supporterdesiguide.vercel.app](https://supporterdesiguide.vercel.app)) - A React-based portal for guides, accommodation providers, and transport providers to manage their services
3. **Admin Dashboard** ([admindesiguide.vercel.app](https://admindesiguide.vercel.app)) - A React-based admin panel for managing the entire platform
4. **Backend API** - A Node.js/Express API with SAP HANA Cloud database integration

The platform provides a complete ecosystem where travelers can discover and book tours, service providers (guides, accommodation, transport) can manage their offerings, and administrators can oversee the entire operation through intuitive interfaces.

## 🏗 Architecture

```
┌─────────────────┐
│  User Dashboard │
│   (React/Vite)  │
└────────┬────────┘
         │
         │
┌────────┴────────┐         ┌─────────────────┐         ┌─────────────────┐
│ Guide Dashboard │ ◄─────► │   Backend API   │ ◄─────► │   SAP HANA DB   │
│   (React/Vite)  │         │  (Express/TS)   │         │                 │
└────────┬────────┘         └─────────────────┘         └─────────────────┘
         │                            │
         │                            │
┌────────┴────────┐                   ▼
│ Admin Dashboard │         ┌─────────────────┐
│   (React/Vite)  │         │    Supabase     │
│  (adminappSap)  │         │  (Additional    │
└─────────────────┘         │   Services)     │
                            └─────────────────┘
```

### Key Components:

- **User Dashboard**: Customer-facing interface for browsing and booking travel packages
- **Guide Dashboard**: Guide portal for managing bookings, schedules, and client communications
- **Admin Dashboard**: Comprehensive management panel for platform administration
- **Backend API**: Express.js with TypeScript, SAP HANA Client
- **Database**: SAP HANA Cloud (primary), Supabase (additional services)
- **Authentication**: Custom auth context with role-based access control (RBAC)
- **State Management**: React Hooks with custom hooks for data fetching
- **Routing**: React Router v6 with protected routes
- **Styling**: TailwindCSS with Lucide icons
- **Maps**: Leaflet & React-Leaflet for location tracking and visualization

## � User Roles & Access Control

DesiGuide implements a robust role-based access control (RBAC) system with three distinct user roles:

### 1. **Customer/User Role**
**Access**: User Dashboard  
**Capabilities**:
- Browse destinations and packages
- View tour guide profiles
- Create and manage bookings
- Track booking status
- Manage personal profile
- View booking history
- Make payments
- Leave reviews and ratings

**Restrictions**:
- Cannot access guide or admin dashboards
- Cannot modify destination/package data
- Cannot view other users' bookings

### 2. **Supporter Roles** (Guide, Accommodation Provider, Transport Provider)
**Access**: Supporter Dashboard ([supporterdesiguide.vercel.app](https://supporterdesiguide.vercel.app))  

#### Guide Role
**Capabilities**:
- View assigned bookings
- Accept/decline booking requests
- Manage availability calendar
- Update guide profile and credentials
- View client information
- Track earnings and performance
- Communicate with clients
- Update tour status

#### Accommodation Provider Role
**Capabilities**:
- Manage property listings
- View booking requests
- Update room availability
- Set pricing and amenities
- Track reservations
- Manage property photos
- Respond to guest inquiries

#### Transport Provider Role
**Capabilities**:
- Manage vehicle fleet
- View transport bookings
- Update vehicle availability
- Set pricing and routes
- Track trip schedules
- Manage vehicle details
- Update booking status

**Restrictions** (All Supporter Roles):
- Cannot access admin dashboard
- Cannot create/edit destinations or packages
- Cannot view other providers' bookings
- Cannot modify user data

### 3. **Admin Role**
**Access**: Admin Dashboard  
**Capabilities**:
- Full CRUD operations on all entities
- User management (all roles)
- Destination management
- Package management
- Guide management
- Booking oversight
- Analytics and reporting
- SAP HANA user management
- System configuration
- Platform-wide monitoring

**Restrictions**:
- None - full system access

### Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│                    Login Request                     │
│              (email, password, role)                 │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│            Backend Authentication                    │
│        - Validate credentials                        │
│        - Check role in database                      │
│        - Generate session/token                      │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
        ▼                    ▼
┌──────────────┐   ┌───────────────────────┐
│ role='user'  │   │  role='guide'         │
│  Redirect to │   │  role='accommodation' │
│     User     │   │  role='transport'     │
│  Dashboard   │   │   Redirect to         │
└──────────────┘   │    Supporter          │
        │          │    Dashboard          │
        │          └───────────────────────┘
        │                    │
        └──────────┬─────────┘
                   │
                   ▼
         ┌──────────────────┐
         │  role='admin'    │
         │   Redirect to    │
         │     Admin        │
         │   Dashboard      │
         └──────────────────┘
```

### System Workflow

#### Customer Booking Flow
```
1. Customer browses destinations → User Dashboard
2. Selects package and views details
3. Reviews accommodation options
4. Chooses transport service
5. Chooses preferred tour guide
6. Selects dates and creates booking
7. Booking status: "pending"
8. Service providers receive notifications
9. Guide/Accommodation/Transport accept bookings
10. Booking status: "confirmed"
11. Customer makes payment
12. Booking status: "active"
13. Services are provided
14. Booking status: "completed"
15. Customer leaves reviews for all services
```

#### Supporter Management Flow (Guide/Accommodation/Transport)
```
1. Supporter logs in → Supporter Dashboard
2. Views pending booking/reservation requests
3. Reviews client details and dates
4. Accepts/declines booking
5. Updates availability calendar
6. Manages active bookings/reservations
7. Updates service status
8. Views earnings
9. Receives payment
10. Receives customer reviews
```

#### Admin Workflow
```
1. Admin logs in → Admin Dashboard
2. Monitors platform analytics
3. Manages destinations/packages
4. Oversees user accounts
5. Handles guide approvals
6. Reviews booking disputes
7. Generates reports
8. Manages system configuration
```

## �💻 Technology Stack

### Frontend (adminappSap)

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | UI Framework |
| TypeScript | ^5.5.3 | Type Safety |
| Vite | ^6.3.5 | Build Tool & Dev Server |
| React Router | ^6.22.3 | Client-side Routing |
| TailwindCSS | ^3.4.1 | Styling Framework |
| Supabase JS | ^2.39.7 | Backend Services |
| Leaflet | ^1.9.4 | Interactive Maps |
| Lucide React | ^0.344.0 | Icon Library |
| React Toastify | ^11.0.5 | Toast Notifications |
| UUID | ^9.0.1 | Unique ID Generation |

### Backend (backend)

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | >=18.0.0 | Runtime Environment |
| Express | ^4.19.2 | Web Framework |
| TypeScript | ^5.3.3 | Type Safety |
| SAP HANA Client | ^2.21.30 | Database Driver |
| Helmet | ^7.1.0 | Security Headers |
| CORS | ^2.8.5 | Cross-Origin Support |
| Express Rate Limit | ^7.5.0 | Rate Limiting |
| Bcryptjs | ^2.4.3 | Password Hashing |
| Joi | ^17.12.2 | Input Validation |
| Winston | ^3.11.0 | Logging |
| Dotenv | ^16.4.5 | Environment Config |

## 📁 Project Structure

```
DesiGuide-main/
│
├── userDashboard/                  # User/Customer Frontend Application
│   ├── src/
│   │   ├── components/            # Reusable UI Components
│   │   ├── pages/                 # User-facing Pages
│   │   │   ├── HomePage.tsx       # Landing/Browse destinations
│   │   │   ├── DestinationDetails.tsx  # Destination info
│   │   │   ├── PackageDetails.tsx      # Package details
│   │   │   ├── BookingPage.tsx         # Booking flow
│   │   │   ├── MyBookings.tsx          # User's bookings
│   │   │   └── ProfilePage.tsx         # User profile
│   │   ├── hooks/                 # Custom React Hooks
│   │   ├── lib/                   # External integrations
│   │   └── utils/                 # Utility functions
│   └── package.json
│
├── guideDashboard/                 # Supporter Dashboard (Guide/Accommodation/Transport)
│   ├── src/
│   │   ├── components/            # Supporter-specific Components
│   │   ├── pages/                 # Supporter Portal Pages
│   │   │   ├── DashboardPage.tsx      # Overview dashboard
│   │   │   ├── BookingsPage.tsx       # Manage bookings
│   │   │   ├── SchedulePage.tsx       # Calendar/availability
│   │   │   ├── ClientsPage.tsx        # Client management
│   │   │   ├── EarningsPage.tsx       # Revenue tracking
│   │   │   ├── ProfilePage.tsx        # Supporter profile
│   │   │   ├── PropertyPage.tsx       # Property management (Accommodation)
│   │   │   ├── FleetPage.tsx          # Vehicle fleet (Transport)
│   │   │   └── RoutesPage.tsx         # Route management (Transport)
│   │   ├── hooks/                 # Custom React Hooks
│   │   ├── lib/                   # External integrations
│   │   └── utils/                 # Utility functions
│   └── package.json
│
├── adminappSap/                    # Admin Frontend Application
│   ├── src/
│   │   ├── components/            # Reusable React Components
│   │   │   ├── AnalyticsErrorBoundary.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Navbar.tsx
│   │   │
│   │   ├── context/               # React Context Providers
│   │   │   └── AuthContext.tsx    # Authentication State Management
│   │   │
│   │   ├── hooks/                 # Custom React Hooks
│   │   │   ├── useAnalytics.ts    # Analytics data fetching
│   │   │   ├── useBookings.ts     # Bookings management
│   │   │   ├── useDestinationPlaces.ts  # Destination places CRUD
│   │   │   ├── useDestinations.ts  # Destinations CRUD
│   │   │   ├── useGuides.ts       # Tour guides management
│   │   │   ├── usePackages.ts     # Travel packages CRUD
│   │   │   ├── useSapUsers.ts     # SAP users integration
│   │   │   └── useUsers.ts        # User management
│   │   │
│   │   ├── lib/                   # External Service Integrations
│   │   │   └── supabase.ts        # Supabase client & type definitions
│   │   │
│   │   ├── pages/                 # Page Components
│   │   │   ├── admin/             # Admin-specific pages
│   │   │   │   ├── AddEditDestinationModal.tsx
│   │   │   │   ├── AddEditDestinationPlaceModal.tsx
│   │   │   │   ├── AddEditGuideModal.tsx
│   │   │   │   ├── AddEditPackageModal.tsx
│   │   │   │   └── GuideTrackingPage.tsx
│   │   │   ├── AdminPage.tsx      # Main admin dashboard
│   │   │   ├── AnalyticsDashboard.tsx  # Analytics & reporting
│   │   │   ├── LoginPage.tsx      # Authentication page
│   │   │   ├── NotFoundPage.tsx   # 404 error page
│   │   │   └── SapUsersPage.tsx   # SAP users management
│   │   │
│   │   ├── utils/                 # Utility Functions
│   │   │   └── testAuth.ts        # Authentication testing utilities
│   │   │
│   │   ├── App.tsx                # Main App Component
│   │   ├── main.tsx               # Application Entry Point
│   │   ├── index.css              # Global Styles
│   │   └── vite-env.d.ts          # Vite TypeScript Definitions
│   │
│   ├── eslint.config.js           # ESLint Configuration
│   ├── index.html                 # HTML Entry Point
│   ├── package.json               # Dependencies & Scripts
│   ├── postcss.config.js          # PostCSS Configuration
│   ├── tailwind.config.js         # TailwindCSS Configuration
│   ├── tsconfig.json              # TypeScript Configuration
│   ├── tsconfig.app.json          # App-specific TS Config
│   ├── tsconfig.node.json         # Node-specific TS Config
│   ├── vercel.json                # Vercel Deployment Config
│   └── vite.config.ts             # Vite Build Configuration
│
└── backend/
    └── backend/                    # Backend API Service
        ├── src/
        │   ├── config/            # Configuration Files
        │   │   ├── analyticsDatabase.ts  # Analytics DB connection
        │   │   └── database.ts    # SAP HANA connection pool
        │   │
        │   ├── controllers/       # Request Handlers
        │   │   ├── analyticsController.ts  # Analytics endpoints
        │   │   └── userController.ts       # User CRUD operations
        │   │
        │   ├── middleware/        # Express Middleware
        │   │   ├── errorHandler.ts    # Global error handling
        │   │   ├── rateLimiter.ts     # API rate limiting
        │   │   └── validation.ts      # Request validation
        │   │
        │   ├── models/            # Data Models
        │   │   └── User.ts        # User model & types
        │   │
        │   ├── routes/            # API Routes
        │   │   ├── index.ts       # Route aggregator
        │   │   └── userRoutes.ts  # User endpoints
        │   │
        │   ├── utils/             # Utility Functions
        │   │   └── logger.ts      # Winston logger setup
        │   │
        │   └── server.ts          # Express Server Entry Point
        │
        ├── package.json           # Dependencies & Scripts
        └── tsconfig.json          # TypeScript Configuration
```

## ✨ Features

### User Dashboard Features

#### 1. **Destination Discovery**
- Browse all available destinations
- Filter by category (Adventure, Cultural, Beach, Mountain, etc.)
- Search destinations by name or location
- View destination details with images and descriptions
- Explore places within each destination

#### 2. **Package Browsing**
- View all travel packages
- Filter by price, duration, rating
- Compare package features
- View detailed day-by-day itineraries
- See package pricing and availability

#### 3. **Tour Guide Selection**
- Browse available guides for destinations
- Filter by experience, languages, rating
- View guide profiles and credentials
- Compare guide pricing
- Read reviews and ratings

#### 4. **Booking Management**
- Create new bookings with package and guide selection
- Select travel dates
- View booking summary and total cost
- Track booking status (pending, confirmed, completed, cancelled)
- Manage active and past bookings
- Cancel or modify bookings

#### 5. **User Profile**
- Update personal information
- Manage account settings
- View booking history
- Save favorite destinations
- Payment method management

#### 6. **Interactive Maps**
- View destination locations on interactive maps
- Get directions and location information
- Explore nearby attractions

### Supporter Dashboard Features

The Supporter Dashboard serves three types of service providers: Guides, Accommodation Providers, and Transport Providers.

#### Guide Features

##### 1. **Booking Management**
- View all assigned bookings
- Accept or decline booking requests
- Track upcoming tours
- View client information
- Manage booking status updates

##### 2. **Schedule & Availability**
- Calendar view of bookings
- Set availability dates
- Block out unavailable dates
- View schedule conflicts
- Manage time slots

##### 3. **Client Communication**
- View client contact information
- Access booking details for each tour
- Track client history
- Send status updates

##### 4. **Earnings & Analytics**
- Track total earnings
- View booking revenue
- Monthly/yearly earnings reports
- Payment history
- Performance metrics

##### 5. **Profile Management**
- Update guide profile information
- Manage experience and credentials
- Update language skills
- Set pricing per day
- Upload profile photos
- Update destination expertise

##### 6. **Performance Tracking**
- View ratings and reviews
- Track completed tours
- Monitor customer satisfaction
- View performance trends

#### Accommodation Provider Features

##### 1. **Property Management**
- Add and manage properties
- Update room inventory
- Set room types and categories
- Upload property photos
- Manage amenities list

##### 2. **Booking Management**
- View accommodation booking requests
- Accept or decline reservations
- Track check-in/check-out dates
- Manage room availability
- Update reservation status

##### 3. **Pricing & Availability**
- Set seasonal pricing
- Manage room rates
- Update availability calendar
- Apply discounts and offers
- Dynamic pricing management

##### 4. **Guest Communication**
- View guest information
- Respond to inquiries
- Send check-in details
- Manage special requests

##### 5. **Revenue Tracking**
- Monitor booking revenue
- View occupancy rates
- Track payment history
- Generate revenue reports

#### Transport Provider Features

##### 1. **Fleet Management**
- Add and manage vehicles
- Update vehicle details
- Set vehicle types (car, bus, taxi, etc.)
- Upload vehicle photos
- Manage vehicle capacity

##### 2. **Booking Management**
- View transport booking requests
- Accept or decline bookings
- Track trip schedules
- Manage driver assignments
- Update booking status

##### 3. **Route & Pricing**
- Set available routes
- Manage pricing per route
- Update pickup/drop-off locations
- Set distance-based pricing
- Apply route-specific rates

##### 4. **Schedule Management**
- Calendar view of bookings
- Manage vehicle availability
- Track trip timings
- Avoid schedule conflicts
- Block maintenance dates

##### 5. **Earnings Dashboard**
- Track transport revenue
- View completed trips
- Monthly earnings reports
- Payment tracking
- Performance metrics

### Admin Dashboard Features

#### 1. **User Management**
- View all registered users
- Search and filter users by name and role
- Delete user accounts
- View user profiles with details (age, location, role)

#### 2. **Destination Management**
- Create, Read, Update, Delete (CRUD) destinations
- Categorize destinations (Adventure, Cultural, Beach, Mountain, etc.)
- Upload destination images
- Manage destination places within each destination
- Set opening and closing times for places

#### 3. **Package Management**
- Create and manage travel packages
- Link packages to specific destinations
- Set package pricing and duration
- Add package ratings
- Create detailed day-by-day itineraries
- Upload package images

#### 4. **Guide Management**
- Add and manage tour guides
- Track guide experience (years)
- Set guide pricing (per day)
- Manage guide language skills
- Rate guides
- Link guides to specific destinations
- Upload guide profile images

#### 5. **Booking Management**
- View all bookings
- Track booking status
- Monitor booking dates and costs
- Link bookings to users, packages, and guides

#### 6. **Analytics Dashboard**
- View platform statistics
- Monitor user growth
- Track booking trends
- Analyze revenue metrics
- Generate reports

#### 7. **SAP Users Integration**
- Manage SAP HANA database users
- View user connections and sessions
- Monitor database access

#### 8. **Guide Tracking**
- Real-time guide location tracking
- View guide availability
- Monitor active tours

### Backend API Features

#### 1. **Security**
- Helmet.js for security headers
- CORS configuration with origin whitelisting
- Rate limiting to prevent abuse
- Input validation using Joi
- SQL injection prevention
- Secure password hashing with bcryptjs

#### 2. **Database Integration**
- SAP HANA Cloud connection pooling
- Automatic reconnection on failure
- Transaction support
- Schema validation
- Prepared statements

#### 3. **Logging & Monitoring**
- Winston logger with multiple transports
- Request/response logging
- Error tracking
- Performance monitoring

#### 4. **Error Handling**
- Global error handler
- 404 not found handler
- Graceful shutdown
- Detailed error messages (development)
- Sanitized errors (production)

## 🚀 Setup Instructions

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- SAP HANA Cloud instance
- Supabase account (for additional services)

### Quick Start - All Applications

| Application | Directory | Port | Local URL | Production URL |
|-------------|-----------|------|-----------|----------------|
| User Dashboard | `userDashboard` | 5173 | http://localhost:5173 | [desiguide.vercel.app](https://desiguide.vercel.app) |
| Supporter Dashboard | `guideDashboard` | 5175 | http://localhost:5175 | [supporterdesiguide.vercel.app](https://supporterdesiguide.vercel.app) |
| Admin Dashboard | `adminappSap` | 5174 | http://localhost:5174 | [admindesiguide.vercel.app](https://admindesiguide.vercel.app) |
| Backend API | `backend/backend` | 3000 | http://localhost:3000 | Production API URL |

### User Dashboard Setup

1. **Navigate to the user dashboard directory:**
   ```bash
   cd userDashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   touch .env
   ```

4. **Configure environment variables:**
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173`

6. **Build for production:**
   ```bash
   npm run build
   ```

### Supporter Dashboard Setup (Guide/Accommodation/Transport)

1. **Navigate to the supporter dashboard directory:**
   ```bash
   cd guideDashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   touch .env
   ```

4. **Configure environment variables:**
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5175`

6. **Build for production:**
   ```bash
   npm run build
   ```

### Admin Dashboard Setup (adminappSap)

1. **Navigate to the frontend directory:**
   ```bash
   cd adminappSap
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   touch .env
   ```

4. **Configure environment variables:**
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5174`

6. **Build for production:**
   ```bash
   npm run build
   ```

7. **Preview production build:**
   ```bash
   npm run preview
   ```

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   touch .env
   ```

4. **Configure environment variables:**
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # SAP HANA Cloud Configuration
   HANA_HOST=your-hana-host.hanacloud.ondemand.com
   HANA_PORT=443
   HANA_USER=your_database_user
   HANA_PASSWORD=your_database_password
   HANA_SCHEMA=DBADMIN

   # CORS Configuration (all dashboards)
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   The API will run on `http://localhost:3000`

6. **Build for production:**
   ```bash
   npm run build
   ```

7. **Start production server:**
   ```bash
   npm start
   ```

8. **Test database connection:**
   ```bash
   npm run test-connection
   ```

9. **Seed initial users (optional):**
   ```bash
   npm run seed
   ```

## 🔐 Environment Configuration

### Frontend Environment Variables (All Dashboards)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | `http://localhost:3000/api` |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | `eyJhbGc...` |

### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |
| `HANA_HOST` | SAP HANA host URL | Yes | - |
| `HANA_PORT` | SAP HANA port | No | 443 |
| `HANA_USER` | Database username | Yes | - |
| `HANA_PASSWORD` | Database password | Yes | - |
| `HANA_SCHEMA` | Database schema | No | DBADMIN |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | No | localhost:5173,5174,5175 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | No | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No | 100 |

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected endpoints require authentication. Include the authentication token in the request headers:
```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication

##### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

##### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

##### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Health Check
```http
GET /health
GET /api/health
```
**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-03-04T10:30:00.000Z",
  "environment": "development"
}
```

#### Users

##### Get All Users
```http
GET /api/users
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "age": 30,
      "location": "New York"
    }
  ]
}
```

##### Get User by ID
```http
GET /api/users/:id
```

##### Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword123",
  "age": 28,
  "location": "Los Angeles",
  "role": "user"
}
```

##### Update User
```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Jane Smith",
  "location": "San Francisco"
}
```

##### Delete User
```http
DELETE /api/users/:id
```

#### Destinations

##### Get All Destinations
```http
GET /api/destinations
```
**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search by name

##### Get Destination by ID
```http
GET /api/destinations/:id
```

##### Create Destination (Admin only)
```http
POST /api/destinations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Kashmir Valley",
  "description": "Beautiful valley in the Himalayas",
  "category": "Mountain",
  "image_url": "https://example.com/image.jpg"
}
```

##### Update Destination (Admin only)
```http
PUT /api/destinations/:id
Authorization: Bearer <token>
```

##### Delete Destination (Admin only)
```http
DELETE /api/destinations/:id
Authorization: Bearer <token>
```

#### Destination Places

##### Get Places for Destination
```http
GET /api/destinations/:destinationId/places
```

##### Create Destination Place (Admin only)
```http
POST /api/destinations/:destinationId/places
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dal Lake",
  "description": "Famous lake in Srinagar",
  "open_time": "06:00",
  "close_time": "20:00",
  "image_url": "https://example.com/dal-lake.jpg"
}
```

#### Packages

##### Get All Packages
```http
GET /api/packages
```
**Query Parameters:**
- `destination_id` (optional): Filter by destination
- `min_price` (optional): Minimum price
- `max_price` (optional): Maximum price
- `duration` (optional): Filter by duration

##### Get Package by ID
```http
GET /api/packages/:id
```

##### Create Package (Admin only)
```http
POST /api/packages
Authorization: Bearer <token>
Content-Type: application/json

{
  "destination_id": "uuid",
  "title": "7-Day Kashmir Adventure",
  "description": "Complete Kashmir experience",
  "duration": 7,
  "price": 45000,
  "rating": 4.5,
  "main_image_url": "https://example.com/package.jpg"
}
```

##### Get Package Itinerary
```http
GET /api/packages/:id/itinerary
```

#### Guides

##### Get All Guides
```http
GET /api/guides
```
**Query Parameters:**
- `destination_id` (optional): Filter by destination
- `languages` (optional): Filter by languages
- `min_experience` (optional): Minimum experience years

##### Get Guide by ID
```http
GET /api/guides/:id
```

##### Create Guide (Admin only)
```http
POST /api/guides
Authorization: Bearer <token>
Content-Type: application/json

{
  "destination_id": "uuid",
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "experience_years": 10,
  "languages": ["Hindi", "English", "Kashmiri"],
  "price_per_day": 3000,
  "rating": 4.8,
  "image_url": "https://example.com/guide.jpg"
}
```

##### Update Guide Availability (Guide only)
```http
PUT /api/guides/:id/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "unavailable_dates": ["2026-03-15", "2026-03-16"]
}
```

#### Accommodation

##### Get All Accommodations
```http
GET /api/accommodations
```
**Query Parameters:**
- `destination_id` (optional): Filter by destination
- `type` (optional): Filter by property type (hotel, guesthouse, resort)
- `min_price` (optional): Minimum price per night
- `max_price` (optional): Maximum price per night

##### Get Accommodation by ID
```http
GET /api/accommodations/:id
```

##### Create Accommodation (Admin/Provider)
```http
POST /api/accommodations
Authorization: Bearer <token>
Content-Type: application/json

{
  "destination_id": "uuid",
  "provider_id": "uuid",
  "name": "Mountain View Hotel",
  "type": "hotel",
  "description": "Luxury hotel with mountain views",
  "price_per_night": 5000,
  "total_rooms": 25,
  "amenities": ["WiFi", "Pool", "Spa", "Restaurant"],
  "rating": 4.5,
  "image_url": "https://example.com/hotel.jpg"
}
```

##### Update Accommodation Availability
```http
PUT /api/accommodations/:id/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "unavailable_dates": ["2026-03-20", "2026-03-21"]
}
```

#### Transport

##### Get All Transport Services
```http
GET /api/transport
```
**Query Parameters:**
- `destination_id` (optional): Filter by destination
- `vehicle_type` (optional): Filter by type (car, bus, taxi, van)
- `capacity` (optional): Minimum passenger capacity

##### Get Transport Service by ID
```http
GET /api/transport/:id
```

##### Create Transport Service (Admin/Provider)
```http
POST /api/transport
Authorization: Bearer <token>
Content-Type: application/json

{
  "destination_id": "uuid",
  "provider_id": "uuid",
  "vehicle_type": "bus",
  "vehicle_name": "Luxury Coach",
  "capacity": 45,
  "price_per_km": 50,
  "features": ["AC", "WiFi", "Reclining Seats"],
  "rating": 4.3,
  "image_url": "https://example.com/bus.jpg"
}
```

##### Update Transport Availability
```http
PUT /api/transport/:id/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "unavailable_dates": ["2026-03-25", "2026-03-26"]
}
```

#### Bookings

##### Get All Bookings (Admin only)
```http
GET /api/bookings
Authorization: Bearer <token>
```

##### Get User Bookings (Authenticated user)
```http
GET /api/bookings/user/:userId
Authorization: Bearer <token>
```

##### Get Guide Bookings (Guide only)
```http
GET /api/bookings/guide/:guideId
Authorization: Bearer <token>
```

##### Create Booking (Authenticated user)
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": "uuid",
  "package_id": "uuid",
  "guide_id": "uuid",
  "start_date": "2026-04-01",
  "end_date": "2026-04-08",
  "total_cost": 52000
}
```

##### Update Booking Status
```http
PUT /api/bookings/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}
```
**Valid statuses**: `pending`, `confirmed`, `active`, `completed`, `cancelled`

##### Cancel Booking
```http
DELETE /api/bookings/:id
Authorization: Bearer <token>
```

#### Analytics (Admin only)

##### Get Dashboard Analytics
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalBookings": 342,
    "totalRevenue": 15000000,
    "activeGuides": 56,
    "topDestinations": [...],
    "recentBookings": [...]
  }
}
```

##### Get Booking Trends
```http
GET /api/analytics/bookings
Authorization: Bearer <token>
```
**Query Parameters:**
- `period`: `week`, `month`, `year`

##### Get Revenue Report
```http
GET /api/analytics/revenue
Authorization: Bearer <token>
```
**Query Parameters:**
- `start_date`: ISO date
- `end_date`: ISO date

### Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### Status Codes

- `200 OK` - Successful GET, PUT requests
- `201 Created` - Successful POST requests
- `400 Bad Request` - Validation errors
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server errors

## 🗄 Database Schema

### Supabase Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  age INTEGER,
  location TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### destinations
```sql
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### destination_places
```sql
CREATE TABLE destination_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  open_time TEXT,
  close_time TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### packages
```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  main_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### package_itinerary
```sql
CREATE TABLE package_itinerary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  no_of_days INTEGER NOT NULL,
  description TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### guides
```sql
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  experience_years INTEGER NOT NULL,
  languages TEXT[] NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  price_per_day DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### accommodations
```sql
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,  -- hotel, guesthouse, resort, etc.
  description TEXT,
  price_per_night DECIMAL(10,2) NOT NULL,
  total_rooms INTEGER NOT NULL,
  amenities TEXT[] NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### transport_services
```sql
CREATE TABLE transport_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL,  -- car, bus, taxi, van, etc.
  vehicle_name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_km DECIMAL(10,2) NOT NULL,
  features TEXT[] NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### bookings
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  guide_id UUID REFERENCES guides(id) ON DELETE SET NULL,
  accommodation_id UUID REFERENCES accommodations(id) ON DELETE SET NULL,
  transport_id UUID REFERENCES transport_services(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_cost DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### SAP HANA Schema

The backend uses SAP HANA Cloud for additional analytics and user management. The schema mirrors the Supabase structure with additional performance optimizations.

## 🛠 Development Guide

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Formatting**: Consistent indentation (2 spaces)
- **Naming Conventions**: 
  - Components: PascalCase
  - Functions/Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files: kebab-case or PascalCase for components

### Custom Hooks Pattern

All data fetching is handled through custom hooks located in `adminappSap/src/hooks/`. Each hook follows this pattern:

```typescript
export function useResource() {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch function
  const fetchData = async () => {
    // Implementation
  };

  // Create function
  const createResource = async (data: ResourceInput) => {
    // Implementation
  };

  // Update function
  const updateResource = async (id: string, data: ResourceInput) => {
    // Implementation
  };

  // Delete function
  const deleteResource = async (id: string) => {
    // Implementation
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { 
    data, 
    loading, 
    error, 
    createResource, 
    updateResource, 
    deleteResource,
    refetch: fetchData 
  };
}
```

### Adding New Features

#### 1. Adding a New Page

```bash
# Create page component
touch adminappSap/src/pages/NewPage.tsx

# Add route in App.tsx
```

#### 2. Adding a New API Endpoint

```bash
# Create route file
touch backend/backend/src/routes/newRoutes.ts

# Create controller
touch backend/backend/src/controllers/newController.ts

# Register in routes/index.ts
```

#### 3. Adding a New Custom Hook

```bash
# Create hook file
touch adminappSap/src/hooks/useNewResource.ts

# Implement using the pattern above
```

### Testing

#### Backend Testing
```bash
cd backend/backend
npm test
```

#### Connection Testing
```bash
npm run test-connection
npm run test-connection-verbose
npm run test-basic
```

### Debugging

#### Frontend Debugging
- Use React DevTools browser extension
- Enable source maps in `vite.config.ts`
- Check browser console for errors
- Use `console.log()` or debugger statements

#### Backend Debugging
- Winston logs are written to console
- Set `NODE_ENV=development` for detailed errors
- Use `logger.info()`, `logger.error()` for debugging
- Check terminal output for request logs

## 🚢 Deployment

### Dashboard Deployment

Each dashboard (User, Supporter, Admin) can be deployed independently:

#### User Dashboard
- **Production URL**: [https://desiguide.vercel.app](https://desiguide.vercel.app)
- **Recommended Port**: 5173
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment**: Production Supabase URL and API URL

#### Supporter Dashboard (Guide/Accommodation/Transport)
- **Production URL**: [https://supporterdesiguide.vercel.app](https://supporterdesiguide.vercel.app)
- **Recommended Port**: 5175
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment**: Production Supabase URL and API URL

#### Admin Dashboard (Vercel)
- **Production URL**: [https://admindesiguide.vercel.app](https://admindesiguide.vercel.app)

The project includes `vercel.json` for easy Vercel deployment:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Deployed Applications:**
- **User Dashboard**: [https://desiguide.vercel.app](https://desiguide.vercel.app)
- **Supporter Dashboard**: [https://supporterdesiguide.vercel.app](https://supporterdesiguide.vercel.app)
- **Admin Dashboard**: [https://admindesiguide.vercel.app](https://admindesiguide.vercel.app)

**Steps:**
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Production backend URL
   - `VITE_SUPABASE_URL`: Production Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Production Supabase key
4. Deploy

**Alternative platforms:**
- Netlify
- AWS Amplify
- GitHub Pages (with HashRouter)

### Backend Deployment

**Recommended platforms:**
- Heroku
- Railway
- AWS EC2/ECS
- Google Cloud Run
- Azure App Service

**Docker Deployment:**

1. Create `Dockerfile` in backend/backend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

2. Build and run:
```bash
docker build -t desiguide-backend .
docker run -p 3000:3000 --env-file .env desiguide-backend
```

### Environment Variables in Production

**Frontend (.env.production):**
```env
VITE_SUPABASE_URL=https://your-production-supabase.co
VITE_SUPABASE_ANON_KEY=your-production-key
```

**Backend (.env.production):**
```env
NODE_ENV=production
PORT=3000
HANA_HOST=production-host.hanacloud.ondemand.com
HANA_PORT=443
HANA_USER=prod_user
HANA_PASSWORD=secure_password
HANA_SCHEMA=PRODUCTION
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Security Checklist

- [ ] Enable SSL/TLS certificates (HTTPS)
- [ ] Set `sslValidateCertificate: true` in database config
- [ ] Use strong passwords for database
- [ ] Rotate API keys regularly
- [ ] Enable rate limiting in production
- [ ] Set appropriate CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable security headers with Helmet
- [ ] Implement authentication/authorization
- [ ] Regular security audits: `npm audit`
- [ ] Keep dependencies updated
- [ ] Enable logging and monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Implement backup strategy
- [ ] Configure firewall rules

## 📝 Available Scripts

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5174) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Backend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run Jest tests |
| `npm run seed` | Seed database with initial data |
| `npm run test-connection` | Test database connection |
| `npm run test-connection-verbose` | Verbose connection test |
| `npm run test-basic` | Basic connection test |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

**Desi Guide Team**

## 🙏 Acknowledgments

- SAP HANA Cloud for database services
- Supabase for backend services
- Vercel for hosting capabilities
- All open-source contributors

## 📞 Support

For support, email support@desiguide.com or open an issue in the repository.

---

**Built with ❤️ by the DesiGuide Team**
