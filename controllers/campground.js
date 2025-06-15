const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const { cloudinary } = require('../cloudinary');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

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
    console.log(campground);
    res.render('campgrounds/show', { campground });
}

module.exports.renderUpdateCampground = async (req, res) => {
    const { campground } = res.locals;
    console.log(campground);
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
    console.log(req.files);
    const data = req.body.campground;
    const geoData = await maptilerClient.geocoding.forward(data.location, { limit: 1 });
    const campground = new Campground(data);
    console.log(geoData.features[0].geometry);
    campground.geometry.type = 'Point';
    campground.geometry.coordinates = geoData.features[0].geometry.coordinates;
    campground.geometry.place = data.location;
    campground.author = req.user._id;
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await campground.save();
    req.flash('success', "Campround created successfully.");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.updateCampground = async (req, res) => {
    const data = req.body.campground;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    if (!data.title || !data.price || !data.location || !imgs || !data.description) {
        req.flash('error', 'Incomplete/Erroneous information provided.');
        return res.redirect(`/campgrounds/${id}`);
    }
    let { campground } = res.locals;
    console.log(campground);
    if (req.body.deleteImages) {
        const deleteImages = req.body.deleteImages.split(',');
        console.log("Images to delete: ", deleteImages);
        for (let img of deleteImages) {
            await cloudinary.uploader.destroy(img);
        }
        await campground.updateOne({
            $pull: {
                image: {
                    filename: { $in: deleteImages }
                }
            }
        });
        console.log("Images deleted successfully.");
    }
    Object.assign(campground, data);
    campground.image.push(...imgs);
    const geoData = await maptilerClient.geocoding.forward(campground.location, { limit: 1 });
    campground.geometry.coordinates = geoData.features[0].geometry.coordinates;
    campground.geometry.place = req.body.location;
    await campground.save();
    console.log(campground);
    console.log('Campground updated successfully. Redirecting..');
    req.flash('success', "Campground updated successfully.");
    res.redirect(`/campgrounds/${campground._id}`);
}