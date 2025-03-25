const express = require('express');
const router = express.Router();

const tradeController = require('../controllers/TradeController');

router.use('/', tradeController.Get20LastestPosts);

module.exports = router;
