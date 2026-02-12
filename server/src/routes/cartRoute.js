const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { addToCart, getCart, updateCartItem, removeCartItem } = require('../controllers/cartController');

// Add product to cart
// POST /api/cart
router.post('/add-cart', auth, addToCart);

// Get cart items
router.get('/cart', auth, getCart);

// Update cart items
router.post('/update-cart', auth, updateCartItem);

// Remove cart items
router.delete('/cart/:productId', auth, removeCartItem);

module.exports = router;
