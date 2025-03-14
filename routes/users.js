const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UsersController');

router.use('/getUsers', usersController.GetAllUser);

router.use('/getUserById', usersController.GetUserById);

module.exports = router;
