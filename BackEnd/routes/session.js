const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/SessionController');

router.get('/', sessionController.getSession);
router.delete('/', sessionController.destroySession);
router.get('/userRoleId', sessionController.getUserRoleId);