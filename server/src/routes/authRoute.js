const express = require('express');
const router = express.Router();
const { register, login, me, editMe } = require('../controllers/authController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Post method on register
router.post('/register', register);

// Post method on login
router.post('/login', login);

// Get method on me
router.get('/me', auth, me );

// Patch/edit method on me
router.patch('/me', auth, editMe);
module.exports = router;