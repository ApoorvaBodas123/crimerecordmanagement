import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['incident', 'investigation', 'evidence', 'witness', 'suspect', 'case', 'court'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
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
    suspect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Suspect'
    },
    witness: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Witness'
    },
    courtCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourtCase'
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
  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewed', 'approved', 'rejected'],
    default: 'draft'
  },
  review: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewDate: Date,
    comments: String,
    status: String
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    content: String,
    version: Number,
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modifiedAt: Date
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
reportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Report = mongoose.model('Report', reportSchema);

export default Report; 