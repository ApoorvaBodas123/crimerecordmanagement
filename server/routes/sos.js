import express from 'express';
import SOS from '../models/SOS.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/sos
// @desc    Get all SOS alerts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const alerts = await SOS.find(query)
      .populate('reporter', 'name badgeNumber department')
      .populate('assignedTo', 'name badgeNumber department')
      .populate('responders.user', 'name badgeNumber department')
      .populate('updates.addedBy', 'name badgeNumber')
      .sort({ createdAt: -1 });
    
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sos/:id
// @desc    Get SOS alert by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const alert = await SOS.findById(req.params.id)
      .populate('reporter', 'name badgeNumber department')
      .populate('assignedTo', 'name badgeNumber department')
      .populate('responders.user', 'name badgeNumber department')
      .populate('updates.addedBy', 'name badgeNumber');
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sos
// @desc    Create a new SOS alert
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const alert = new SOS({
      ...req.body,
      reporter: req.user.userId
    });

    await alert.save();
    
    res.status(201).json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/sos/:id
// @desc    Update an SOS alert
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const alert = await SOS.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    Object.assign(alert, req.body);
    await alert.save();
    
    res.json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sos/:id/updates
// @desc    Add an update to an SOS alert
// @access  Private
router.post('/:id/updates', auth, async (req, res) => {
  try {
    const alert = await SOS.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.updates.push({
      content: req.body.content,
      addedBy: req.user.userId
    });

    await alert.save();
    
    res.json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sos/:id/responders
// @desc    Add a responder to an SOS alert
// @access  Private
router.post('/:id/responders', auth, async (req, res) => {
  try {
    const alert = await SOS.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.responders.push({
      user: req.user.userId,
      status: 'en_route'
    });

    await alert.save();
    
    res.json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/sos/:id/responders/:responderId
// @desc    Update responder status
// @access  Private
router.put('/:id/responders/:responderId', auth, async (req, res) => {
  try {
    const alert = await SOS.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    const responder = alert.responders.id(req.params.responderId);
    if (!responder) {
      return res.status(404).json({ message: 'Responder not found' });
    }

    Object.assign(responder, req.body);
    await alert.save();
    
    res.json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 