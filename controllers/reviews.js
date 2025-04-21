const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.postReview = async (req, res, next) => {
    const id = req.params.id
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    review.save();
    camp.reviews.push(review._id);
    await camp.save();
    req.flash('success', "Review added successfully.");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    campground.reviews.filter(id => id != req.params.reviewId);
    await campground.save();
    await Review.findByIdAndDelete(req.params.reviewId);
    console.log("Review deleted successfully. Redirecting..");
    req.flash('success', "Review removed successfully.");
    res.redirect(`/campgrounds/${campground._id}`);
}