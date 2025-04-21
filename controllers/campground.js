const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find().populate('author');
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderCreateCampground = (req, res) => {
    res.render('campgrounds/createCampground');
}

module.exports.renderCampground = async (req, res) => {
    const { campground } = res.locals;
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderUpdateCampground = async (req, res) => {
    const { campground } = res.locals;
    res.render('campgrounds/updateCampground', { campground });
}

module.exports.deleteCampground = async (req, res) => {
    const id = req.params.id
    await Campground.findByIdAndDelete(id);
    console.log("Campground deleted successfully. Redirecting..");
    req.flash('success', "Campround deleted successfully.");
    res.redirect('/campgrounds');
}

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', "Campround created successfully.");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.updateCampground = async (req, res) => {
    const data = req.body.campground;
    if (!data.title || !data.price || !data.location || !data.image || !data.description) {
        req.flash('error', 'Incomplete/Erroneous information provided.');
        return res.redirect(`/campgrounds${id}`);
    }
    const { campground } = res.locals;
    Object.assign(campground, data);
    campground.save();
    console.log('Campground updated successfully. Redirecting..');
    req.flash('success', "Campround created successfully.");
    res.render('campgrounds/show', { campground });
}