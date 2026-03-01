const User = require('../models/User');
const StartupProfile = require('../models/StartupProfile');
const SupporterProfile = require('../models/SupporterProfile');

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/startups
exports.getStartups = async (req, res) => {
  try {
    const startups = await StartupProfile.find()
      .populate('user', 'email role isActive')
      .sort({ createdAt: -1 });
    res.json(startups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/startups/:id/toggle
exports.toggleStartup = async (req, res) => {
  try {
    const profile = await StartupProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Startup not found' });

    profile.isActive = !profile.isActive;
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/supporters
exports.getSupporters = async (req, res) => {
  try {
    const supporters = await SupporterProfile.find()
      .populate('user', 'email role isActive')
      .sort({ createdAt: -1 });
    res.json(supporters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/supporters/:id/toggle
exports.toggleSupporter = async (req, res) => {
  try {
    const profile = await SupporterProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Supporter not found' });

    profile.isActive = !profile.isActive;
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
