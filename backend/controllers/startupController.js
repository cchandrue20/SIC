const StartupProfile = require('../models/StartupProfile');

// GET /api/startups
exports.getAll = async (req, res) => {
  try {
    const { search, location, fundingMin, fundingMax, technicalHelp } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { pitch: { $regex: search, $options: 'i' } },
      ];
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (fundingMin) {
      filter.fundingNeeded = { ...filter.fundingNeeded, $gte: Number(fundingMin) };
    }
    if (fundingMax) {
      filter.fundingNeeded = { ...filter.fundingNeeded, $lte: Number(fundingMax) };
    }
    if (technicalHelp) {
      filter.technicalHelp = { $regex: technicalHelp, $options: 'i' };
    }

    const startups = await StartupProfile.find(filter)
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    res.json(startups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/startups/:id
exports.getOne = async (req, res) => {
  try {
    const startup = await StartupProfile.findById(req.params.id).populate('user', 'email');
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json(startup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/startups
exports.create = async (req, res) => {
  try {
    const existing = await StartupProfile.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = await StartupProfile.create({ ...req.body, user: req.user._id });
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/startups/:id
exports.update = async (req, res) => {
  try {
    const profile = await StartupProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(profile, req.body);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/startups/:id  (soft delete)
exports.remove = async (req, res) => {
  try {
    const profile = await StartupProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    profile.isActive = false;
    await profile.save();
    res.json({ message: 'Profile deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/startups/:id/upload-logo
exports.uploadLogo = async (req, res) => {
  try {
    const profile = await StartupProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    profile.logo = `/uploads/${req.file.filename}`;
    await profile.save();
    res.json({ logo: profile.logo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/startups/:id/upload-pitchdeck
exports.uploadPitchDeck = async (req, res) => {
  try {
    const profile = await StartupProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    profile.pitchDeck = `/uploads/${req.file.filename}`;
    await profile.save();
    res.json({ pitchDeck: profile.pitchDeck });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
