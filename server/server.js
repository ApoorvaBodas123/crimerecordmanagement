import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import crimeRoutes from './routes/crimes.js';
import officerRoutes from './routes/officerRoutes.js';
import sosRoutes from './routes/sos.js';
import contactRoutes from './routes/contact.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/crimes', crimeRoutes);
app.use('/api/officers', officerRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Civic Eye Guardian System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code
  });
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field error',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});