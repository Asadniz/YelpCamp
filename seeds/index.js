const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const seedHelpers = require('./seedHelpers');
const campground = require('../models/campground');

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
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${seedHelpers.descriptors[rand1000 % seedHelpers.descriptors.length]} ${seedHelpers.places[rand1000 % seedHelpers.places.length]}`,
            price: Math.floor(Math.random() * 75),
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            author: '6772fd72be8fe3b7ffa91555'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});