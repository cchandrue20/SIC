# 🚀 LaunchPad - Startup Support Portal

A two-sided marketplace where startups create profiles and supporters (investors, technical experts) discover and connect with them. LaunchPad facilitates meaningful connections through real-time communication and detailed profile management.

---

## ✨ Features

- **🔐 Multi-Role Authentication** – Secure Register / Login with JWT, supporting roles: `startup`, `supporter`, and `admin`.
- **🚀 Startup Profiles** – Show company information, pitches, funding needs, and technical requirements.
- **🤝 Supporter Profiles** – Highlight expertise, bio, and investment interests.
- **🔍 Advanced Search** – Browse and filter startups by name, location, funding stage, and technical needs.
- **⚡ Real-time Connections** – Connect with startups and manage requests (accept/reject) instantly.
- **💬 Live Chat** – Real-time messaging powered by Socket.io, featuring typing indicators and read receipts.
- **🛡️ Admin Dashboard** – Comprehensive user management and listing control.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS, Socket.io-client |
| **Backend** | Node.js, Express 4, MongoDB (Mongoose 8), Socket.io |
| **Auth** | JWT (Stored in httpOnly cookies for security) |
| **Storage** | Multer (Local disk storage for uploads) |

---

## 📦 Getting Started

### 📋 Prerequisites

- **Node.js 18+** – [Download here](https://nodejs.org)
- **MongoDB** – A local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

### 🔌 1. Backend Setup

```bash
cd backend
npm install
# Configure .env with MONGO_URI and JWT_SECRET
npm run dev
```
The server will start at `http://localhost:5000`.

### 💻 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

### 🌱 3. Database Seeding (Optional)

To quickly populate the database with test data:

```bash
cd backend
node seed-startups.js  # Seeds 15 sample startups
node seed-admin.js     # Seeds a default administrator
```
*Check `STARTUP_SETUP_GUIDE.md` for pre-configured login credentials.*

---

## 🔐 Environment Variables

Ensure you have the following `.env` files configured:

### **`backend/.env`**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/startup-portal
JWT_SECRET=your_secure_secret_key
CLIENT_URL=http://localhost:3000
```

### **`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 📂 Project Structure

```text
SIC/
├── backend/            # Express.js API Server
│   ├── config/         # Database & Socket.io configurations
│   ├── controllers/    # Core business logic
│   ├── middleware/     # Auth, role-based access, & file uploads
│   ├── models/         # Mongoose (MongoDB) schemas
│   ├── routes/         # API route definitions
│   └── uploads/        # Local storage for user-uploaded files
└── frontend/           # Next.js Application
    ├── src/app/        # Pages and layouts (App Router)
    ├── src/components/ # Reusable UI components
    ├── src/context/    # Global state (Auth, etc.)
    └── src/lib/        # API clients & Socket.io-client logic
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/logout` | User logout |
| `GET` | `/api/auth/me` | Get current user's profile |
| `GET` | `/api/startups` | List & filter startup profiles |
| `GET` | `/api/startups/:id` | Get detailed startup profile |
| `POST` | `/api/startups` | Create a startup profile |
| `PUT` | `/api/startups/:id` | Update a startup profile |
| `GET` | `/api/supporters` | List supporter profiles |
| `POST` | `/api/supporters` | Create a supporter profile |
| `POST` | `/api/connections` | Express interest in a startup |
| `GET` | `/api/connections` | List active connections |
| `PUT` | `/api/connections/:id` | Update connection status (Accept/Reject) |
| `GET` | `/api/messages/:id` | Retrieve message history |
| `POST` | `/api/messages/:id` | Send a new message |
| `GET` | `/api/admin/users` | Admin: List all registered users |
| `PUT` | `/api/admin/users/:id` | Admin: Update user status/details |
