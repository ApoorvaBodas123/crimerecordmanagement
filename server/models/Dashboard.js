import mongoose from 'mongoose';

const dashboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  layout: {
    type: String,
    enum: ['grid', 'list', 'custom'],
    default: 'grid'
  },
  widgets: [{
    type: {
      type: String,
      enum: [
        'case_stats', 'crime_stats', 'investigation_stats',
        'evidence_stats', 'recent_activities', 'tasks',
        'notifications', 'calendar', 'map', 'chart',
        'report', 'custom'
      ],
      required: true
    },
    title: String,
    position: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    },
    settings: mongoose.Schema.Types.Mixed,
    data: mongoose.Schema.Types.Mixed
  }],
  filters: {
    dateRange: {
      start: Date,
      end: Date
    },
    caseTypes: [String],
    crimeTypes: [String],
    status: [String],
    priority: [String],
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }],
  theme: {
    primaryColor: String,
    secondaryColor: String,
    darkMode: Boolean
  },
  refreshInterval: {
    type: Number,
    default: 300 // seconds
  },
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
dashboardSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

export default Dashboard; 