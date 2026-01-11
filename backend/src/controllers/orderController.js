const Order = require('../models/Order');
const User = require('../models/User');

// Place order
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: paymentMethod || "wave", // Default to 'wave' if not provided
            payment: false,
            date: Date.now()
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        // Clear user cart
        await User.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// User orders data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// All orders for admin
const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update order status (admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = {
    placeOrder,
    userOrders,
    allOrders,
    updateStatus
};
