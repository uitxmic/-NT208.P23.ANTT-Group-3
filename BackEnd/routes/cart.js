const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const cartController = require('../controllers/CartController');

//router.use(authMiddleware);

router.get('/getCart', cartController.GetCart);
router.post('/addToCart', cartController.AddToCart);
router.post('/updateCart', cartController.UpdateCart);

module.exports = router;