const Order = require('../models/Order');
const Product = require('../models/Product');
const errorResponse = require('../utils/errorResponse');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return errorResponse(res, 400, 'No order items');
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return errorResponse(res, 404, `Product not found with id of ${item.productId}`);
      }

      if (product.stockQuantity < item.quantity) {
        return errorResponse(
          res,
          400,
          `Product '${product.name}' is out of stock or insufficient quantity. Available: ${product.stockQuantity}`
        );
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: item.productId,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
        image: product.images[0]?.url
      });

      // Update stock
      product.stockQuantity -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentStatus: 'Pending',
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    errorResponse(res, 400, 'Error creating order', error.message);
  }
};

// @desc    Get all orders (Admin: all, User: own)
// @route   GET /api/orders
// @access  Private
exports.getAllOrders = async (req, res) => {
  try {
    let query;

    if (req.user.role === 'admin') {
      query = Order.find({});
    } else {
      query = Order.find({ userId: req.user._id });
    }

    query = query
      .populate('userId', 'name email role')
      .populate('items.product', 'name price images')
      .sort('-createdAt');

    const orders = await query;

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    errorResponse(res, 500, 'Server Error', error.message);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.product', 'name price images');

    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to view this order');
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    errorResponse(res, 400, 'Invalid Order ID', error.message);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    errorResponse(res, 400, 'Error updating order', error.message);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    errorResponse(res, 400, 'Error deleting order', error.message);
  }
};
