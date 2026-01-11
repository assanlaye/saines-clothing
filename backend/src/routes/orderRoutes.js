const express = require('express');
const { placeOrder, userOrders, allOrders, updateStatus } = require('../controllers/orderController');
const authUser = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const orderRouter = express.Router();

// User Routes
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/userorders', authUser, userOrders);

// Admin Routes
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

module.exports = orderRouter;
