const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const errorResponse = require('../../utils/errorResponse');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return errorResponse(res, 401, 'Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return errorResponse(res, 401, 'No user found with this id');
    }

    next();
  } catch (err) {
    return errorResponse(res, 401, 'Not authorized to access this route', err);
  }
};
