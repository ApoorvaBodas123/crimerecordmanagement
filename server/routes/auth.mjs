import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.mjs';
import { auth } from '../middleware/auth.mjs';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user route (protected)
router.get('/me', auth, getCurrentUser);

export default router; 