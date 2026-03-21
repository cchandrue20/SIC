const router = require('express').Router();
const auth = require('../middleware/auth');

const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { generateToken, cookieOptions } = require('../utils/helpers');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
