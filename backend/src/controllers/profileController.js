import asyncHandler from 'express-async-handler';
import Profile from '../models/Profile.js';

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const {
    chronologicalAge,
    height,
    weight,
    restingHeartRate,
    systolicBP,
    diastolicBP
  } = req.body;

  // Simple validation
  if (!chronologicalAge || !height || !weight) {
    res.status(400);
    throw new Error('Please provide age, height, and weight');
  }

  const profileData = {
    user: req.user.id,
    basicMetrics: {
      chronologicalAge,
      height,
      weight,
      restingHeartRate,
      bloodPressure: {
        systolic: systolicBP,
        diastolic: diastolicBP
      }
    }
  };

  let profile = await Profile.findOne({ user: req.user.id });

  if (profile) {
    // Update existing profile
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileData },
      { new: true, runValidators: true }
    );
    return res.json(profile);
  }

  // Create new profile
  profile = new Profile(profileData);
  await profile.save();
  res.status(201).json(profile);
}); 