import mongoose from 'mongoose';
import crypto from 'crypto';

const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(32).toString('hex')
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  permissions: [{
    resource: String,
    actions: [String]
  }],
  rateLimit: {
    windowMs: {
      type: Number,
      default: 15 * 60 * 1000 // 15 minutes
    },
    max: {
      type: Number,
      default: 100
    }
  },
  lastUsed: {
    timestamp: Date,
    ipAddress: String,
    endpoint: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'revoked'],
    default: 'active'
  },
  expiresAt: Date,
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
apiKeySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const APIKey = mongoose.model('APIKey', apiKeySchema);

export default APIKey; 