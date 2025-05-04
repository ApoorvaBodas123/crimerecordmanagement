import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: Date
  }],
  subject: String,
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['direct', 'group', 'case', 'investigation'],
    default: 'direct'
  },
  relatedTo: {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case'
    },
    investigation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investigation'
    }
  },
  attachments: [{
    type: {
      type: String,
      enum: ['document', 'image', 'video', 'audio']
    },
    url: String,
    description: String
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'delivered', 'read'],
    default: 'draft'
  },
  replies: [{
    content: String,
    sender: {
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
messageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Message = mongoose.model('Message', messageSchema);

export default Message; 