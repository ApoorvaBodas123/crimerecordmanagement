import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: [
      'bar', 'line', 'pie', 'doughnut', 'area',
      'scatter', 'bubble', 'radar', 'polar',
      'heatmap', 'treemap', 'funnel', 'gauge'
    ],
    required: true
  },
  data: {
    source: {
      type: String,
      enum: ['case', 'crime', 'investigation', 'evidence', 'custom'],
      required: true
    },
    query: mongoose.Schema.Types.Mixed,
    aggregation: {
      type: String,
      enum: ['count', 'sum', 'average', 'min', 'max', 'custom']
    },
    groupBy: [String],
    sortBy: [String],
    filters: mongoose.Schema.Types.Mixed
  },
  options: {
    xAxis: {
      title: String,
      type: {
        type: String,
        enum: ['category', 'time', 'value']
      },
      format: String
    },
    yAxis: {
      title: String,
      type: {
        type: String,
        enum: ['value', 'category', 'time']
      },
      format: String
    },
    legend: {
      position: {
        type: String,
        enum: ['top', 'right', 'bottom', 'left', 'none']
      },
      display: Boolean
    },
    tooltip: {
      enabled: Boolean,
      format: String
    },
    colors: [String],
    animation: {
      enabled: Boolean,
      duration: Number
    },
    responsive: Boolean,
    maintainAspectRatio: Boolean
  },
  metadata: {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    tags: [String],
    version: {
      type: String,
      default: '1.0.0'
    }
  },
  access: {
    public: {
      type: Boolean,
      default: false
    },
    allowedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    allowedRoles: [String]
  },
  refreshInterval: {
    type: Number,
    default: 300 // seconds
  },
  lastRefreshed: Date,
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
chartSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Chart = mongoose.model('Chart', chartSchema);

export default Chart; 