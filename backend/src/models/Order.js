const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  suitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Suit',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  orderType: {
    type: String,
    enum: ['Purchase', 'Rental'],
    required: true
  },
  rentalDuration: {
    type: Number, // In days
    default: 0
  },
  rentalStartDate: {
    type: Date
  },
  rentalEndDate: {
    type: Date
  },
  pricePerUnit: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled', 'Returned', 'Overdue'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  deliveryAddress: {
    city: {
      type: String,
      required: [true, 'Please provide a city']
    },
    homeAddress: {
      type: String,
      required: [true, 'Please provide a home address']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a contact number for delivery']
    }
  }
}, {
  timestamps: true
});

// Auto-generate order number before saving
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
