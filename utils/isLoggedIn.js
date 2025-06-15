const isLoggedIn = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'User must be signed in.');
        return res.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn;