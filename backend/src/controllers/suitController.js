const Suit = require('../models/Suit');
const errorResponse = require('../utils/errorResponse');

// @desc    Get all suits with pagination, filtering, and sorting
// @route   GET /api/suits
// @access  Public
exports.getAllSuits = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    // Map minPrice/maxPrice to mongoose operators if needed, or handle separately
    // Simple filter: /api/suits?category=Male&ageRange=Adults

    // Handle minPrice and maxPrice for price range
    // NOTE: This basic replacement handles gte/gt/lte/lt usually
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    // Parse back to JSON
    let filter = JSON.parse(queryStr);

    // Handle price range manually if passed as minPrice/maxPrice
    if (req.query.minPrice || req.query.maxPrice) {
      filter.purchasePrice = {};
      if (req.query.minPrice) filter.purchasePrice.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.purchasePrice.$lte = Number(req.query.maxPrice);
    }

    // Search by name or description
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Finding resource
    query = Suit.find(filter);

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Suit.countDocuments(filter);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const suits = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: suits.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: suits,
    });
  } catch (error) {
    errorResponse(res, 500, 'Server Error', error.message);
  }
};

// @desc    Get single suit
// @route   GET /api/suits/:id
// @access  Public
exports.getSuitById = async (req, res) => {
  try {
    const suit = await Suit.findById(req.params.id);

    if (!suit) {
      return errorResponse(res, 404, `Suit not found with id of ${req.params.id}`);
    }

    res.status(200).json({
      success: true,
      data: suit,
    });
  } catch (error) {
    errorResponse(res, 400, 'Invalid Suit ID', error.message);
  }
};

// @desc    Create new suit
// @route   POST /api/suits
// @access  Private (Admin)
exports.createSuit = async (req, res) => {
  try {
    const suit = await Suit.create(req.body);

    res.status(201).json({
      success: true,
      data: suit,
    });
  } catch (error) {
    errorResponse(res, 400, 'Error creating suit', error.message);
  }
};

// @desc    Update suit
// @route   PUT /api/suits/:id
// @access  Private (Admin)
exports.updateSuit = async (req, res) => {
  try {
    let suit = await Suit.findById(req.params.id);

    if (!suit) {
      return errorResponse(res, 404, `Suit not found with id of ${req.params.id}`);
    }

    suit = await Suit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: suit,
    });
  } catch (error) {
    errorResponse(res, 400, 'Error updating suit', error.message);
  }
};

// @desc    Delete suit
// @route   DELETE /api/suits/:id
// @access  Private (Admin)
exports.deleteSuit = async (req, res) => {
  try {
    const suit = await Suit.findById(req.params.id);

    if (!suit) {
      return errorResponse(res, 404, `Suit not found with id of ${req.params.id}`);
    }

    await suit.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Suit deleted successfully'
    });
  } catch (error) {
    errorResponse(res, 400, 'Error deleting suit', error.message);
  }
};
