// File: routes/notification.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');

// Sửa thành router.get()
router.get('/getNotiById/:notiId', notificationController.getNotificationById);
router.get('/get5latestnoti', notificationController.get5LatestNotifications); // Sửa tên endpoint
router.get('/orders', notificationController.getAllOrderNotifications);
router.get('/system', notificationController.getAllSystemNotifications);
router.get('/wallet', notificationController.getAllWalletNotifications);
router.get('/promotion', notificationController.getAllPromotionNotifications);

module.exports = router;