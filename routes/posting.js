const express = require('express');
const router = express.Router();

const postingController = require('../controllers/PostingController');

router.use('/createPosting', postingController.CreatePosting);

module.exports = router;
