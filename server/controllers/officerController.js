import Officer from '../models/Officer.js';

// Get all officers
export const getOfficers = async (req, res) => {
  try {
    const officers = await Officer.find();
    res.json(officers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get officer by ID
export const getOfficerById = async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.id);
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    res.json(officer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new officer
export const createOfficer = async (req, res) => {
  try {
    const officer = new Officer(req.body);
    const savedOfficer = await officer.save();
    res.status(201).json(savedOfficer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update officer
export const updateOfficer = async (req, res) => {
  try {
    const officer = await Officer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    res.json(officer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete officer
export const deleteOfficer = async (req, res) => {
  try {
    const officer = await Officer.findByIdAndDelete(req.params.id);
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    res.json({ message: 'Officer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 