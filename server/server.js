const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./utils/seedData');

// Load environment variables
dotenv.config();
console.log(
  "MongoDB host:",
  process.env.MONGODB_URI
    ? process.env.MONGODB_URI.replace(/\/\/.*?:.*?@/, "//***:***@")
    : "NOT SET"
);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/camps', require('./routes/campRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Community Health Camp API Server is active' });
});

// Default 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ServerError]', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Initialize Database connection, seed data, and start server
connectDB().then(async () => {
  await seedData();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Community Health Camp Backend Server Running`);
    console.log(` Port: ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Demo Admin: admin / admin123`);
    console.log(` Demo User: user@healthcamp.com / user123`);
    console.log(`====================================================`);
  });
});
