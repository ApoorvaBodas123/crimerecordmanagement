import mongoose from 'mongoose';

const suspectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  aliases: [String],
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  physicalDescription: {
    height: String,
    weight: String,
    hairColor: String,
    eyeColor: String,
    distinguishingMarks: String
  },
  contactInfo: {
    phone: String,
    email: String,
    address: String
  },
  criminalRecord: [{
    caseNumber: String,
    crimeType: String,
    date: Date,
    status: String
  }],
  status: {
    type: String,
    enum: ['wanted', 'arrested', 'cleared'],
    default: 'wanted'
  },
  lastKnownLocation: {
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    date: Date
  },
  associatedCases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  }],
  associatedCrimes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crime'
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
suspectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Suspect = mongoose.model('Suspect', suspectSchema);

export default Suspect; 