const BaseJoi = require('joi');
const ExpressError = require('./utils/ExpressError');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML.'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension);

// Define the schema
const campgroundSchema = Joi.object({
    title: Joi.string().regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/).min(3).max(30).required().escapeHTML(),
    price: Joi.number().min(0).required(),
    location: Joi.string().regex(/^\s*\w+(?:[^\w]+\w+)*[^,\w]*$/).min(3).max(30).required().escapeHTML(),
    // image: Joi.string().regex(/^\s*\w+(?:[^\w]+\w+)*[^,\w]*$/).min(25).max(200).required(),
    description: Joi.string().regex(/^\s*\w+(?:[^\w]+\w+)*[^,\w]*$/).min(3).max(200).required().escapeHTML()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().regex(/^\s*\w+(?:[^\w]+\w+)*[^,\w]*$/).min(3).max(200).required().escapeHTML()
    }).required()
});

const userSchema = Joi.object({
    username: Joi.string().regex(/^\s*\w+(?:[^\w]+\w+)*[^,\w]*$/).min(3).max(200).required().escapeHTML(),
    email: Joi.string().email({ tlds: { allow: false } }).min(3).max(200).required().escapeHTML(),

})

// Validation functions
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

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}