const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UsersController');

router.use('/getUsers', usersController.GetAllUser);
router.use('/getUserById', usersController.GetUserById);

router.use('/createUser', usersController.CreateUser);
router.use('/login', usersController.Login);

router.use('/changePassword', usersController.ChangePassword);
  

module.exports = router;
