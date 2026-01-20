const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Post method on register
router.post('/register', register);

// Post method on login
router.post('/login', login);

module.exports = router;