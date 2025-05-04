import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'report', 'form', 'letter', 'notice',
      'warrant', 'subpoena', 'certificate'
    ],
    required: true
  },
  category: {
    type: String,
    enum: [
      'case', 'investigation', 'evidence',
      'court', 'administrative', 'other'
    ],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  fields: [{
    name: String,
    type: {
      type: String,
      enum: ['text', 'number', 'date', 'select', 'checkbox', 'file']
    },
    required: Boolean,
    options: [String],
    validation: {
      min: Number,
      max: Number,
      pattern: String,
      custom: String
    }
  }],
  metadata: {
    description: String,
    version: {
      type: String,
      default: '1.0.0'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    tags: [String]
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
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },
  preview: {
    url: String,
    thumbnail: String
  },
  history: [{
    version: String,
    content: String,
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    changes: String
  }],
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
templateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Template = mongoose.model('Template', templateSchema);

export default Template; 