const User = require('../models/User');
const StartupProfile = require('../models/StartupProfile');
const SupporterProfile = require('../models/SupporterProfile');
const bcrypt = require('bcrypt');
const { generateToken, cookieOptions } = require('../utils/helpers');

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
