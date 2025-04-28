const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UsersController');
const redisClient = require('../middlewares/init.redis');

router.use('/getUsers', usersController.GetAllUser);
router.use('/getUserById', usersController.GetUserById);
router.get('/login', usersController.GetLogin);
router.use('/createUser', usersController.CreateUser);
router.post('/login', usersController.PostLogin);

router.use('/changePassword', usersController.ChangePassword);
router.get('/session', usersController.GetSession);

module.exports = router;
