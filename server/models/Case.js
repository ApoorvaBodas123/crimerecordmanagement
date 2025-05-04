import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'under_investigation', 'closed', 'solved'],
    default: 'open'
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  crimes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crime'
  }],
  suspects: [{
    name: String,
    description: String,
    status: {
      type: String,
      enum: ['wanted', 'arrested', 'cleared']
    }
  }],
  evidence: [{
    type: {
      type: String,
      enum: ['document', 'image', 'video', 'audio', 'physical']
    },
    description: String,
    url: String,
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    collectedAt: Date
  }],
  courtDates: [{
    date: Date,
    type: String,
    location: String,
    notes: String
  }],
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
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
caseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Case = mongoose.model('Case', caseSchema);

export default Case; 