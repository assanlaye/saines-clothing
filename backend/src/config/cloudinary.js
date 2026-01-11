const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Support both CLOUDINARY_URL and individual environment variables
if (process.env.CLOUDINARY_URL) {
    // Use CLOUDINARY_URL if provided (format: cloudinary://api_key:api_secret@cloud_name)
    try {
        const cloudinaryUrl = process.env.CLOUDINARY_URL;
        
        // Validate URL format
        if (!cloudinaryUrl.startsWith('cloudinary://')) {
            throw new Error('CLOUDINARY_URL must start with "cloudinary://"');
        }
        
        // Parse URL to extract cloud_name for logging
        const urlMatch = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
        if (!urlMatch) {
            throw new Error('Invalid CLOUDINARY_URL format. Expected: cloudinary://api_key:api_secret@cloud_name');
        }
        
        const [, apiKey, apiSecret, cloudName] = urlMatch;
        
        if (!cloudName || cloudName.trim() === '') {
            throw new Error('Cloud name is missing from CLOUDINARY_URL');
        }
        
        // Configure Cloudinary
        cloudinary.config(cloudinaryUrl);
        console.log('✓ Cloudinary configured using CLOUDINARY_URL');
        console.log('  Cloud name:', cloudName);
    } catch (error) {
        console.error('\n========================================');
        console.error('ERROR: Failed to configure Cloudinary from CLOUDINARY_URL');
        console.error('========================================');
        console.error('Error:', error.message);
        console.error('Your CLOUDINARY_URL format should be:');
        console.error('  cloudinary://api_key:api_secret@cloud_name');
        console.error('========================================\n');
        throw error;
    }
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
    console.log('✓ Cloudinary configured with cloud_name:', cloudName);
}

// Verify Cloudinary configuration was set correctly
try {
    const config = cloudinary.config();
    const configuredCloudName = config.cloud_name;
    
    if (!configuredCloudName || configuredCloudName.trim() === '') {
        throw new Error('Cloudinary cloud_name is empty after configuration');
    }
    
    // Warn if cloud_name looks suspicious (contains "saine-clothing" which is just a folder name)
    if (configuredCloudName.toLowerCase().includes('saine-clothing')) {
        console.error('\n========================================');
        console.error('⚠️  WARNING: Invalid Cloudinary cloud_name detected!');
        console.error('========================================');
        console.error('Your cloud_name contains "saine-clothing"');
        console.error('"saine-clothing" is a FOLDER NAME, not your Cloudinary cloud name!');
        console.error('');
        console.error('To fix this:');
        console.error('1. Go to https://cloudinary.com/console');
        console.error('2. Check your Dashboard for the actual cloud name');
        console.error('3. Update your .env file with the correct CLOUDINARY_URL');
        console.error('   Format: cloudinary://api_key:api_secret@YOUR_ACTUAL_CLOUD_NAME');
        console.error('========================================\n');
        throw new Error(`Invalid cloud_name: "${configuredCloudName}". This should be your actual Cloudinary cloud name, not a folder name.`);
    }
    
    console.log('✓ Cloudinary configuration verified. Cloud name:', configuredCloudName);
} catch (error) {
    console.error('\n========================================');
    console.error('ERROR: Cloudinary configuration verification failed');
    console.error('========================================');
    console.error(error.message);
    console.error('========================================\n');
    throw error;
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
