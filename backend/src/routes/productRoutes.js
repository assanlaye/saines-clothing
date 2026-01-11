
const express = require('express');
const router = express.Router();
const { listProducts, getProductById, addProduct, removeProduct, updateProduct } = require('../controllers/productController');
const adminAuth = require('../middleware/adminAuth');
const { upload } = require('../config/cloudinary'); // Ensure proper import of upload

router.get('/', listProducts);
router.get('/:id', getProductById);

// Admin Routes
router.post('/add', adminAuth, upload.array('images', 4), addProduct);
router.post('/remove', adminAuth, removeProduct);
router.post('/update', adminAuth, updateProduct);

module.exports = router;
