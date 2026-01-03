const express = require('express');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

const router = express.Router();

// All order routes are protected
router.use(protect);

router
  .route('/')
  .post(createOrder)
  .get(getAllOrders);

router
  .route('/:id')
  .get(getOrderById)
  .put(authorize('admin'), updateOrderStatus)
  .delete(authorize('admin'), deleteOrder);

module.exports = router;
