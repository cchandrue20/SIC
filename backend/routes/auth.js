const router = require('express').Router();
const auth = require('../middleware/auth');
const verifyRecaptcha = require('../middleware/verifyRecaptcha');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { generateToken, cookieOptions } = require('../utils/helpers');

router.post('/register', verifyRecaptcha, register);
router.post('/login', verifyRecaptcha, login);
router.post('/logout', logout);
router.get('/me', auth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// ---------- Social Login (Google) ----------
try {
  const passport = require('../config/passport');

  if (process.env.GOOGLE_CLIENT_ID) {
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
    router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }),
      (req, res) => {
        const token = generateToken(req.user._id);
        res.cookie('token', token, cookieOptions);
        res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
      }
    );
  }
} catch (err) {
  console.log('[Auth] Social login not configured:', err.message);
}

module.exports = router;
