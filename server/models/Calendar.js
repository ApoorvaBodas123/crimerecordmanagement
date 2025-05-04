import mongoose from 'mongoose';

const calendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: [
      'court_hearing', 'investigation', 'meeting',
      'task', 'reminder', 'holiday', 'other'
    ],
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  location: {
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  relatedTo: {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case'
    },
    investigation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investigation'
    },
    crime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crime'
    },
    courtCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourtCase'
    }
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'tentative'],
      default: 'pending'
    }
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push', 'popup']
    },
    time: Number, // minutes before event
    sent: {
      type: Boolean,
      default: false
    }
  }],
  recurrence: {
    frequency: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly']
    },
    interval: Number,
    daysOfWeek: [Number],
    endDate: Date,
    exceptions: [Date]
  },
  attachments: [{
    type: {
      type: String,
      enum: ['document', 'image', 'video', 'audio']
    },
    url: String,
    description: String
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
  tags: [String],
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
calendarSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Calendar = mongoose.model('Calendar', calendarSchema);

export default Calendar; 