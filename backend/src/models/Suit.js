const mongoose = require('mongoose');

const suitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a suit name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description can not be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Male', 'Female', 'Unisex']
  },
  ageRange: {
    type: String,
    required: [true, 'Please specify an age range'],
    enum: ['Kids', 'Teens', 'Adults']
  },
  sizes: {
    type: [String],
    required: [true, 'Please specify available sizes'],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'A suit must have at least one size'
    }
  },
  color: {
    type: String,
    required: [true, 'Please specify a color']
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Please specify a purchase price'],
    min: [0, 'Price must be positive']
  },
  rentalPricePerDay: {
    type: Number,
    required: [true, 'Please specify a rental price per day'],
    min: [0, 'Price must be positive']
  },
  imageUrl: {
    type: String,
    default: 'no-photo.jpg'
  },
  availableQuantity: {
    type: Number,
    required: [true, 'Please add available quantity'],
    min: [0, 'Quantity cannot be negative']
  },
  condition: {
    type: String,
    required: [true, 'Please specify condition'],
    enum: ['New', 'Good', 'Fair'],
    default: 'New'
  }
}, {
  timestamps: true
});

// Create index for search
suitSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Suit', suitSchema);
