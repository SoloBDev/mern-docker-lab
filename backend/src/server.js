const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const ensureDefaultUser = require('./seed/ensureDefaultUser');
const ApiError = require('./utils/ApiError');

const app = express();

// Connect to MongoDB
connectDB().then(() => {
    // Seed data after successful connection
    ensureDefaultUser();
});

// Middleware
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files (index.html, style.css, app.js)
app.use(express.static(path.join(__dirname, '../../frontend')));

// API routes
app.use('/', userRoutes);

// 404 Handler
app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found'));
});

// Global Error Handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});