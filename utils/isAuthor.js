const isAuthor = async (req, res, next) => {
    const { campground } = res.locals;

    if (campground.author._id.toString() !== req.user.id) {
        req.flash('error', 'You do not have the permission to do that.');
        console.log(res.locals.returnTo);
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    return next();
}

module.exports = isAuthor;