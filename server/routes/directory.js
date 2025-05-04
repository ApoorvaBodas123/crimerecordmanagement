import express from 'express';
import Directory from '../models/Directory.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/directory
// @desc    Get all directory entries
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    
    const entries = await Directory.find(query)
      .populate('officerDetails.station', 'name stationDetails')
      .sort({ name: 1 });
    
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/directory/:id
// @desc    Get directory entry by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await Directory.findById(req.params.id)
      .populate('officerDetails.station', 'name stationDetails');
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/directory
// @desc    Create a new directory entry
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const entry = new Directory(req.body);
    await entry.save();
    
    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/directory/:id
// @desc    Update a directory entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const entry = await Directory.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    Object.assign(entry, req.body);
    await entry.save();
    
    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/directory/nearby
// @desc    Get nearby police stations
// @access  Private
router.get('/nearby', auth, async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const stations = await Directory.find({
      type: 'station',
      'stationDetails.address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.json(stations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 