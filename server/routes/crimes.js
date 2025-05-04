import express from 'express';
import Crime from '../models/Crime.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/crimes
// @desc    Get all crimes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const crimes = await Crime.find()
      .populate('reportedBy', 'name badgeNumber department')
      .populate('assignedTo', 'name badgeNumber department')
      .sort({ createdAt: -1 });
    
    res.json(crimes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/crimes/:id
// @desc    Get crime by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const crime = await Crime.findById(req.params.id)
      .populate('reportedBy', 'name badgeNumber department')
      .populate('assignedTo', 'name badgeNumber department');
    
    if (!crime) {
      return res.status(404).json({ message: 'Crime not found' });
    }
    
    res.json(crime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/crimes
// @desc    Create a new crime
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received request to create crime:', req.body); // Debug log
    console.log('User making request:', req.user); // Debug log
    
    const {
      title,
      description,
      type,
      location,
      severity,
      victim,
      toolUsed,
      timeOfOccurrence,
      reportedBy
    } = req.body;

    // Validate required fields
    if (!title || !description || !type || !location || !severity || !victim || !toolUsed || !timeOfOccurrence || !reportedBy) {
      console.error('Missing required fields:', { 
        title, 
        description, 
        type, 
        location, 
        severity, 
        victim, 
        toolUsed, 
        timeOfOccurrence,
        reportedBy 
      }); // Debug log
      return res.status(400).json({ 
        message: 'Missing required fields',
        missingFields: {
          title: !title,
          description: !description,
          type: !type,
          location: !location,
          severity: !severity,
          victim: !victim,
          toolUsed: !toolUsed,
          timeOfOccurrence: !timeOfOccurrence,
          reportedBy: !reportedBy
        }
      });
    }

    // Validate location structure
    if (!location.type || !location.coordinates || !location.address) {
      console.error('Invalid location structure:', location); // Debug log
      return res.status(400).json({ message: 'Invalid location structure' });
    }

    // Validate coordinates
    if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      console.error('Invalid coordinates:', location.coordinates); // Debug log
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const crime = new Crime({
      title,
      description,
      type,
      location,
      severity,
      victim,
      toolUsed,
      timeOfOccurrence: new Date(timeOfOccurrence),
      reportedBy
    });

    console.log('Saving crime to database:', crime); // Debug log
    await crime.save();
    
    // Populate the reportedBy field before sending response
    await crime.populate('reportedBy', 'name badgeNumber department');
    
    console.log('Crime saved successfully:', crime); // Debug log
    res.status(201).json(crime);
  } catch (error) {
    console.error('Error creating crime:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   PUT /api/crimes/:id
// @desc    Update a crime
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const crime = await Crime.findById(req.params.id);
    
    if (!crime) {
      return res.status(404).json({ message: 'Crime not found' });
    }

    Object.assign(crime, req.body);
    await crime.save();
    
    res.json(crime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/crimes/:id/notes
// @desc    Add a note to a crime
// @access  Private
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const crime = await Crime.findById(req.params.id);
    
    if (!crime) {
      return res.status(404).json({ message: 'Crime not found' });
    }

    crime.notes.push({
      content: req.body.content,
      addedBy: req.user.userId
    });

    await crime.save();
    
    res.json(crime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/crimes/:id/evidence
// @desc    Add evidence to a crime
// @access  Private
router.post('/:id/evidence', auth, async (req, res) => {
  try {
    const crime = await Crime.findById(req.params.id);
    
    if (!crime) {
      return res.status(404).json({ message: 'Crime not found' });
    }

    crime.evidence.push({
      ...req.body,
      uploadedAt: new Date()
    });

    await crime.save();
    
    res.json(crime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 