const express = require('express');
const router = express.Router();

const usersController = require('../controllers/VoucherController');

router.use('/getVoucherByUserId/:UserId', usersController.GetVoucherByUserId);

module.exports = router;
