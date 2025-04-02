const express = require('express');
const router = express.Router();
const newsController = require('../controllers/NewsController');

// Get all news
router.get('/', newsController.GetAllNews);

// Get news by ID
router.get('/:PostId', newsController.GetNewsById);

// Create news
router.post('/create', newsController.CreateNews);

// Update news
router.put('/update', newsController.UpdateNews);

// Deactivate news
router.put('/deactivate', newsController.DeactivateNews);

// Activate news
router.put('/activate', newsController.ActivateNews);

module.exports = router; 