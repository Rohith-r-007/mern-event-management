# Gatherly/Eventora

Gatherly is a full-stack Event Management platform that allows users to discover events, book tickets, and manage bookings through OTP verification.

## Features

### User Features

- User Registration & Login
- JWT Authentication
- View Available Events
- Book Event Tickets
- Email OTP Verification
- View Booking History
- Profile Management

### Admin Features

- Create Events
- Update Events
- Delete Events
- Manage Event Details

### Security Features

- Password Hashing using bcrypt
- JWT Authentication
- Protected Routes
- Environment Variable Configuration
- OTP Verification for Bookings

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Deployment

- Docker
- Docker Compose
- MongoDB Atlas
- Render
- Resend

---

## Project Structure

```
event-management/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── docker-compose.yml
└── README.md
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

# Use this for sending emails through gmail
EMAIL_USER=your_email_address

# Get app password from google account settings
EMAIL_PASS=your_email_app_password

FRONTEND_URL=your_frontend_url
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Rohith-r-007/mern-event-management.git

cd mern-event-management
```

### Backend Setup

```bash
cd backend

npm install
```

### Frontend Setup

```bash
cd frontend

npm install
```

---

## Running Locally

### Start Backend

```bash
cd backend

npm run dev
```

### Start Frontend

```bash
cd frontend

npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```

---

## Running with Docker

### Build Containers

```bash
docker compose build
```

### Start Containers

```bash
docker compose up -d
```

### View Logs

```bash
docker compose logs -f
```

### Stop Containers

```bash
docker compose down
```

---

## Live Deployment

Frontend:

https://your-frontend.onrender.com

Backend:

https://your-backend.onrender.com


## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Events

```http
GET    /api/events
GET    /api/events/:id
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

### Bookings

```http
POST /api/bookings/create
POST /api/bookings/verify-otp
GET  /api/bookings/user
```

---

## Future Improvements

- Payment Gateway Integration
- Event Categories
- Cleaner Admin Dashboard
- Analytics
- Email Templates
- QR Code Tickets

---

## Author

Rohith R

Built as a full-stack MERN project using Docker and MongoDB.