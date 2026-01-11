const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Support both CLOUDINARY_URL and individual environment variables
if (process.env.CLOUDINARY_URL) {
    // Use CLOUDINARY_URL if provided (format: cloudinary://api_key:api_secret@cloud_name)
    cloudinary.config(process.env.CLOUDINARY_URL);
    console.log('Cloudinary configured using CLOUDINARY_URL');
} else {
    // Use individual environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        console.error('Error: Cloudinary environment variables are missing!');
        console.error('Please set either:');
        console.error('  Option 1: CLOUDINARY_URL (format: cloudinary://api_key:api_secret@cloud_name)');
        console.error('  Option 2: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET');
        throw new Error('Cloudinary configuration is incomplete. Please check your environment variables.');
    }

    // Configure Cloudinary with individual variables
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });

    // Verify configuration
    console.log('Cloudinary configured with cloud_name:', cloudName);
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'saine-clothing',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

module.exports = { cloudinary, upload };
