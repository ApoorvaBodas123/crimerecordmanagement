import mongoose from 'mongoose';

const witnessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contactInfo: {
    phone: String,
    email: String,
    address: String
  },
  statement: {
    type: String,
    required: true
  },
  statementDate: {
    type: Date,
    required: true
  },
  statementLocation: {
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  statementOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reliability: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  associatedCases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  }],
  associatedCrimes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crime'
  }],
  protectionStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'active'],
    default: 'none'
  },
  protectionDetails: {
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startDate: Date,
    endDate: Date,
    notes: String
  },
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
witnessSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Witness = mongoose.model('Witness', witnessSchema);

export default Witness; 