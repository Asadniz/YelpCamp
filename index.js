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

const sessionConfig = ({
    secret: 'notreallyasecret', resave: false, saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true }
})

mongoose.connect('mongodb://localhost:27017/yelpcamp', {})

app = express();
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(flash());

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