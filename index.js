if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const campRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const User = require('./models/user');
const flash = require('connect-flash')
const passport = require('passport');
const pLocal = require('passport-local');
const returnToHandler = require('./utils/returnToHandler');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoStore = require('connect-mongo');
const dbURL = 'mongodb://localhost:27017/yelpcamp';

const store = MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

const sessionConfig = ({
    name: "Session",
    store: store,
    secret: process.env.SESSION_SECRET || 'notreallyasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Enable secure cookies in production
    }
})


store.on('error', function (e) {
    console.log("Error:", e);
})

mongoose.connect(dbURL, {})

const app = express(); // Fixed: added 'const'

// Remove charset middleware that might interfere
// app.use((req, res, next) => {
//     res.charset = 'utf-8';
//     next();
// });

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://cdn.maptiler.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://cdn.maptiler.com/",
    "https://api.maptiler.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
    "https://cdn.maptiler.com/",
];
const fontSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/"
];

// Temporarily disable CSP to troubleshoot CSS issues
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:", "data:", ...connectSrcUrls],
            childSrc: ["'self'", "blob:", "data:"],
            objectSrc: ["'none'"],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dykrocdnq/", // Allow all Cloudinary accounts
                "https://picsum.photos/", // Allow Lorem Picsum images
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
                "https://cdn.maptiler.com/",
                "https://*.tiles.mapbox.com/",
                "https://a.tiles.mapbox.com/",
                "https://b.tiles.mapbox.com/",
            ],
            fontSrc: ["'self'", "data:", ...fontSrcUrls],
            frameSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"]
        },
    })
);

// Basic security headers only
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new pLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
});

app.use(returnToHandler);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", () => {
    console.log("Database connected.");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', userRoutes);
app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/reviews/', reviewRoutes);

app.get('/', (req, res, next) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Error 404: Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Bad Gateway"
    }
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("On port 3000")
})