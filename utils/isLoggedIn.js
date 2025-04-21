const isLoggedIn = async (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash('error', 'User must be signed in.');
        return res.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn;