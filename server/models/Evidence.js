import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  crime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crime'
  },
  type: {
    type: String,
    enum: ['document', 'image', 'video', 'audio', 'physical'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: String,
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collectedAt: {
    type: Date,
    required: true
  },
  location: {
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  chainOfCustody: [{
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: {
      type: String,
      enum: ['collected', 'transferred', 'analyzed', 'stored', 'returned']
    },
    date: Date,
    notes: String
  }],
  status: {
    type: String,
    enum: ['in_custody', 'analyzed', 'returned', 'destroyed'],
    default: 'in_custody'
  },
  analysis: {
    type: String,
    analyzedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    analysisDate: Date,
    results: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Evidence = mongoose.model('Evidence', evidenceSchema);

export default Evidence; 