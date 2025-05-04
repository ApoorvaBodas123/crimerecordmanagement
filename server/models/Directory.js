import mongoose from 'mongoose';

const directorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['station', 'unit', 'department'],
    required: [true, 'Type is required']
  },
  // For police stations
  stationDetails: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    },
    phone: String,
    email: String,
    jurisdiction: String,
    operatingHours: String
  },
  // For police officers
  officerDetails: {
    rank: String,
    badgeNumber: String,
    department: String,
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Directory'
    },
    contactInfo: {
      phone: String,
      email: String
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for station coordinates
directorySchema.index({ 'stationDetails.address.coordinates': '2dsphere' });

const Directory = mongoose.model('Directory', directorySchema);

export default Directory; 