import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  originalName: String,
  path: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedTo: {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case'
    },
    crime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crime'
    },
    investigation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investigation'
    },
    evidence: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evidence'
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report'
    }
  },
  metadata: {
    description: String,
    tags: [String],
    custom: mongoose.Schema.Types.Mixed
  },
  storage: {
    provider: {
      type: String,
      enum: ['local', 's3', 'azure', 'google'],
      default: 'local'
    },
    bucket: String,
    region: String,
    key: String
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
  status: {
    type: String,
    enum: ['uploading', 'processing', 'ready', 'error', 'deleted'],
    default: 'uploading'
  },
  error: {
    message: String,
    stack: String
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
fileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const File = mongoose.model('File', fileSchema);

export default File; 