const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');

// Define the schema
const campgroundSchema = Joi.object({
    title: Joi.string().regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/).min(3).max(30).required(),
    price: Joi.number().min(0).required(),
    location: Joi.string().regex(/^\s*\w+(?:[^\w]+\w+)*[^,\w]*$/).min(3).max(30).required(),
    image: Joi.string().regex(/^\s*\w+(?:[^\w]+\w+)*[^,\w]*$/).min(25).max(200).required(),
    description: Joi.string().regex(/^\s*\w+(?:[^\w]+\w+)*[^,\w]*$/).min(3).max(200).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().regex(/^\s*\w+(?:[^\w]+\w+)*[^,\w]*$/).min(3).max(200).required()
    }).required()
});

// Validation function
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body.campground);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};