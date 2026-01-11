const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized, Login Again" });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(token_decode.id);
        if (!user || user.role !== 'admin') {
            return res.json({ success: false, message: "Not Authorized, Admin only" });
        }

        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = adminAuth;
