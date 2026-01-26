const express = require('express');
const router = express.Router();
const role = require('../middlewares/role');
const auth = require('../middlewares/auth');
const { addCategory, getCategories, viewCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Post method on /category to add new category
router.post('/category', auth, role('admin'), addCategory );

// Get method on /categories to view all categories
router.get('/categories', getCategories);

// View single category
router.get('/categories/:id', viewCategory );

// Edit/update single category
router.patch('/categories/:id', auth, role('admin'), updateCategory);

// Delete a category
router.delete('/categories/:id', auth, role('admin'), deleteCategory);

module.exports = router;
