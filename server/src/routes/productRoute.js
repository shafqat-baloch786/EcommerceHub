const express = require("express");
const router = express.Router();
const { addProduct, viewProducts, viewProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Post method on product to add new product
router.post('/product', auth, role('admin'), addProduct);

// Get method to view all products
router.get('/products', viewProducts);

// Get method on single product to view
router.get('/products/:id', viewProduct);

// Edit/update single product
router.patch('/products/:id', auth, role('admin'), updateProduct);

// Delete a product
router.delete('/products/:id', auth, role('admin'), deleteProduct);


module.exports = router;