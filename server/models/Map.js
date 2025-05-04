import mongoose from 'mongoose';

const mapSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: [
      'crime_heatmap', 'patrol_route', 'incident_map',
      'resource_distribution', 'custom'
    ],
    required: true
  },
  center: {
    type: [Number], // [longitude, latitude]
    required: true,
    index: '2dsphere'
  },
  zoom: {
    type: Number,
    default: 12
  },
  layers: [{
    name: String,
    type: {
      type: String,
      enum: ['marker', 'polygon', 'polyline', 'heatmap', 'cluster']
    },
    data: [{
      type: {
        type: String,
        enum: ['case', 'crime', 'incident', 'resource', 'custom']
      },
      location: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      },
      properties: mongoose.Schema.Types.Mixed,
      style: mongoose.Schema.Types.Mixed
    }],
    visible: {
      type: Boolean,
      default: true
    },
    opacity: {
      type: Number,
      min: 0,
      max: 1,
      default: 1
    }
  }],
  filters: {
    dateRange: {
      start: Date,
      end: Date
    },
    caseTypes: [String],
    crimeTypes: [String],
    status: [String],
    priority: [String]
  },
  markers: [{
    type: {
      type: String,
      enum: ['case', 'crime', 'incident', 'resource', 'custom']
    },
    location: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    title: String,
    description: String,
    icon: String,
    color: String,
    properties: mongoose.Schema.Types.Mixed
  }],
  polygons: [{
    type: {
      type: String,
      enum: ['zone', 'area', 'route', 'custom']
    },
    coordinates: [[[Number]]], // Array of [longitude, latitude] pairs
    title: String,
    description: String,
    color: String,
    fillColor: String,
    properties: mongoose.Schema.Types.Mixed
  }],
  polylines: [{
    type: {
      type: String,
      enum: ['route', 'boundary', 'custom']
    },
    coordinates: [[Number]], // Array of [longitude, latitude] pairs
    title: String,
    description: String,
    color: String,
    properties: mongoose.Schema.Types.Mixed
  }],
  heatmap: {
    data: [{
      location: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      },
      weight: Number
    }],
    radius: Number,
    blur: Number,
    max: Number
  },
  clusters: {
    enabled: Boolean,
    radius: Number,
    maxZoom: Number
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
mapSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Map = mongoose.model('Map', mapSchema);

export default Map; 