const User = require('../models/User');
const StartupProfile = require('../models/StartupProfile');
const SupporterProfile = require('../models/SupporterProfile');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateToken, cookieOptions } = require('../utils/helpers');
const { sendPasswordResetEmail } = require('../utils/emailService');

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const validRoles = ['startup', 'supporter'];
    const userRole = validRoles.includes(role) ? role : 'startup';

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role: userRole });

    const token = generateToken(user._id);
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, cookieOptions);

    res.json({
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    let profile = null;

    if (user.role === 'startup') {
      profile = await StartupProfile.findOne({ user: user._id });
    } else if (user.role === 'supporter') {
      profile = await SupporterProfile.findOne({ user: user._id });
    }

    res.json({
      user: { id: user._id, email: user.email, role: user.role },
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal whether the email exists
      return res.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    res.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
