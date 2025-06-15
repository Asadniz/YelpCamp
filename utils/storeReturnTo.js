module.exports = (req, res, next) => {
    if (typeof req.session.returnTo === 'string') {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}