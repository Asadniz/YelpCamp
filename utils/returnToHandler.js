module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Store the current URL in the session if it's not already stored
        if (req.method === 'GET' && typeof req.originalUrl === 'string' &&
            !['/login', '/register'].includes(req.originalUrl)) {
            req.session.returnTo = req.originalUrl;
        }
    }
    next();
};
