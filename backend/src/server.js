const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/product', require('./routes/productRoutes'));
app.use('/api/user', require('./routes/authRoutes'));
app.use('/api/order', require('./routes/orderRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({ success: false, message: err.message });
});

// Basic Route
app.get('/', (req, res) => {
    res.json({
        message: 'Saines Clothing API is running...',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/user/register',
                login: 'POST /api/user/login'
            },
            products: {
                list: 'GET /api/product',
                getById: 'GET /api/product/:id',
                add: 'POST /api/product/add (Admin)',
                update: 'POST /api/product/update (Admin)',
                remove: 'POST /api/product/remove (Admin)'
            },
            orders: {
                place: 'POST /api/order/place (Auth)',
                userOrders: 'POST /api/order/userorders (Auth)',
                allOrders: 'GET /api/order/list (Admin)',
                updateStatus: 'POST /api/order/status (Admin)'
            }
        }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
