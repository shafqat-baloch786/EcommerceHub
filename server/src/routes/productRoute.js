const express = require("express");
const router = express.Router();
const { addProduct, viewProducts, viewProduct } = require('../controllers/productController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Post method on product to add new product
router.post('/product', auth, role('admin'), addProduct);

// Get method to view all products
router.get('/products', viewProducts);

// Get method on single product to view
router.get('/products/:id', viewProduct);


module.exports = router;