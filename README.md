# 🚀 LaunchPad - Startup Support Portal

A two-sided marketplace where startups create profiles and supporters (investors, technical experts) discover and connect with them. LaunchPad facilitates meaningful connections through real-time communication, detailed profile management, and investment tracking.

---

## ✨ Features

- **🔐 Multi-Role Authentication** – Secure Register / Login with JWT, supporting roles: `startup`, `supporter`, and `admin`.
- **🚀 Startup Profiles** – Showcase company info, pitches, funding needs, and technical requirements.
- **🤝 Supporter Profiles** – Highlight expertise, bio, and investment interests.
- **🔍 Advanced Search** – Browse and filter startups by name, location, funding stage, and tags.
- **⚡ Real-time Connections** – Connect with startups and manage requests (accept/reject) instantly.
- **💬 Live Chat** – Real-time messaging powered by Socket.io with typing indicators.
- **💰 Investment & Funding Tracker** – Expense plan management and funding progress for startups.
- **⭐ Reviews** – Supporters can leave reviews on startup profiles.
- **🔖 Saved Startups** – Supporters can bookmark startups to a personal wishlist.
- **🔔 Notifications** – In-app notifications for connections and messages.
- **🛡️ Admin Dashboard** – Comprehensive user management and listing control.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS, Socket.io-client |
| **Backend** | Node.js, Express 4, MongoDB (Mongoose 8), Socket.io |
| **Auth** | JWT (stored in httpOnly cookies) |
| **Storage** | Multer (local disk storage for uploads) |

---

## 📦 Getting Started

### 📋 Prerequisites

- **Node.js 18+** – [Download here](https://nodejs.org)
- **MongoDB** – A local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

### 🔌 1. Backend Setup

```bash
cd backend
npm install
# Configure .env (see Environment Variables below)
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

Quickly populate the database with test data:

```bash
cd backend
node seed-startups.js   # Seeds 15 sample startups
node seed-admin.js      # Seeds a default admin account
```

---

## 🔐 Environment Variables

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
├── backend/                  # Express.js API Server
│   ├── config/               # DB & Socket.io configuration
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth, role-based access & file uploads
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   ├── utils/                # Email service & helpers
│   ├── seed-admin.js         # Admin seeder script
│   ├── seed-startups.js      # Startup seeder script
│   └── uploads/              # User-uploaded files
└── frontend/                 # Next.js Application
    └── src/
        ├── app/              # Pages & layouts (App Router)
        ├── components/       # Reusable UI components
        ├── context/          # Global state (Auth)
        └── lib/              # API client & Socket.io logic
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
| `GET` | `/api/reviews/:targetId` | Get reviews for a user |
| `POST` | `/api/reviews` | Submit a review |
| `GET` | `/api/saved` | Get saved startups (wishlist) |
| `POST` | `/api/saved/:startupId` | Save a startup |
| `DELETE` | `/api/saved/:startupId` | Remove from wishlist |
| `GET` | `/api/notifications` | Get notifications |
| `PUT` | `/api/notifications/:id` | Mark notification as read |
| `GET` | `/api/startups/:id/expense-plan` | Get startup's expense plan |
| `POST` | `/api/startups/:id/expense-plan` | Create/update expense plan |
| `GET` | `/api/startups/:id/funding-progress` | Get funding progress stats |
| `GET` | `/api/admin/users` | Admin: List all users |
| `PUT` | `/api/admin/users/:id` | Admin: Update user status |
