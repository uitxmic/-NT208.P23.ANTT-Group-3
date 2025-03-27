const express = require('express');
const router = express.Router();

const usersController = require('../controllers/VoucherController');
const VoucherController = require('../controllers/VoucherController');

router.use('/getVoucherByUserId/:UserId', usersController.GetVoucherByUserId);

router.use('/giveVoucher', VoucherController.GiveVoucher);

module.exports = router;
