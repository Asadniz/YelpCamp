const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { validateReview } = require('../schemas')
const isLoggedIn = require('../utils/isLoggedIn');
const isReviewAuthor = require('../utils/isReviewAuthor');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.postReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;