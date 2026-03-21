const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// --------------- Socket.io ---------------
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});
require('./config/socket')(io);


// --------------- Middleware ---------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------- Routes ---------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/startups', require('./routes/startups'));
app.use('/api/supporters', require('./routes/supporters'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/saved', require('./routes/saved'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/test', require('./routes/test'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MongoDB connection check
app.get('/api/db-check', (req, res) => {
  const mongoose = require('mongoose');
  const mongooseState = mongoose.connection.readyState;
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    mongodb: states[mongooseState],
    connected: mongooseState === 1,
    timestamp: new Date().toISOString(),
    readyState: mongooseState
  });
});

// --------------- Start ---------------
connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
