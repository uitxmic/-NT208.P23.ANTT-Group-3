const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const tradeController = require('../controllers/TradeController');

//router.use(authMiddleware);

router.use('/20lastestposts', tradeController.Get20LastestPosts);

router.use('/paymentbybalance', tradeController.PaymentByBalance);

module.exports = router;
