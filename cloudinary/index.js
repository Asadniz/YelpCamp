const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.cloudinaryName,
    api_key: process.env.cloudinaryKey,
    api_secret: process.env.cloudinarySecret
});

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "YelpCamp",
        allowedFormats: ['jpeg', 'png', 'jpg'],
        transformation: [{ quality: "auto", fetch_format: "auto" }]
    },
});

module.exports = { cloudinary, cloudinaryStorage };