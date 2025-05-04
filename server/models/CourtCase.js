import mongoose from 'mongoose';

const courtCaseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'adjourned', 'completed'],
    default: 'pending'
  },
  criminalCase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  court: {
    name: String,
    location: String,
    judge: String
  },
  prosecutor: {
    name: String,
    contact: String
  },
  defenseAttorney: {
    name: String,
    contact: String
  },
  defendants: [{
    name: String,
    role: String,
    status: String
  }],
  charges: [{
    description: String,
    severity: String,
    status: String
  }],
  hearings: [{
    date: Date,
    type: String,
    location: String,
    presidingJudge: String,
    outcome: String,
    notes: String
  }],
  evidence: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  }],
  witnesses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Witness'
  }],
  verdict: {
    date: Date,
    decision: String,
    sentence: String,
    notes: String
  },
  appeals: [{
    date: Date,
    status: String,
    outcome: String,
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
courtCaseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const CourtCase = mongoose.model('CourtCase', courtCaseSchema);

export default CourtCase; 