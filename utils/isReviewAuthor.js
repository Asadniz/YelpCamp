const Review = require('../models/review');
const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (review.author._id.toString() !== req.user.id) {
        req.flash('error', 'You do not have the permission to do that.');
        console.log(res.locals.returnTo);
        return res.redirect(`/campgrounds/${id}`);
    }
    return next();
}

module.exports = isReviewAuthor;