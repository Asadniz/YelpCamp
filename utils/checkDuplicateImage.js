const Campground = require('../models/campground.js');
const cloudinary = require('cloudinary').v2;

const checkDuplicateImage = async (req, res, next) => {
    const etagArray = req.session.etags;
    let imgs = [];
    for (let i = 0; i < etagArray.length; i++) {

        const existingCamp = await Campground.findOne({ 'images.etag': etagArray[i] });

        if (existingCamp) {
            imgs[i] = existingCamp.image.find(img => img.etag === etagArray[i]);
            await cloudinary.uploader.destroy(req.files[i].filename);
        } else {
            const newImg = req.files[i];
            imgs[i] = { url: newImg.path, filename: newImg.filename, etag: etagArray[i] };
        }
    }

    req.session.images = imgs;
    return next();
}

module.exports = checkDuplicateImage;