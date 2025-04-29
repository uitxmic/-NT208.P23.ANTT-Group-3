const express = require('express');
const router = express.Router();

const googleCloudController = require('../controllers/GoogleCloudController');

router.use('/signInWithGoogle', googleCloudController.GoogleLogin);

module.exports = router;