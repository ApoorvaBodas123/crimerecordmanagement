import express from 'express';
import { 
  getOfficers, 
  getOfficerById, 
  createOfficer, 
  updateOfficer, 
  deleteOfficer 
} from '../controllers/officerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getOfficers);
router.get('/:id', getOfficerById);

// Protected routes
router.post('/', auth, createOfficer);
router.put('/:id', auth, updateOfficer);
router.delete('/:id', auth, deleteOfficer);

export default router; 