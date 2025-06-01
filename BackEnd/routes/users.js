const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UsersController');

router.use('/getUsers', usersController.GetAllUser);
router.get('/getUserById', usersController.GetUserById);
router.get('/getUserById/:id', usersController.GetUserById);
router.get('/login', usersController.GetLogin);
router.post('/login', usersController.PostLogin);
router.use('/createUser', usersController.CreateUser);

router.use('/forgot-password', usersController.ForgotPassword);
router.use('/changePassword', usersController.ChangePassword);
router.use('/userbalance', usersController.GetUserBalance);
router.use('/updateUser', usersController.UpdateUser);


module.exports = router;
