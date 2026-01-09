const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllProducts)
  .post(protect, authorize('ADMIN'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('ADMIN'), updateProduct)
  .delete(protect, authorize('ADMIN'), deleteProduct);

module.exports = router;
