import { Pose } from '@mediapipe/pose';

// MediaPipe Pose landmark indices
const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE: 2,
  RIGHT_EYE: 5,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28
};

// Calculate distance between two points
const calculateDistance = (point1, point2) => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

// Calculate angle between three points
const calculateAngle = (point1, point2, point3) => {
  const a = calculateDistance(point1, point2);
  const b = calculateDistance(point2, point3);
  const c = calculateDistance(point1, point3);
  
  if (a === 0 || b === 0) return 0;
  
  const angle = Math.acos((a * a + b * b - c * c) / (2 * a * b));
  return (angle * 180) / Math.PI;
};

// Exercise-specific analysis functions
export const exerciseAnalyzers = {
  'Squat': {
    analyze: (poseLandmarks) => {
      const results = [];
      
      // Knee alignment check
      const leftKnee = poseLandmarks[POSE_LANDMARKS.LEFT_KNEE];
      const leftAnkle = poseLandmarks[POSE_LANDMARKS.LEFT_ANKLE];
      const rightKnee = poseLandmarks[POSE_LANDMARKS.RIGHT_KNEE];
      const rightAnkle = poseLandmarks[POSE_LANDMARKS.RIGHT_ANKLE];
      
      if (leftKnee && leftAnkle && rightKnee && rightAnkle) {
        const leftAlignment = Math.abs(leftKnee.x - leftAnkle.x);
        const rightAlignment = Math.abs(rightKnee.x - rightAnkle.x);
        const avgAlignment = (leftAlignment + rightAlignment) / 2;
        
        let score = Math.max(0, 10 - avgAlignment * 50);
        let feedback = '';
        
        if (avgAlignment < 0.05) {
          feedback = 'Excellent knee alignment!';
        } else if (avgAlignment < 0.1) {
          feedback = 'Good knee alignment. Keep knees over toes.';
        } else {
          feedback = 'Improve knee alignment. Keep knees aligned with ankles.';
          score = Math.max(score, 3);
        }
        
        results.push({
          name: 'Knee Alignment',
          score: Math.round(score),
          feedback,
          details: `Alignment deviation: ${(avgAlignment * 100).toFixed(1)}%`
        });
      }
      
      // Squat depth check
      const depthLeftHip = poseLandmarks[POSE_LANDMARKS.LEFT_HIP];
      const depthLeftKnee = poseLandmarks[POSE_LANDMARKS.LEFT_KNEE];
      
      if (depthLeftHip && depthLeftKnee) {
        const depth = depthLeftHip.y - depthLeftKnee.y;
        let score = 0;
        let feedback = '';
        
        if (depth > 0.15) {
          score = 10;
          feedback = 'Excellent squat depth!';
        } else if (depth > 0.1) {
          score = 8;
          feedback = 'Good squat depth.';
        } else if (depth > 0.05) {
          score = 5;
          feedback = 'Moderate depth. Go deeper for better results.';
        } else {
          score = 2;
          feedback = 'Insufficient depth. Aim for thighs parallel to ground.';
        }
        
        results.push({
          name: 'Squat Depth',
          score,
          feedback,
          details: `Depth: ${(depth * 100).toFixed(1)}%`
        });
      }
      
      // Back angle check
      const angleLeftShoulder = poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const angleLeftHip = poseLandmarks[POSE_LANDMARKS.LEFT_HIP];
      const angleLeftKnee = poseLandmarks[POSE_LANDMARKS.LEFT_KNEE];
      
      if (angleLeftShoulder && angleLeftHip && angleLeftKnee) {
        const backAngle = calculateAngle(angleLeftShoulder, angleLeftHip, angleLeftKnee);
        let score = 0;
        let feedback = '';
        
        if (backAngle > 45 && backAngle < 75) {
          score = 10;
          feedback = 'Perfect back angle!';
        } else if (backAngle > 30 && backAngle < 90) {
          score = 7;
          feedback = 'Good back angle.';
        } else {
          score = 4;
          feedback = 'Adjust back angle. Keep chest up and back straight.';
        }
        
        results.push({
          name: 'Back Angle',
          score,
          feedback,
          details: `Angle: ${backAngle.toFixed(1)}°`
        });
      }
      
      return results;
    }
  },
  
  'Push-up': {
    analyze: (poseLandmarks) => {
      const results = [];
      
      // Body alignment check
      const alignLeftShoulder = poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const alignLeftHip = poseLandmarks[POSE_LANDMARKS.LEFT_HIP];
      const alignLeftAnkle = poseLandmarks[POSE_LANDMARKS.LEFT_ANKLE];
      
      if (alignLeftShoulder && alignLeftHip && alignLeftAnkle) {
        const bodyLine = Math.abs(alignLeftShoulder.y - alignLeftHip.y) + Math.abs(alignLeftHip.y - alignLeftAnkle.y);
        let score = 0;
        let feedback = '';
        
        if (bodyLine < 0.05) {
          score = 10;
          feedback = 'Perfect body alignment!';
        } else if (bodyLine < 0.1) {
          score = 8;
          feedback = 'Good body alignment.';
        } else if (bodyLine < 0.15) {
          score = 5;
          feedback = 'Moderate alignment. Keep body straight.';
        } else {
          score = 2;
          feedback = 'Poor alignment. Maintain straight line from head to heels.';
        }
        
        results.push({
          name: 'Body Alignment',
          score,
          feedback,
          details: `Alignment deviation: ${(bodyLine * 100).toFixed(1)}%`
        });
      }
      
      // Elbow angle check
      const elbowLeftShoulder = poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const elbowLeftElbow = poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW];
      const elbowLeftWrist = poseLandmarks[POSE_LANDMARKS.LEFT_WRIST];
      
      if (elbowLeftShoulder && elbowLeftElbow && elbowLeftWrist) {
        const elbowAngle = calculateAngle(elbowLeftShoulder, elbowLeftElbow, elbowLeftWrist);
        let score = 0;
        let feedback = '';
        
        if (elbowAngle > 80 && elbowAngle < 100) {
          score = 10;
          feedback = 'Perfect elbow angle!';
        } else if (elbowAngle > 70 && elbowAngle < 110) {
          score = 7;
          feedback = 'Good elbow angle.';
        } else {
          score = 4;
          feedback = 'Adjust elbow angle. Aim for 90 degrees when lowering.';
        }
        
        results.push({
          name: 'Elbow Angle',
          score,
          feedback,
          details: `Angle: ${elbowAngle.toFixed(1)}°`
        });
      }
      
      return results;
    }
  },
  
  'Plank': {
    analyze: (poseLandmarks) => {
      const results = [];
      
      // Body straightness check
      const straightLeftShoulder = poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const straightLeftHip = poseLandmarks[POSE_LANDMARKS.LEFT_HIP];
      const straightLeftAnkle = poseLandmarks[POSE_LANDMARKS.LEFT_ANKLE];
      
      if (straightLeftShoulder && straightLeftHip && straightLeftAnkle) {
        const bodyLine = Math.abs(straightLeftShoulder.y - straightLeftHip.y) + Math.abs(straightLeftHip.y - straightLeftAnkle.y);
        let score = 0;
        let feedback = '';
        
        if (bodyLine < 0.03) {
          score = 10;
          feedback = 'Perfect plank form!';
        } else if (bodyLine < 0.06) {
          score = 8;
          feedback = 'Good plank form.';
        } else if (bodyLine < 0.1) {
          score = 5;
          feedback = 'Moderate form. Keep body straight.';
        } else {
          score = 2;
          feedback = 'Poor form. Don\'t let hips sag or rise.';
        }
        
        results.push({
          name: 'Body Straightness',
          score,
          feedback,
          details: `Straightness deviation: ${(bodyLine * 100).toFixed(1)}%`
        });
      }
      
      // Core engagement check (hip position relative to shoulders)
      const coreLeftShoulder = poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const coreLeftHip = poseLandmarks[POSE_LANDMARKS.LEFT_HIP];
      
      if (coreLeftShoulder && coreLeftHip) {
        const hipPosition = coreLeftHip.y - coreLeftShoulder.y;
        let score = 0;
        let feedback = '';
        
        if (Math.abs(hipPosition) < 0.02) {
          score = 10;
          feedback = 'Excellent core engagement!';
        } else if (Math.abs(hipPosition) < 0.05) {
          score = 7;
          feedback = 'Good core engagement.';
        } else {
          score = 4;
          feedback = 'Engage your core. Keep hips level with shoulders.';
        }
        
        results.push({
          name: 'Core Engagement',
          score,
          feedback,
          details: `Hip position: ${(hipPosition * 100).toFixed(1)}%`
        });
      }
      
      return results;
    }
  }
};

// Main analysis function
export const analyzeExerciseForm = (poseDataArray, exerciseType) => {
  if (!exerciseType || !exerciseAnalyzers[exerciseType]) {
    return {
      overallScore: 0,
      feedback: 'Exercise type not supported for MediaPipe analysis.',
      details: [],
      exercise: exerciseType
    };
  }

  const analyzer = exerciseAnalyzers[exerciseType];
  const frameAnalyses = [];
  let totalScore = 0;
  let totalFrames = 0;

  // Analyze each frame
  poseDataArray.forEach((poseLandmarks, frameIndex) => {
    const frameResults = analyzer.analyze(poseLandmarks);
    
    if (frameResults.length > 0) {
      const frameScore = frameResults.reduce((sum, result) => sum + result.score, 0) / frameResults.length;
      totalScore += frameScore;
      totalFrames++;
      
      frameAnalyses.push({
        frame: frameIndex,
        score: Math.round(frameScore),
        results: frameResults
      });
    }
  });

  const overallScore = totalFrames > 0 ? Math.round(totalScore / totalFrames) : 0;

  // Generate overall feedback
  let overallFeedback = '';
  if (overallScore >= 8) {
    overallFeedback = 'Excellent form! Your technique is on point.';
  } else if (overallScore >= 6) {
    overallFeedback = 'Good form with room for improvement.';
  } else if (overallScore >= 4) {
    overallFeedback = 'Form needs work. Focus on the areas mentioned below.';
  } else {
    overallFeedback = 'Form needs significant improvement. Consider working with a trainer.';
  }

  // Get most common issues
  const allResults = frameAnalyses.flatMap(frame => frame.results);
  const issueCounts = {};
  allResults.forEach(result => {
    if (result.score < 6) {
      issueCounts[result.name] = (issueCounts[result.name] || 0) + 1;
    }
  });

  const commonIssues = Object.entries(issueCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([issue]) => issue);

  if (commonIssues.length > 0) {
    overallFeedback += ` Focus on: ${commonIssues.join(', ')}.`;
  }

  return {
    overallScore,
    feedback: overallFeedback,
    details: frameAnalyses.slice(0, 10), // Limit to first 10 frames for display
    exercise: exerciseType,
    totalFrames: totalFrames
  };
};

// Initialize MediaPipe Pose
export const initializePose = () => {
  return new Pose({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });
}; 