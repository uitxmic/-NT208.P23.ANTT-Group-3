const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UsersController');

router.use('/getUsers', usersController.GetAllUser);
router.use('/getUserById', usersController.GetUserById);
router.get('/login', usersController.GetLogin);
router.use('/createUser', usersController.CreateUser);
router.post('/login', usersController.PostLogin);

router.use('/changePassword', usersController.ChangePassword);
router.use('/userbalance', usersController.GetUserBalance);
  

module.exports = router;
