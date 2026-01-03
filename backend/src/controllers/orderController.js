const Order = require('../models/Order');
const Suit = require('../models/Suit');
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

    // Calculate total and validate items
    // Using a for loop to handle async operations properly
    for (const item of items) {
      const suit = await Suit.findById(item.suitId);

      if (!suit) {
        return errorResponse(res, 404, `Suit not found with id of ${item.suitId}`);
      }

      // Check availability
      if (suit.availableQuantity < item.quantity) {
        return errorResponse(
          res,
          400,
          `Suit '${suit.name}' is out of stock or insufficient quantity. Available: ${suit.availableQuantity}`
        );
      }

      let price = 0;
      if (item.orderType === 'Purchase') {
        price = suit.purchasePrice;
        totalAmount += price * item.quantity;
      } else if (item.orderType === 'Rental') {
        if (!item.rentalDuration || item.rentalDuration <= 0) {
          return errorResponse(res, 400, 'Rental duration must be specified and positive for rental orders');
        }
        price = suit.rentalPricePerDay;
        totalAmount += price * item.rentalDuration * item.quantity;
      } else {
        return errorResponse(res, 400, 'Invalid order type. Must be Purchase or Rental');
      }

      orderItems.push({
        suitId: item.suitId,
        quantity: item.quantity,
        orderType: item.orderType,
        rentalDuration: item.orderType === 'Rental' ? item.rentalDuration : 0,
        rentalStartDate: item.rentalStartDate,
        rentalEndDate: item.rentalEndDate,
        pricePerUnit: price // Storing the snapshot price at time of order
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentStatus: 'Pending',
    });

    // Populate suit details in response
    const populatedOrder = await Order.findById(order._id).populate({
      path: 'items.suitId',
      select: 'name imageUrl'
    });

    res.status(201).json({
      success: true,
      data: populatedOrder,
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
      // Admin sees all orders
      query = Order.find({});
    } else {
      // User sees only their orders
      query = Order.find({ userId: req.user._id });
    }

    // Populate User and Suit details
    query = query
      .populate('userId', 'firstName lastName email phone')
      .populate({
        path: 'items.suitId',
        select: 'name imageUrl'
      })
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
      .populate('userId', 'firstName lastName email phone')
      .populate({
        path: 'items.suitId',
        select: 'name imageUrl description'
      });

    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    // Auth check: Admin or Order Owner
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
      data: {},
      message: 'Order deleted successfully'
    });
  } catch (error) {
    errorResponse(res, 400, 'Error deleting order', error.message);
  }
};
