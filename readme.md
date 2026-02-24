# Uber Clone - Full Stack Project

A comprehensive full-stack ride-sharing application built with React, Node.js, Express, and MongoDB. This project implements core Uber-like features including user and captain authentication, ride creation, real-time tracking, and live location updates.

## 📋 Table of Contents

- Project Overview
- Tech Stack
- Features
- Project Structure
- Installation
- Environment Variables
- Running the Application
- API Documentation
- Socket Events
- Database Models
- Contributing

## 🎯 Project Overview

This is a full-stack ride-sharing platform that allows users to book rides and captains to accept and complete rides. The application features real-time location tracking, dynamic fare calculation, and WebSocket-based live communication between users and captains.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.3
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time Communication**: Socket.IO Client
- **Animations**: GSAP (GreenSock)
- **Maps**: Google Maps API
- **Icons**: Remix Icon

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Password Hashing**: Bcrypt
- **Validation**: Express Validator
- **External APIs**: Google Maps API

## ✨ Features

### User Features
- User registration and login with JWT authentication
- Browse available vehicles (Auto, Car, Moto)
- Real-time fare estimation based on distance and vehicle type
- Request rides with pickup and destination
- Real-time location tracking during rides
- View captain details and vehicle information
- Make payments after ride completion
- User logout with token blacklisting

### Captain Features
- Captain registration with vehicle information
- Login and profile management
- Real-time location updates
- Accept/reject ride requests
- OTP verification for ride start
- Live ride tracking
- Complete rides and earn money
- Captain logout with token blacklisting

### System Features
- Real-time communication using WebSocket
- Location-based captain discovery (2km radius)
- Dynamic fare calculation based on distance and duration
- Google Maps integration for location services
- Token blacklisting on logout
- Protected routes with authentication middleware

## 📁 Project Structure

```
uber-clone/
├── frontend/                    # React application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React context providers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── Backend/                     # Express server
    ├── controllers/            # Request handlers
    ├── models/                 # MongoDB schemas
    ├── routes/                 # API routes
    ├── services/               # Business logic
    ├── middlewares/            # Auth & validation
    ├── db/                     # Database connection
    ├── app.js                  # Express app
    ├── server.js               # Server entry point
    ├── socket.js               # WebSocket configuration
    └── package.json
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Maps API Key

### Backend Setup

```bash
cd Backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=3000
DB_CONNECT=mongodb://localhost:27017/uber-clone
JWT_SECRET=your_jwt_secret_key
GOOGLE_MAPS_API=your_google_maps_api_key
```

### Frontend (.env.local)

```env
VITE_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## ▶️ Running the Application

### Backend

```bash
cd Backend
npm start
# Server runs on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

## 📚 API Documentation

### User Endpoints

#### Register User
```
POST /users/register
Body: {
  "fullname": { "firstname": "string", "lastname": "string" },
  "email": "string",
  "password": "string"
}
```

#### Login User
```
POST /users/login
Body: {
  "email": "string",
  "password": "string"
}
```

#### Get User Profile
```
GET /users/profile
Headers: Authorization: Bearer <token>
```

#### Logout User
```
GET /users/logout
Headers: Authorization: Bearer <token>
```

### Captain Endpoints

#### Register Captain
```
POST /captains/register
Body: {
  "fullname": { "firstname": "string", "lastname": "string" },
  "email": "string",
  "password": "string",
  "vehicle": {
    "color": "string",
    "plate": "string",
    "capacity": "number",
    "vehicleType": "car|motorcycle|auto"
  }
}
```

#### Login Captain
```
POST /captains/login
Body: {
  "email": "string",
  "password": "string"
}
```

#### Get Captain Profile
```
GET /captains/profile
Headers: Authorization: Bearer <token>
```

### Maps Endpoints

#### Get Suggestions
```
GET /maps/get-suggestions?input=<location>
Headers: Authorization: Bearer <token>
```

#### Get Coordinates
```
GET /maps/get-coordinates?address=<address>
Headers: Authorization: Bearer <token>
```

#### Get Distance & Time
```
GET /maps/get-distance-time?origin=<origin>&destination=<destination>
Headers: Authorization: Bearer <token>
```

### Ride Endpoints

#### Create Ride
```
POST /rides/create
Headers: Authorization: Bearer <token>
Body: {
  "pickup": "string",
  "destination": "string",
  "vehicleType": "auto|car|moto"
}
```

#### Get Fare
```
GET /rides/get-fare?pickup=<pickup>&destination=<destination>
Headers: Authorization: Bearer <token>
```

#### Confirm Ride
```
POST /rides/confirm
Headers: Authorization: Bearer <token>
Body: {
  "rideId": "string"
}
```

#### Start Ride
```
GET /rides/start-ride?rideId=<id>&otp=<otp>
Headers: Authorization: Bearer <token>
```

#### End Ride
```
POST /rides/end-ride
Headers: Authorization: Bearer <token>
Body: {
  "rideId": "string"
}
```

## 🔌 Socket Events

### Client to Server
- `join` - Join socket room with user type and ID
- `update-location-captain` - Send captain's current location

### Server to Client
- `new-ride` - Notify captain of new ride request
- `ride-confirmed` - Notify user that ride is confirmed
- `ride-started` - Notify user that ride has started
- `ride-ended` - Notify user that ride has ended

## 🗂 Database Models

### User Model
```javascript
{
  fullname: { firstname: String, lastname: String },
  email: String (unique),
  password: String (hashed),
  socketId: String
}
```

### Captain Model
```javascript
{
  fullname: { firstname: String, lastname: String },
  email: String (unique),
  password: String (hashed),
  vehicle: {
    color: String,
    plate: String,
    capacity: Number,
    vehicleType: String
  },
  location: { ltd: Number, lng: Number },
  status: String (active|inactive),
  socketId: String
}
```

### Ride Model
```javascript
{
  user: ObjectId (ref: User),
  captain: ObjectId (ref: Captain),
  pickup: String,
  destination: String,
  fare: Number,
  status: String (pending|accepted|ongoing|completed|cancelled),
  duration: Number,
  distance: Number,
  otp: String
}
```

## 📝 License

This project is open source and available under the MIT License.

---

**Note**: Make sure to replace API keys and environment variables with your actual values before deployment.
