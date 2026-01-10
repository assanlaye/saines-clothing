const Newsletter = require('../models/Newsletter');
const errorResponse = require('../utils/errorResponse');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 400, 'Email is required');
    }
    // Check if already subscribed
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return errorResponse(res, 400, 'Email already subscribed');
    }
    const subscription = await Newsletter.create({ email });
    res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
      data: subscription,
    });
  } catch (error) {
    errorResponse(res, 400, 'Subscription failed', error.message);
  }
};
