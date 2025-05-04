import Officer from '../models/Officer.mjs';
import { handleError } from '../utils/errorHandler.mjs';

export const getOfficers = async (req, res) => {
  try {
    const officers = await Officer.find().select('-__v');
    res.json(officers);
  } catch (error) {
    handleError(res, error);
  }
};

export const getOfficerById = async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.id).select('-__v');
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    res.json(officer);
  } catch (error) {
    handleError(res, error);
  }
};

export const createOfficer = async (req, res) => {
  try {
    const officer = new Officer(req.body);
    await officer.save();
    res.status(201).json(officer);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateOfficer = async (req, res) => {
  try {
    const officer = await Officer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-__v');
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    res.json(officer);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteOfficer = async (req, res) => {
  try {
    const officer = await Officer.findByIdAndDelete(req.params.id);
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    res.json({ message: 'Officer deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
}; 