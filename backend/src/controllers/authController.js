const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const errorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return errorResponse(res, 400, 'User already exists');
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      errorResponse(res, 400, 'Invalid user data');
    }
  } catch (error) {
    errorResponse(res, 400, 'Error registering user', error.message);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    errorResponse(res, 400, 'Error logging in', error.message);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      address: req.user.address,
      createdAt: req.user.createdAt
    };

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    errorResponse(res, 500, 'Server Error', error.message);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;

      // Allow password update if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        token: generateToken(updatedUser._id)
      });
    } else {
      errorResponse(res, 404, 'User not found');
    }
  } catch (error) {
    errorResponse(res, 400, 'Error updating profile', error.message);
  }
};
