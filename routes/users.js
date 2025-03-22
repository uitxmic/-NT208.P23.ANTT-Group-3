const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UsersController');

router.use('/getUsers', usersController.GetAllUser);

router.use('/getUserById', usersController.GetUserById);

router.use('/createrUser', usersController.CreateUser);

module.exports = router;
