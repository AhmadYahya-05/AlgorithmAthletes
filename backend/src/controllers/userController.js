import User from '../models/User.js';

// @desc    Get all users, optional search by username
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const keyword = req.query.username
      ? {
          username: {
            $regex: req.query.username,
            $options: 'i',
          },
        }
      : {};

    // Find users, exclude the current user from the list
    const users = await User.find({ ...keyword, _id: { $ne: req.user._id } }).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a friend
// @route   POST /api/users/friends/:friendId
// @access  Private
export const addFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.friendId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    user.friends.push(friend._id);
    // Award 50 XP for adding a friend
    // In a real app, user stats would be in a separate model
    // For now, let's assume an xp field exists on the User model
    // user.xp += 50; 
    await user.save();

    res.json({ message: 'Friend added successfully', user: user.toJSON() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get current user's friends
// @route   GET /api/users/friends
// @access  Private
export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', '-password');
    res.json(user.friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove a friend
// @route   DELETE /api/users/friends/:friendId
// @access  Private
export const removeFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friendId = req.params.friendId;

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'User is not in your friends list' });
    }

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    await user.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 