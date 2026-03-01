# Startup Support Portal (LaunchPad)

A two-sided marketplace where startups create profiles and supporters (investors, technical experts) discover and connect with them.

## Tech Stack

| Part     | Technology                                                 |
| -------- | ---------------------------------------------------------- |
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS, Socket.io |
| Backend  | Node.js, Express 4, MongoDB (Mongoose 8), Socket.io        |
| Auth     | JWT (httpOnly cookies)                                     |
| Uploads  | Multer (local disk storage)                                |

## Getting Started

### Prerequisites

- **Node.js 18+** – [nodejs.org](https://nodejs.org)
- **MongoDB** – Local install or [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Backend

```bash
cd backend
npm install
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev
```

Server starts on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App starts on `http://localhost:3000`.

### Environment Variables

**`backend/.env`**

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/startup-portal
JWT_SECRET=your_super_secret_key_change_this
CLIENT_URL=http://localhost:3000
```

**`frontend/.env.local`**

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Features

- **Auth** – Register / Login with JWT, roles: `startup`, `supporter`, `admin`
- **Startup Profiles** – Company info, pitch, funding needs, tech requirements
- **Supporter Profiles** – Bio, investment range, expertise areas
- **Browse & Filter** – Search startups by name, location, funding, tech help
- **Connections** – Supporters express interest; startups accept/reject
- **Real-time Chat** – Socket.io messaging with typing indicators & read receipts
- **Admin Panel** – Manage users and toggle listings

## Project Structure

```
backend/          # Express API server
  config/         # DB & Socket.io setup
  models/         # Mongoose schemas
  controllers/    # Business logic
  routes/         # API routes
  middleware/     # Auth, role, upload
  uploads/        # Uploaded files

frontend/         # Next.js app
  src/app/        # Pages (App Router)
  src/components/ # Shared UI components
  src/context/    # Auth context
  src/lib/        # API & Socket clients
```

## API Endpoints

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| POST   | `/api/auth/register`          | Register user            |
| POST   | `/api/auth/login`             | Login                    |
| POST   | `/api/auth/logout`            | Logout                   |
| GET    | `/api/auth/me`                | Current user + profile   |
| GET    | `/api/startups`               | List/filter startups     |
| GET    | `/api/startups/:id`           | Startup detail           |
| POST   | `/api/startups`               | Create startup profile   |
| PUT    | `/api/startups/:id`           | Update startup profile   |
| GET    | `/api/supporters`             | List supporters          |
| POST   | `/api/supporters`             | Create supporter profile |
| POST   | `/api/connections`            | Express interest         |
| GET    | `/api/connections`            | List connections         |
| PUT    | `/api/connections/:id`        | Accept/reject            |
| GET    | `/api/messages/:connectionId` | Get messages             |
| POST   | `/api/messages/:connectionId` | Send message             |
| GET    | `/api/admin/users`            | Admin: list users        |
| PUT    | `/api/admin/users/:id`        | Admin: update user       |
