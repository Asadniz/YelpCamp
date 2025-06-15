const express = require('express');
const router = express.Router();
const campground = require('../controllers/campground');
const catchAsync = require('../utils/catchAsync');
const { validateCampground } = require('../schemas')
const isLoggedIn = require('../utils/isLoggedIn');
const campgroundExists = require('../utils/campgroundExists');
const isAuthor = require('../utils/isAuthor');
const storeReturnTo = require('../utils/storeReturnTo');
const multer = require('multer');
const { cloudinaryStorage } = require('../cloudinary/index');

const upload = multer({ storage: cloudinaryStorage });

router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.createCampground));
router.get('/new', isLoggedIn, campground.renderCreateCampground);

router.route('/:id')
    .get(campgroundExists, catchAsync(campground.renderCampground))
    .put(isLoggedIn, campgroundExists, storeReturnTo, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, campgroundExists, storeReturnTo, isAuthor, catchAsync(campground.deleteCampground));

router.route('/updateCampground/:id')
    .get(isLoggedIn, campgroundExists, storeReturnTo, isAuthor, catchAsync(campground.renderUpdateCampground))
    .delete()

module.exports = router;