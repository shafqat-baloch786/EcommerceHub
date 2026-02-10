const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { addToCart } = require('../controllers/cartController');

// Add product to cart
// POST /api/cart
router.post('/cart', auth, addToCart);

module.exports = router;
