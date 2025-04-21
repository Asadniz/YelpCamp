const User = require('../models/user');

module.exports.renderRegistrationForm = (req, res) => {
    res.render('users/registrationForm');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'User registered successfully.');
            res.redirect('/campgrounds');
        })
    }
    catch (e) {
        req.flash('error', e.message + '.');
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/loginForm');
}

module.exports.loginUser = (req, res) => {
    const returnTo = res.locals.returnTo;
    console.log('successfully logged in.');
    req.flash('success', 'Welcome back ' + req.body.username + '!');
    if (returnTo) {
        res.redirect(returnTo);
    }
    else {
        res.redirect('/campgrounds');
    }
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        console.log('Logged out successfully.');
        req.flash('success', 'logged out successfully.');
        res.redirect('/campgrounds');
    })
}