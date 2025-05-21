const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const tradeController = require('../controllers/TradeController');

//router.use(authMiddleware);

router.use('/20lastestposts', tradeController.Get20LastestPosts);

router.use('/createTransaction', tradeController.CreateTransaction);

router.use("/createCartTransaction", tradeController.CreateCartTransaction);

router.use('/getTransactionForAdmin', tradeController.GetTransactionForAdmin);

router.use('/completeTransaction', tradeController.CompleteTransaction);

router.use('/acceptRefund', tradeController.AcceptRefund);

router.use('/rejectRefund', tradeController.RejectRefund);

module.exports = router;
