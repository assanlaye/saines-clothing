const errorResponse = require('../../utils/errorResponse');

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'User not authenticated', 'User not found in request');
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `User role ${req.user.role} is not authorized to access this route`
      );
    }
    next();
  };
};
