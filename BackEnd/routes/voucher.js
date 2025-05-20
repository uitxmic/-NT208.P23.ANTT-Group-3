const express = require('express');
const router = express.Router();

const usersController = require('../controllers/VoucherController');
const VoucherController = require('../controllers/VoucherController');

router.use('/getVoucherByUserId/:UserId', usersController.GetVoucherByUserId);

router.use('/giveVoucher', VoucherController.GiveVoucher);

router.use('/getValidVoucher', VoucherController.GetValidVouchers);

router.use('/getValidUserVoucher', VoucherController.GetValidUserVouchers);

router.get('/getVoucherDetail/:voucherid', VoucherController.GetDetailUserVoucher);


module.exports = router;
