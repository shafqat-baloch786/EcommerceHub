const express = require('express');
const router = express.Router();
const role = require('../middlewares/role');
const auth = require('../middlewares/auth');
const { addCategory } = require('../controllers/categoryController');


router.post('/category', auth, role('admin'), addCategory );


module.exports = router;
