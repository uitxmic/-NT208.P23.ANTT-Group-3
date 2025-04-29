const express = require('express');
const router = express.Router();
const searchController = require('../controllers/SearchController');

// Tìm kiếm voucher
router.get('/vouchers', searchController.SearchVouchers);

// Tìm kiếm bài đăng
router.get('/posts', searchController.SearchPosts);

// Tìm kiếm người dùng
router.get('/users', searchController.SearchUsers);

module.exports = router;