const express = require('express');
const {
  getReview,
  updateReview,
  deleteReview,
  getAllReviews
} = require('../controllers/reviewController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All review routes require authentication

router
  .route('/')
  .get(authorize('admin'), getAllReviews);

router
  .route('/:id')
  .get(getReview)
  .put(updateReview)
  .delete(deleteReview);

module.exports = router;
