const Campground = require("../models/campground");

const campgroundExists = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id)
            .populate({ path: 'reviews', populate: { path: 'author' } }).
            populate('author');; // Use `findById` to avoid deprecation warnings

        if (!campground) {
            req.flash('error', 'Campground not found.');
            return res.redirect('/campgrounds'); // Redirect if campground doesn't exist
        }

        res.locals.campground = campground; // Store in `res.locals` for later middleware/handlers
        next();
    }

    catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
};

module.exports = campgroundExists;
