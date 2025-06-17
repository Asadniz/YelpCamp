const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { cities } = require('./cities')
const seedHelpers = require('./seedHelpers');
const campground = require('../models/campground');
const maptilerClient = require("@maptiler/client");
require('dotenv').config();
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;


mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", () => {
    console.log("Database connected.");
})

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const coordinates = [68.33337541669607, 25.395392392670566];
        const name = await reverseLocation(coordinates);
        const camp = new Campground({
            title: `${seedHelpers.descriptors[rand1000 % seedHelpers.descriptors.length]} ${seedHelpers.places[rand1000 % seedHelpers.places.length]}`,
            price: Math.floor(Math.random() * 75),
            description: "Lorem Ipsum Dolor",
            geometry: { type: "Point", coordinates: [cities[rand1000].longitude, cities[rand1000].latitude], place: cities[rand1000].city + ", " + cities[rand1000].state },
            image: [{ url: 'https://res.cloudinary.com/dykrocdnq/image/upload/YelpCamp/smprh2eob7oe5gxvcdf3', filename: `img${Math.random()}` }],
            author: '6772fd72be8fe3b7ffa91555'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

const reverseLocation = async (coordinates) => {
    try {
        const result = await maptilerClient.geocoding.reverse(coordinates, { language: 'en', types: ['region', 'country'] });
        return result.features[0].place_name;
    } catch (err) {
        console.error("Geocoding failed:", err);
        return "Unknown Location"; // Fallback value
    }
};