import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['error', 'warn', 'info', 'debug'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: String,
  userAgent: String,
  request: {
    method: String,
    url: String,
    params: mongoose.Schema.Types.Mixed,
    body: mongoose.Schema.Types.Mixed,
    headers: mongoose.Schema.Types.Mixed
  },
  response: {
    statusCode: Number,
    body: mongoose.Schema.Types.Mixed,
    headers: mongoose.Schema.Types.Mixed
  },
  error: {
    name: String,
    message: String,
    stack: String,
    code: String
  },
  metadata: mongoose.Schema.Types.Mixed,
  tags: [String]
});

const Log = mongoose.model('Log', logSchema);

export default Log; 