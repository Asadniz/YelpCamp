const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({ url: String, filename: String, etag: String })
ImageSchema.virtual('thumbnailShow').get(function () {
    return this.url.replace('/upload', '/upload/w_400,h_250');
})

ImageSchema.virtual('thumbnailUpdate').get(function () {
    return this.url.replace('/upload', '/upload/w_250');
})
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        place: {
            type: String,
            required: true
        }
    },
    image: [ImageSchema],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    author:
        { type: Schema.Types.ObjectId, ref: 'User' },
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
        <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.description}</p>
        <p>By ${this.author.username}</p>
        <p><em>${this.geometry.place}</em></p>
    `;
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)