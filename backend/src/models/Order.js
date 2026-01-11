const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: { 
        type: String, 
        unique: true,
        sparse: true // Allows multiple null values but enforces uniqueness for non-null values
    },
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, default: false },
    date: { type: Number, required: true }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
