const express = require("express");
const router = express.Router();
const { addProduct, viewProducts } = require('../controllers/productController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Post method on product to add new product
router.post('/product', auth, role('admin'), addProduct);

// Get method to view all products
router.get('/products', viewProducts)


module.exports = router;