import mongoose from 'mongoose';

const investigationSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  leadInvestigator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamMembers: [{
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    startDate: Date,
    endDate: Date
  }],
  status: {
    type: String,
    enum: ['active', 'suspended', 'closed', 'solved'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  objectives: [{
    description: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    deadline: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  leads: [{
    description: String,
    source: String,
    status: {
      type: String,
      enum: ['new', 'investigating', 'verified', 'dismissed'],
      default: 'new'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  evidence: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  }],
  suspects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Suspect'
  }],
  witnesses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Witness'
  }],
  activities: [{
    type: {
      type: String,
      enum: ['interview', 'search', 'surveillance', 'analysis', 'other']
    },
    description: String,
    date: Date,
    location: String,
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    outcome: String
  }],
  reports: [{
    title: String,
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
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

// Update the updatedAt field before saving
investigationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Investigation = mongoose.model('Investigation', investigationSchema);

export default Investigation; 