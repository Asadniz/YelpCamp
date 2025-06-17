const cloudinary = require('cloudinary').v2;

async function getEtags(req, res, next) {
    req.session.etags = [];
    for (let i = 0; i < req.files.length; i++) {
        try {
            const resource = await cloudinary.api.resource(req.files[i].filename);
            req.session.etags[i] = resource.etag;
        } catch (e) {
            console.error('Error fetching etag for:', req.files[i].filename);
            req.session.etags[i] = null; // or handle as fallback
        }

    }
    return next();
}

module.exports = getEtags;