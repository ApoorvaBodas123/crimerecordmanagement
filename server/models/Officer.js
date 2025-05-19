import mongoose from 'mongoose';

const officerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  badgeNumber: {
    type: String,
    required: true,
    unique: true
  },
  rank: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  assignedCases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crime'
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

// Update the updatedAt timestamp before saving
officerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Officer = mongoose.model('Officer', officerSchema);

export default Officer; 