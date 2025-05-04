import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter is required']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Location coordinates are required']
    },
    address: {
      type: String,
      required: [true, 'Location address is required']
    }
  },
  type: {
    type: String,
    enum: ['medical', 'crime', 'accident', 'fire', 'other'],
    required: [true, 'Emergency type is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: [true, 'Severity level is required']
  },
  status: {
    type: String,
    enum: ['active', 'responded', 'resolved', 'false_alarm'],
    default: 'active'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  responders: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['en_route', 'on_scene', 'completed'],
      default: 'en_route'
    },
    arrivalTime: Date,
    departureTime: Date
  }],
  updates: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio']
    },
    url: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for location
sosSchema.index({ 'location': '2dsphere' });

// Update the updatedAt field before saving
sosSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const SOS = mongoose.model('SOS', sosSchema);

export default SOS; 