import mongoose from 'mongoose';

const policeStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  contactInfo: {
    phone: String,
    email: String,
    emergencyNumber: String
  },
  jurisdiction: {
    type: String,
    required: true
  },
  officers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  resources: {
    vehicles: Number,
    equipment: [String]
  },
  workingHours: {
    start: String,
    end: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PoliceStation = mongoose.model('PoliceStation', policeStationSchema);

export default PoliceStation; 