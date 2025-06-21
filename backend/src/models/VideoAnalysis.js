import mongoose from 'mongoose';

const videoAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseType: {
    type: String,
    required: true,
    enum: ['squat', 'pushup', 'deadlift', 'plank', 'lunge']
  },
  videoUrl: {
    type: String,
    required: true
  },
  analysisResults: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    repCount: {
      type: Number,
      default: 0
    },
    sessionDuration: {
      type: Number, // in seconds
      default: 0
    },
    poseData: [{
      timestamp: Number,
      landmarks: [{
        x: Number,
        y: Number,
        z: Number,
        visibility: Number
      }],
      score: Number,
      feedback: [String]
    }],
    detailedFeedback: {
      positive: [String],
      improvements: [String],
      tips: [String]
    },
    metrics: {
      kneeAlignment: Number,
      backStraightness: Number,
      depth: Number,
      speed: Number,
      balance: Number
    }
  },
  aiFeedback: {
    summary: String,
    recommendations: [String],
    nextSteps: [String]
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

// Update timestamp on save
videoAnalysisSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const VideoAnalysis = mongoose.model('VideoAnalysis', videoAnalysisSchema);

export default VideoAnalysis; 