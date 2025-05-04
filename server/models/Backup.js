import mongoose from 'mongoose';

const backupSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['full', 'incremental', 'database', 'files'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  size: Number,
  location: {
    type: String,
    required: true
  },
  files: [{
    name: String,
    path: String,
    size: Number,
    type: String
  }],
  databases: [{
    name: String,
    collections: [String]
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  duration: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  error: {
    message: String,
    stack: String
  },
  retentionPeriod: {
    type: Number,
    default: 30 // days
  },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Backup = mongoose.model('Backup', backupSchema);

export default Backup; 