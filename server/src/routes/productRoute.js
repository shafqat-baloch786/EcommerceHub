const express = require("express");
const router = express.Router();
const { addProduct } = require('../controllers/productController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Post method on product to add new product
router.post('/product', auth, role('admin'), addProduct);


module.exports = router;