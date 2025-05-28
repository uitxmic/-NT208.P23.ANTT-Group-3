const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UsersController');

router.use('/getUsers', usersController.GetAllUser);
router.get('/getUserById', usersController.GetUserById);
router.get('/getUserById/:id', usersController.GetUserById);
router.get('/login', usersController.GetLogin);
router.post('/login', usersController.PostLogin);
router.use('/createUser', usersController.CreateUser);


router.use('/changePassword', usersController.ChangePassword);
router.use('/userbalance', usersController.GetUserBalance);
router.use('/updateUser', usersController.UpdateUser);
  
router.get('/session', usersController.GetSession);

module.exports = router;
