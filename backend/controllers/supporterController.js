const SupporterProfile = require('../models/SupporterProfile');

// GET /api/supporters
exports.getAll = async (req, res) => {
  try {
    const { search, location, type, expertiseAreas } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (type) {
      filter.type = type;
    }
    if (expertiseAreas) {
      filter.expertiseAreas = { $regex: expertiseAreas, $options: 'i' };
    }

    const supporters = await SupporterProfile.find(filter)
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    res.json(supporters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/supporters/:id
exports.getOne = async (req, res) => {
  try {
    const supporter = await SupporterProfile.findById(req.params.id).populate('user', 'email');
    if (!supporter) return res.status(404).json({ message: 'Supporter not found' });
    res.json(supporter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/supporters
exports.create = async (req, res) => {
  try {
    const existing = await SupporterProfile.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = await SupporterProfile.create({ ...req.body, user: req.user._id });
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/supporters/:id
exports.update = async (req, res) => {
  try {
    const profile = await SupporterProfile.findById(req.params.id);
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

// DELETE /api/supporters/:id  (soft delete)
exports.remove = async (req, res) => {
  try {
    const profile = await SupporterProfile.findById(req.params.id);
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

// POST /api/supporters/:id/upload-avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const profile = await SupporterProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    profile.avatar = `/uploads/${req.file.filename}`;
    await profile.save();
    res.json({ avatar: profile.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
