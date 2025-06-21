import VideoAnalysis from '../models/VideoAnalysis.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exercise-specific scoring criteria
const EXERCISE_CRITERIA = {
  squat: {
    keyPoints: ['kneeAlignment', 'backStraightness', 'depth', 'balance', 'speed'],
    weights: { kneeAlignment: 0.25, backStraightness: 0.25, depth: 0.25, balance: 0.15, speed: 0.10 },
    minReps: 3,
    maxReps: 20
  },
  pushup: {
    keyPoints: ['bodyAlignment', 'elbowAngle', 'depth', 'stability', 'speed'],
    weights: { bodyAlignment: 0.30, elbowAngle: 0.25, depth: 0.20, stability: 0.15, speed: 0.10 },
    minReps: 3,
    maxReps: 30
  },
  deadlift: {
    keyPoints: ['backStraightness', 'hipHinge', 'barPath', 'balance', 'speed'],
    weights: { backStraightness: 0.35, hipHinge: 0.25, barPath: 0.20, balance: 0.15, speed: 0.05 },
    minReps: 3,
    maxReps: 15
  },
  plank: {
    keyPoints: ['bodyAlignment', 'coreEngagement', 'stability', 'duration'],
    weights: { bodyAlignment: 0.40, coreEngagement: 0.30, stability: 0.20, duration: 0.10 },
    minReps: 1,
    maxReps: 1
  },
  lunge: {
    keyPoints: ['kneeAlignment', 'balance', 'depth', 'posture', 'speed'],
    weights: { kneeAlignment: 0.25, balance: 0.25, depth: 0.20, posture: 0.20, speed: 0.10 },
    minReps: 6,
    maxReps: 20
  }
};

// Upload video and start analysis
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { exerciseType } = req.body;
    const userId = req.user.id;

    // Validate exercise type
    const validExercises = ['squat', 'pushup', 'deadlift', 'plank', 'lunge'];
    if (!validExercises.includes(exerciseType)) {
      return res.status(400).json({ message: 'Invalid exercise type' });
    }

    // Create video analysis record
    const videoAnalysis = new VideoAnalysis({
      userId,
      exerciseType,
      videoUrl: req.file.path,
      analysisResults: {
        overallScore: 0,
        repCount: 0,
        sessionDuration: 0,
        poseData: [],
        detailedFeedback: {
          positive: [],
          improvements: [],
          tips: []
        },
        metrics: {
          kneeAlignment: 0,
          backStraightness: 0,
          depth: 0,
          speed: 0,
          balance: 0
        }
      }
    });

    await videoAnalysis.save();

    res.status(201).json({
      message: 'Video uploaded successfully',
      analysisId: videoAnalysis._id,
      videoUrl: req.file.path
    });

  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ message: 'Error uploading video' });
  }
};

// Process pose data and generate analysis
export const processAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const { poseData, repCount, sessionDuration } = req.body;

    const videoAnalysis = await VideoAnalysis.findById(analysisId);
    if (!videoAnalysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Calculate comprehensive metrics based on pose data
    const metrics = calculateAdvancedMetrics(poseData, videoAnalysis.exerciseType);
    
    // Calculate overall score using exercise-specific criteria
    const overallScore = calculateOverallScore(metrics, videoAnalysis.exerciseType);
    
    // Generate detailed feedback based on metrics
    const detailedFeedback = generateDetailedFeedback(metrics, videoAnalysis.exerciseType, repCount);
    
    // Generate AI-like feedback using rule-based system
    const aiFeedback = generateRuleBasedFeedback(metrics, videoAnalysis.exerciseType, overallScore, repCount);

    // Update analysis results
    videoAnalysis.analysisResults = {
      overallScore,
      repCount,
      sessionDuration,
      poseData,
      detailedFeedback,
      metrics
    };
    videoAnalysis.aiFeedback = aiFeedback;

    await videoAnalysis.save();

    res.json({
      message: 'Analysis completed successfully',
      analysis: videoAnalysis
    });

  } catch (error) {
    console.error('Error processing analysis:', error);
    res.status(500).json({ message: 'Error processing analysis' });
  }
};

// Get analysis results
export const getAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const userId = req.user.id;

    const videoAnalysis = await VideoAnalysis.findOne({
      _id: analysisId,
      userId
    });

    if (!videoAnalysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json(videoAnalysis);

  } catch (error) {
    console.error('Error getting analysis:', error);
    res.status(500).json({ message: 'Error getting analysis' });
  }
};

// Get user's analysis history
export const getAnalysisHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exerciseType, limit = 10 } = req.query;

    const query = { userId };
    if (exerciseType) {
      query.exerciseType = exerciseType;
    }

    const analyses = await VideoAnalysis.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-analysisResults.poseData'); // Exclude large pose data

    res.json(analyses);

  } catch (error) {
    console.error('Error getting analysis history:', error);
    res.status(500).json({ message: 'Error getting analysis history' });
  }
};

// Advanced MediaPipe-based metrics calculation
const calculateAdvancedMetrics = (poseData, exerciseType) => {
  if (!poseData || poseData.length === 0) {
    return {
      kneeAlignment: 0,
      backStraightness: 0,
      depth: 0,
      speed: 0,
      balance: 0,
      bodyAlignment: 0,
      elbowAngle: 0,
      stability: 0,
      hipHinge: 0,
      barPath: 0,
      coreEngagement: 0
    };
  }

  const metrics = {
    kneeAlignment: calculateKneeAlignment(poseData),
    backStraightness: calculateBackStraightness(poseData),
    depth: calculateDepth(poseData, exerciseType),
    speed: calculateSpeed(poseData),
    balance: calculateBalance(poseData),
    bodyAlignment: calculateBodyAlignment(poseData),
    elbowAngle: calculateElbowAngle(poseData),
    stability: calculateStability(poseData),
    hipHinge: calculateHipHinge(poseData),
    barPath: calculateBarPath(poseData),
    coreEngagement: calculateCoreEngagement(poseData)
  };

  return metrics;
};

const calculateKneeAlignment = (poseData) => {
  let alignmentScore = 0;
  let validFrames = 0;

  poseData.forEach(frame => {
    if (frame.landmarks && frame.landmarks.length >= 33) {
      const leftKnee = frame.landmarks[25];
      const rightKnee = frame.landmarks[26];
      const leftAnkle = frame.landmarks[27];
      const rightAnkle = frame.landmarks[28];

      if (leftKnee && rightKnee && leftAnkle && rightAnkle) {
        // Calculate knee alignment relative to ankles
        const leftAlignment = Math.abs(leftKnee.x - leftAnkle.x);
        const rightAlignment = Math.abs(rightKnee.x - rightAnkle.x);
        
        const alignment = (leftAlignment + rightAlignment) / 2;
        alignmentScore += Math.max(0, 100 - alignment * 200); // More sensitive
        validFrames++;
      }
    }
  });

  return validFrames > 0 ? Math.round(alignmentScore / validFrames) : 0;
};

const calculateBackStraightness = (poseData) => {
  let straightnessScore = 0;
  let validFrames = 0;

  poseData.forEach(frame => {
    if (frame.landmarks && frame.landmarks.length >= 33) {
      const leftShoulder = frame.landmarks[11];
      const rightShoulder = frame.landmarks[12];
      const leftHip = frame.landmarks[23];
      const rightHip = frame.landmarks[24];

      if (leftShoulder && rightShoulder && leftHip && rightHip) {
        // Calculate back angle using shoulder and hip alignment
        const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
        const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
        const hipMidX = (leftHip.x + rightHip.x) / 2;
        const hipMidY = (leftHip.y + rightHip.y) / 2;

        const backAngle = Math.abs(shoulderMidX - hipMidX);
        const verticalAlignment = Math.abs(shoulderMidY - hipMidY);
        
        straightnessScore += Math.max(0, 100 - (backAngle * 150 + verticalAlignment * 50));
        validFrames++;
      }
    }
  });

  return validFrames > 0 ? Math.round(straightnessScore / validFrames) : 0;
};

const calculateDepth = (poseData, exerciseType) => {
  if (exerciseType === 'plank') return 0;

  let depthScore = 0;
  let validFrames = 0;

  poseData.forEach(frame => {
    if (frame.landmarks && frame.landmarks.length >= 33) {
      const leftKnee = frame.landmarks[25];
      const leftHip = frame.landmarks[23];
      const leftAnkle = frame.landmarks[27];

      if (leftKnee && leftHip && leftAnkle) {
        let depth = 0;
        
        if (exerciseType === 'squat') {
          // Calculate squat depth based on knee angle
          const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
          depth = Math.max(0, 100 - Math.abs(kneeAngle - 90));
        } else if (exerciseType === 'pushup') {
          // Calculate pushup depth based on shoulder position relative to elbows
          const leftShoulder = frame.landmarks[11];
          const leftElbow = frame.landmarks[13];
          if (leftShoulder && leftElbow) {
            const shoulderElbowDistance = Math.abs(leftShoulder.y - leftElbow.y);
            depth = Math.min(100, shoulderElbowDistance * 200);
          }
        } else if (exerciseType === 'lunge') {
          // Calculate lunge depth based on knee angle
          const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
          depth = Math.max(0, 100 - Math.abs(kneeAngle - 90));
        }
        
        depthScore += depth;
        validFrames++;
      }
    }
  });

  return validFrames > 0 ? Math.round(depthScore / validFrames) : 0;
};

const calculateSpeed = (poseData) => {
  if (poseData.length < 2) return 0;

  let speedScore = 0;
  let comparisons = 0;

  for (let i = 1; i < poseData.length; i++) {
    const prevFrame = poseData[i - 1];
    const currFrame = poseData[i];

    if (prevFrame.landmarks && currFrame.landmarks) {
      // Calculate movement speed between frames
      const movement = calculateMovement(prevFrame.landmarks, currFrame.landmarks);
      const speed = Math.min(100, movement * 15); // Adjusted sensitivity
      speedScore += speed;
      comparisons++;
    }
  }

  return comparisons > 0 ? Math.round(speedScore / comparisons) : 0;
};

const calculateBalance = (poseData) => {
  let balanceScore = 0;
  let validFrames = 0;

  poseData.forEach(frame => {
    if (frame.landmarks && frame.landmarks.length >= 33) {
      const leftShoulder = frame.landmarks[11];
      const rightShoulder = frame.landmarks[12];
      const leftHip = frame.landmarks[23];
      const rightHip = frame.landmarks[24];

      if (leftShoulder && rightShoulder && leftHip && rightHip) {
        // Calculate balance based on shoulder and hip alignment
        const shoulderBalance = Math.abs(leftShoulder.x - rightShoulder.x);
        const hipBalance = Math.abs(leftHip.x - rightHip.x);
        
        const balance = Math.max(0, 100 - (shoulderBalance + hipBalance) * 100);
        balanceScore += balance;
        validFrames++;
      }
    }
  });

  return validFrames > 0 ? Math.round(balanceScore / validFrames) : 0;
};

const calculateBodyAlignment = (poseData) => {
  let alignmentScore = 0;
  let validFrames = 0;

  poseData.forEach(frame => {
    if (frame.landmarks && frame.landmarks.length >= 33) {
      const leftShoulder = frame.landmarks[11];
      const rightShoulder = frame.landmarks[12];
      const leftHip = frame.landmarks[23];
      const rightHip = frame.landmarks[24];
      const leftAnkle = frame.landmarks[27];
      const rightAnkle = frame.landmarks[28];

      if (leftShoulder && rightShoulder && leftHip && rightHip && leftAnkle && rightAnkle) {
        // Calculate overall body alignment
        const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
        const hipMidX = (leftHip.x + rightHip.x) / 2;
        const ankleMidX = (leftAnkle.x + rightAnkle.x) / 2;

        const alignment = Math.abs(shoulderMidX - hipMidX) + Math.abs(hipMidX - ankleMidX);
        alignmentScore += Math.max(0, 100 - alignment * 100);
        validFrames++;
      }
    }
  });

  return validFrames > 0 ? Math.round(alignmentScore / validFrames) : 0;
};

const calculateElbowAngle = (poseData) => {
  let angleScore = 0;
  let validFrames = 0;

  poseData.forEach(frame => {
    if (frame.landmarks && frame.landmarks.length >= 33) {
      const leftShoulder = frame.landmarks[11];
      const leftElbow = frame.landmarks[13];
      const leftWrist = frame.landmarks[15];

      if (leftShoulder && leftElbow && leftWrist) {
        const angle = calculateAngle(leftShoulder, leftElbow, leftWrist);
        // Ideal pushup angle is around 90 degrees
        const angleScore = Math.max(0, 100 - Math.abs(angle - 90));
        angleScore += angleScore;
        validFrames++;
      }
    }
  });

  return validFrames > 0 ? Math.round(angleScore / validFrames) : 0;
};

const calculateStability = (poseData) => {
  if (poseData.length < 3) return 0;

  let stabilityScore = 0;
  let comparisons = 0;

  for (let i = 2; i < poseData.length; i++) {
    const frame1 = poseData[i - 2];
    const frame2 = poseData[i - 1];
    const frame3 = poseData[i];

    if (frame1.landmarks && frame2.landmarks && frame3.landmarks) {
      // Calculate stability based on consistent positioning
      const movement1 = calculateMovement(frame1.landmarks, frame2.landmarks);
      const movement2 = calculateMovement(frame2.landmarks, frame3.landmarks);
      
      const stability = Math.max(0, 100 - Math.abs(movement1 - movement2) * 200);
      stabilityScore += stability;
      comparisons++;
    }
  }

  return comparisons > 0 ? Math.round(stabilityScore / comparisons) : 0;
};

const calculateHipHinge = (poseData) => {
  let hingeScore = 0;
  let validFrames = 0;

  poseData.forEach(frame => {
    if (frame.landmarks && frame.landmarks.length >= 33) {
      const leftShoulder = frame.landmarks[11];
      const leftHip = frame.landmarks[23];
      const leftKnee = frame.landmarks[25];

      if (leftShoulder && leftHip && leftKnee) {
        // Calculate hip hinge angle
        const angle = calculateAngle(leftShoulder, leftHip, leftKnee);
        // Ideal deadlift hip angle is around 45-60 degrees
        const idealAngle = 52.5;
        const angleScore = Math.max(0, 100 - Math.abs(angle - idealAngle) * 2);
        hingeScore += angleScore;
        validFrames++;
      }
    }
  });

  return validFrames > 0 ? Math.round(hingeScore / validFrames) : 0;
};

const calculateBarPath = (poseData) => {
  // Simplified bar path calculation based on shoulder movement
  let pathScore = 0;
  let validFrames = 0;

  for (let i = 1; i < poseData.length; i++) {
    const prevFrame = poseData[i - 1];
    const currFrame = poseData[i];

    if (prevFrame.landmarks && currFrame.landmarks) {
      const leftShoulder = prevFrame.landmarks[11];
      const rightShoulder = prevFrame.landmarks[12];
      const leftShoulder2 = currFrame.landmarks[11];
      const rightShoulder2 = currFrame.landmarks[12];

      if (leftShoulder && rightShoulder && leftShoulder2 && rightShoulder2) {
        const prevMidX = (leftShoulder.x + rightShoulder.x) / 2;
        const currMidX = (leftShoulder2.x + rightShoulder2.x) / 2;
        
        // Ideal bar path should be straight (minimal horizontal movement)
        const horizontalMovement = Math.abs(currMidX - prevMidX);
        const pathScore = Math.max(0, 100 - horizontalMovement * 200);
        pathScore += pathScore;
        validFrames++;
      }
    }
  }

  return validFrames > 0 ? Math.round(pathScore / validFrames) : 0;
};

const calculateCoreEngagement = (poseData) => {
  let engagementScore = 0;
  let validFrames = 0;

  poseData.forEach(frame => {
    if (frame.landmarks && frame.landmarks.length >= 33) {
      const leftShoulder = frame.landmarks[11];
      const rightShoulder = frame.landmarks[12];
      const leftHip = frame.landmarks[23];
      const rightHip = frame.landmarks[24];

      if (leftShoulder && rightShoulder && leftHip && rightHip) {
        // Calculate core engagement based on shoulder-hip alignment
        const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
        const hipMidY = (leftHip.y + rightHip.y) / 2;
        
        // Good core engagement keeps shoulders and hips aligned
        const alignment = Math.abs(shoulderMidY - hipMidY);
        const engagement = Math.max(0, 100 - alignment * 150);
        engagementScore += engagement;
        validFrames++;
      }
    }
  });

  return validFrames > 0 ? Math.round(engagementScore / validFrames) : 0;
};

const calculateOverallScore = (metrics, exerciseType) => {
  const criteria = EXERCISE_CRITERIA[exerciseType];
  if (!criteria) return 0;

  let totalScore = 0;
  let totalWeight = 0;

  criteria.keyPoints.forEach(point => {
    if (metrics[point] !== undefined && criteria.weights[point]) {
      totalScore += metrics[point] * criteria.weights[point];
      totalWeight += criteria.weights[point];
    }
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
};

const generateDetailedFeedback = (metrics, exerciseType, repCount) => {
  const feedback = {
    positive: [],
    improvements: [],
    tips: []
  };

  const criteria = EXERCISE_CRITERIA[exerciseType];
  if (!criteria) return feedback;

  // Generate feedback based on metrics
  criteria.keyPoints.forEach(point => {
    const score = metrics[point] || 0;
    
    if (score >= 80) {
      feedback.positive.push(getPositiveFeedback(point, exerciseType));
    } else if (score < 60) {
      feedback.improvements.push(getImprovementFeedback(point, exerciseType));
    }
  });

  // Add rep count feedback
  if (repCount < criteria.minReps) {
    feedback.improvements.push(`Aim for at least ${criteria.minReps} repetitions for a complete workout`);
  } else if (repCount >= criteria.minReps && repCount <= criteria.maxReps) {
    feedback.positive.push(`Great job completing ${repCount} repetitions!`);
  }

  // Add general tips
  feedback.tips = getGeneralTips(exerciseType);

  return feedback;
};

const generateRuleBasedFeedback = (metrics, exerciseType, overallScore, repCount) => {
  const criteria = EXERCISE_CRITERIA[exerciseType];
  
  let summary = '';
  const recommendations = [];
  const nextSteps = [];

  // Generate summary based on overall score
  if (overallScore >= 90) {
    summary = `Excellent form! Your ${exerciseType} technique is outstanding with a score of ${overallScore}/100.`;
  } else if (overallScore >= 75) {
    summary = `Good form! Your ${exerciseType} technique is solid with a score of ${overallScore}/100.`;
  } else if (overallScore >= 60) {
    summary = `Fair form. Your ${exerciseType} technique needs some improvement with a score of ${overallScore}/100.`;
  } else {
    summary = `Your ${exerciseType} technique needs significant improvement with a score of ${overallScore}/100.`;
  }

  // Generate specific recommendations
  criteria.keyPoints.forEach(point => {
    const score = metrics[point] || 0;
    if (score < 70) {
      recommendations.push(getSpecificRecommendation(point, exerciseType, score));
    }
  });

  // Generate next steps
  if (overallScore < 75) {
    nextSteps.push('Practice the movement slowly to improve form');
    nextSteps.push('Focus on the specific areas mentioned in recommendations');
  } else {
    nextSteps.push('Gradually increase intensity while maintaining form');
    nextSteps.push('Consider adding variations to challenge yourself');
  }

  return {
    summary,
    recommendations: recommendations.slice(0, 3), // Limit to 3 recommendations
    nextSteps
  };
};

// Helper functions for feedback generation
const getPositiveFeedback = (metric, exerciseType) => {
  const feedback = {
    kneeAlignment: 'Excellent knee alignment maintained throughout',
    backStraightness: 'Great back posture and spinal alignment',
    depth: 'Good range of motion and exercise depth',
    balance: 'Excellent balance and stability',
    speed: 'Good movement tempo and control',
    bodyAlignment: 'Perfect body alignment throughout the movement',
    elbowAngle: 'Excellent elbow positioning and control',
    stability: 'Great stability and control',
    hipHinge: 'Perfect hip hinge movement',
    barPath: 'Excellent bar path and movement efficiency',
    coreEngagement: 'Strong core engagement maintained'
  };
  return feedback[metric] || 'Great form in this aspect';
};

const getImprovementFeedback = (metric, exerciseType) => {
  const feedback = {
    kneeAlignment: 'Focus on keeping knees aligned with toes',
    backStraightness: 'Work on maintaining a straight back throughout',
    depth: 'Try to achieve deeper range of motion',
    balance: 'Improve balance and stability',
    speed: 'Control your movement speed better',
    bodyAlignment: 'Maintain better body alignment',
    elbowAngle: 'Keep elbows at proper angle',
    stability: 'Improve movement stability',
    hipHinge: 'Focus on proper hip hinge movement',
    barPath: 'Keep the bar path straight and efficient',
    coreEngagement: 'Engage your core more effectively'
  };
  return feedback[metric] || 'Work on improving this aspect';
};

const getSpecificRecommendation = (metric, exerciseType, score) => {
  const recommendations = {
    kneeAlignment: 'Practice in front of a mirror to check knee alignment',
    backStraightness: 'Focus on chest up, shoulders back position',
    depth: 'Gradually work on increasing your range of motion',
    balance: 'Practice balance exercises to improve stability',
    speed: 'Slow down your movements for better control',
    bodyAlignment: 'Imagine a straight line from head to heels',
    elbowAngle: 'Keep elbows close to your body',
    stability: 'Engage your core to improve stability',
    hipHinge: 'Practice hip hinge movement with bodyweight first',
    barPath: 'Keep the bar close to your body throughout',
    coreEngagement: 'Brace your core before each movement'
  };
  return recommendations[metric] || 'Focus on improving this technique';
};

const getGeneralTips = (exerciseType) => {
  const tips = {
    squat: [
      'Keep your chest up and shoulders back',
      'Push your knees out in the direction of your toes',
      'Go as deep as you can while maintaining good form'
    ],
    pushup: [
      'Maintain a straight line from head to heels',
      'Keep your core engaged throughout',
      'Control the descent and push up with power'
    ],
    deadlift: [
      'Keep the bar close to your body',
      'Push through your heels',
      'Maintain a neutral spine throughout'
    ],
    plank: [
      'Keep your body in a straight line',
      'Engage your core muscles',
      'Breathe steadily throughout the hold'
    ],
    lunge: [
      'Keep your front knee behind your toes',
      'Maintain upright posture',
      'Step back to starting position with control'
    ]
  };
  return tips[exerciseType] || ['Focus on proper form', 'Breathe steadily', 'Control your movements'];
};

const calculateAngle = (point1, point2, point3) => {
  const angle = Math.atan2(point3.y - point2.y, point3.x - point2.x) -
                Math.atan2(point1.y - point2.y, point1.x - point2.x);
  return Math.abs(angle * 180 / Math.PI);
};

const calculateMovement = (landmarks1, landmarks2) => {
  let totalMovement = 0;
  let validPoints = 0;

  for (let i = 0; i < Math.min(landmarks1.length, landmarks2.length); i++) {
    if (landmarks1[i] && landmarks2[i]) {
      const dx = landmarks1[i].x - landmarks2[i].x;
      const dy = landmarks1[i].y - landmarks2[i].y;
      totalMovement += Math.sqrt(dx * dx + dy * dy);
      validPoints++;
    }
  }

  return validPoints > 0 ? totalMovement / validPoints : 0;
}; 