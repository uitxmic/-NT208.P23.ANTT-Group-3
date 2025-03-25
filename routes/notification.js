const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const notificationController = require('../controllers/NotificationController');

//router.use(authMiddleware);

// private api
router.use('/getNotiById/:NotiId', notificationController.GetNotificationsByUserId);
router.use('/', notificationController.Get20LastestNotifications);

module.exports = router;
