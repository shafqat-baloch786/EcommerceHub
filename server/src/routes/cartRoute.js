const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { addToCart, getCart } = require('../controllers/cartController');

// Add product to cart
// POST /api/cart
router.post('/add-cart', auth, addToCart);

// Get cart items
router.get('/cart', auth, getCart )

module.exports = router;
