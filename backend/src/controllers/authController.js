const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for special admin credentials
        if (email === 'admin@saine.com' && password === 'admin123') {
            const adminUser = await User.findOne({ email: 'admin@saine.com' });
            if (adminUser) {
                adminUser.role = 'admin';
                await adminUser.save();
                const token = createToken(adminUser._id);
                return res.json({
                    success: true,
                    token,
                    user: {
                        id: adminUser._id,
                        name: adminUser.name,
                        email: adminUser.email,
                        role: 'admin'
                    }
                });
            } else {
                // If admin user doesn't exist, create it
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const newAdmin = new User({
                    name: 'Admin',
                    email: 'admin@saine.com',
                    password: hashedPassword,
                    role: 'admin'
                });
                const savedAdmin = await newAdmin.save();
                const token = createToken(savedAdmin._id);
                return res.json({
                    success: true,
                    token,
                    user: {
                        id: savedAdmin._id,
                        name: savedAdmin.name,
                        email: savedAdmin.email,
                        role: 'admin'
                    }
                });
            }
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await User.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { loginUser, registerUser };
