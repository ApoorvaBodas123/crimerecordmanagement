import express from 'express';
import { 
  getOfficers, 
  getOfficerById, 
  createOfficer, 
  updateOfficer, 
  deleteOfficer 
} from '../controllers/officerController.mjs';
import { authenticate } from '../middleware/auth.mjs';

const router = express.Router();

// Public routes
router.get('/', getOfficers);
router.get('/:id', getOfficerById);

// Protected routes
router.post('/', authenticate, createOfficer);
router.put('/:id', authenticate, updateOfficer);
router.delete('/:id', authenticate, deleteOfficer);

export default router; 