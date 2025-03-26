const express = require('express');
const router = express.Router();
const unifiedController = require('../controllers/UnifiedController');

// Unified search v� filter cho b�i ??ng
router.get('/posts/unified', unifiedController.searchAndFilterPosts);

module.exports = router;