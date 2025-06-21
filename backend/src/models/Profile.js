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
  lifestyle: {
    exerciseFrequency: { type: Number, required: false },
    smokingStatus: { type: String, enum: ['never', 'former', 'current'], required: false },
    alcoholConsumption: { type: Number, required: false },
    sleepHours: { type: Number, required: false },
    stressLevel: { type: Number, required: false, min: 1, max: 10 }
  },
  fitness: {
    cardioPerformance: { type: String, required: false },
    strengthLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: false },
    flexibilityLevel: { type: String, enum: ['poor', 'average', 'good', 'excellent'], required: false }
  },
  // We will add these sections in later steps
  // biomarkers: { ... }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile; 