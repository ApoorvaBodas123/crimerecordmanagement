import User from '../models/User.js';
import { handleError } from '../utils/errorHandler.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -__v')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    handleError(res, error);
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    handleError(res, error);
  }
}; 