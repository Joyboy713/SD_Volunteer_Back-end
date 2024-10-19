import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './notifications.js';
import volunteerHistoryRoutes from './routes/volunteerHistory.js'; 
import eventRoutes from './routes/eventRoutes.js';
import volunteerMatchRoutes from './routes/volunteerMatch.js';

dotenv.config(); // Load environment variables

// Get the port and MongoDB URI from environment variables
const port = process.env.PORT || 5000; // Use PORT from .env, default to 5000 if not set
const mongoUri = process.env.MONGO_URI;

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Fixed the trailing slash here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Remove hardcoded events

// Event Routes
app.use('/api/events', eventRoutes); 

// Notification Routes
app.use('/api/notifications', notificationRoutes);

// Volunteer History Routes
app.use('/api/volunteerHistory', volunteerHistoryRoutes);

// User Routes
app.use('/api/users', userRoutes);

// Volunteer Match
app.use('/api/volunteerMatch', volunteerMatchRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 
