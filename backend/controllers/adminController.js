const User = require('../models/User');
const StartupProfile = require('../models/StartupProfile');
const SupporterProfile = require('../models/SupporterProfile');
const Connection = require('../models/Connection');

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

// ============ Analytics Endpoints (Feature 8) ============

// GET /api/admin/stats/users – daily new user counts for last 30 days
exports.getUserStats = async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Also get totals
    const totalUsers = await User.countDocuments();
    const totalStartups = await StartupProfile.countDocuments();
    const totalSupporters = await SupporterProfile.countDocuments();

    res.json({
      daily: stats.map(s => ({ date: s._id, count: s.count })),
      totals: { users: totalUsers, startups: totalStartups, supporters: totalSupporters },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/stats/connections – daily connection counts for last 30 days
exports.getConnectionStats = async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await Connection.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    // Reshape data
    const byDate = {};
    stats.forEach(s => {
      if (!byDate[s._id.date]) {
        byDate[s._id.date] = { date: s._id.date, pending: 0, accepted: 0, rejected: 0 };
      }
      byDate[s._id.date][s._id.status] = s.count;
    });

    const totalConnections = await Connection.countDocuments();
    const accepted = await Connection.countDocuments({ status: 'accepted' });
    const pending = await Connection.countDocuments({ status: 'pending' });

    res.json({
      daily: Object.values(byDate),
      totals: { total: totalConnections, accepted, pending },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/stats/tags – tag frequency from startup profiles
exports.getTagStats = async (req, res) => {
  try {
    const stats = await StartupProfile.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    res.json(stats.map(s => ({ tag: s._id, count: s.count })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
