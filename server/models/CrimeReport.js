import mongoose from 'mongoose';

const crimeReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  crimeType: {
    type: String,
    required: true,
    enum: ['theft', 'assault', 'burglary', 'fraud', 'homicide', 'other']
  },
  location: {
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  dateTime: {
    type: Date,
    required: true
  },
  evidence: [{
    type: {
      type: String,
      enum: ['document', 'image', 'video', 'audio']
    },
    description: String,
    url: String
  }],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'accepted', 'rejected'],
    default: 'pending'
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  }
});

const CrimeReport = mongoose.model('CrimeReport', crimeReportSchema);

export default CrimeReport; 