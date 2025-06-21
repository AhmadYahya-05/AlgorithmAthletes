import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  basicMetrics: {
    chronologicalAge: {
      type: Number,
      required: [true, 'Chronological age is required']
    },
    height: {
      type: Number,
      required: [true, 'Height is required']
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required']
    },
    restingHeartRate: {
      type: Number,
      required: false
    },
    bloodPressure: {
      systolic: { type: Number, required: false },
      diastolic: { type: Number, required: false }
    }
  },
  // We will add these sections in later steps
  // lifestyle: { ... },
  // fitness: { ... },
  // biomarkers: { ... }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile; 