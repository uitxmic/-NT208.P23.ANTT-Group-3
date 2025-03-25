const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const tradeController = require('../controllers/TradeController');

router.use(authMiddleware);

router.use('/get20LatestPosts', tradeController.Get20LastestPosts);

module.exports = router;
