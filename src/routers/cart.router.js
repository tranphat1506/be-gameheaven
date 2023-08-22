const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/get_cart_info', cartController.getCartInfo);
router.post('/update', cartController.updateCart);

module.exports = router;
