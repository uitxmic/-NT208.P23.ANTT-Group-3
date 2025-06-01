const express = require('express');
const router = express.Router();

const ratingController = require('../controllers/RatingController');

router.post('/addRating', ratingController.AddRating);

module.exports = router;