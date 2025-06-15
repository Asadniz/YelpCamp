module.exports = function isValidHttpUrl(string) {
    return typeof string === 'string' && (string.startsWith('/campgrounds') ||
        string.startsWith('/login') ||
        string.startsWith('/register'));
}
