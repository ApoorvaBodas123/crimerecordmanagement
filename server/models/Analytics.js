import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'user_activity', 'case_metrics', 'crime_stats',
      'investigation_performance', 'system_performance',
      'report_usage', 'evidence_tracking'
    ]
  },
  period: {
    start: Date,
    end: Date
  },
  metrics: {
    activeUsers: Number,
    newCases: Number,
    solvedCases: Number,
    pendingCases: Number,
    crimeTypes: {
      type: Map,
      of: Number
    },
    investigationTime: {
      average: Number,
      min: Number,
      max: Number
    },
    evidenceProcessed: Number,
    reportsGenerated: Number,
    systemUptime: Number,
    responseTime: {
      average: Number,
      min: Number,
      max: Number
    }
  },
  breakdown: [{
    category: String,
    value: Number,
    percentage: Number
  }],
  trends: [{
    date: Date,
    value: Number
  }],
  alerts: [{
    type: String,
    message: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    timestamp: Date
  }],
  recommendations: [{
    type: String,
    description: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics; 