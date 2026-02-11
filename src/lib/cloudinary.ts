import { v2 as cloudinary } from 'cloudinary';

if (typeof window === 'undefined') {
    const isConfigured = !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    );

    console.log(`[Server] Cloudinary configuration check:`, {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'MISSING',
        is_configured: isConfigured
    });

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
}

export default cloudinary;
