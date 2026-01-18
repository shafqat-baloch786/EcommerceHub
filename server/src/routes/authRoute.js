const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');

// Post method on register
router.post('/register', register);


module.exports = router;