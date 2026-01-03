const express = require('express');
const {
  getAllSuits,
  getSuitById,
  createSuit,
  updateSuit,
  deleteSuit,
} = require('../controllers/suitController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

const router = express.Router();

router
  .route('/')
  .get(getAllSuits)
  .post(protect, authorize('admin'), createSuit);

router
  .route('/:id')
  .get(getSuitById)
  .put(protect, authorize('admin'), updateSuit)
  .delete(protect, authorize('admin'), deleteSuit);

module.exports = router;
