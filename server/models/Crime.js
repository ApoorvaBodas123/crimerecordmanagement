import mongoose from 'mongoose';

const crimeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Crime title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Crime description is required']
  },
  type: {
    type: String,
    required: [true, 'Crime type is required'],
    enum: ['theft', 'assault', 'burglary', 'vandalism', 'fraud', 'other']
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
  status: {
    type: String,
    enum: ['reported', 'under_investigation', 'resolved', 'closed'],
    default: 'reported'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: [true, 'Severity level is required']
  },
  victim: {
    name: {
      type: String,
      required: [true, 'Victim name is required']
    },
    contact: {
      type: String,
      required: [true, 'Victim contact is required']
    },
    description: {
      type: String,
      required: [true, 'Victim description is required']
    }
  },
  toolUsed: {
    type: String,
    enum: ['weapon', 'vehicle', 'tool', 'chemical', 'electronic', 'other'],
    required: [true, 'Tool used is required']
  },
  timeOfOccurrence: {
    type: Date,
    required: [true, 'Time of occurrence is required']
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporting officer is required']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  evidence: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'audio']
    },
    url: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  witnesses: [{
    name: String,
    contact: String,
    statement: String
  }],
  suspects: [{
    name: String,
    description: String,
    status: {
      type: String,
      enum: ['wanted', 'arrested', 'cleared']
    }
  }],
  notes: [{
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
crimeSchema.index({ 'location': '2dsphere' });

// Update the updatedAt field before saving
crimeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Crime = mongoose.model('Crime', crimeSchema);

export default Crime; 