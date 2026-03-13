const SavedStartup = require('../models/SavedStartup');
const SupporterProfile = require('../models/SupporterProfile');

// POST /api/saved
exports.add = async (req, res) => {
  try {
    const { startupId } = req.body;
    if (!startupId) {
      return res.status(400).json({ message: 'Startup ID is required' });
    }

    const supporterProfile = await SupporterProfile.findOne({ user: req.user._id });
    if (!supporterProfile) {
      return res.status(400).json({ message: 'Supporter profile required' });
    }

    const saved = await SavedStartup.create({
      supporter: supporterProfile._id,
      startup: startupId,
    });

    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already saved' });
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/saved/:startupId
exports.remove = async (req, res) => {
  try {
    const supporterProfile = await SupporterProfile.findOne({ user: req.user._id });
    if (!supporterProfile) {
      return res.status(400).json({ message: 'Supporter profile required' });
    }

    const result = await SavedStartup.findOneAndDelete({
      supporter: supporterProfile._id,
      startup: req.params.startupId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Saved startup not found' });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/saved
exports.getAll = async (req, res) => {
  try {
    const supporterProfile = await SupporterProfile.findOne({ user: req.user._id });
    if (!supporterProfile) {
      return res.json([]);
    }

    const saved = await SavedStartup.find({ supporter: supporterProfile._id })
      .populate({
        path: 'startup',
        populate: { path: 'user', select: 'email' },
      })
      .sort({ createdAt: -1 });

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
