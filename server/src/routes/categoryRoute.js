const express = require('express');
const router = express.Router();
const role = require('../middlewares/role');
const auth = require('../middlewares/auth');
const { addCategory, getCategories, viewCategory } = require('../controllers/categoryController');

// Post method on /category to add new category
router.post('/category', auth, role('admin'), addCategory );

// Get method on /categories to view all categories
router.get('/categories', getCategories);

// View single category
router.get('/categories/:id', viewCategory );


module.exports = router;
