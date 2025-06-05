const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('./config/passport'); // ⬅️ Import Passport config
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://frontend-eta-eight-54.vercel.app', // or '*' for dev
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.options('*', cors());
app.use(passport.initialize()); // ⬅️ Initialize passport

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(error => console.error("MongoDB connection error:", error));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const paymentRoutes = require('./routes/payments');
const googleAuthRoutes = require('./routes/googleAuth'); // ⬅️ Google auth route

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use(googleAuthRoutes); // ⬅️ Google auth entry point

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
