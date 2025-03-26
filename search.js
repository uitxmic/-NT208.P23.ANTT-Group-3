const express = require('express');
const router = express.Router();
const unifiedController = require('../controllers/UnifiedController');

// Unified search và filter cho bài ??ng
router.get('/posts/unified', unifiedController.searchAndFilterPosts);

module.exports = router;