import mongoose from 'mongoose';

const officerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    required: true,
    unique: true
  },
  rank: {
    type: String,
    required: true
  },
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  specialization: [{
    type: String
  }]
}, {
  timestamps: true
});

const Officer = mongoose.model('Officer', officerSchema);

export default Officer; 