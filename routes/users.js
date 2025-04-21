const express = require('express');
const router = express.Router();
const user = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const storeReturnTo = require('../utils/storeReturnTo');

router.route('/register')
    .get(user.renderRegistrationForm)
    .post(catchAsync(user.registerUser));

router.route('/login')
    .get(user.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser)

router.get('/logout', user.logoutUser);

module.exports = router;