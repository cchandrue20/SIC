const Connection = require('../models/Connection');
const StartupProfile = require('../models/StartupProfile');
const SupporterProfile = require('../models/SupporterProfile');
const Notification = require('../models/Notification');
const {
  sendConnectionRequestEmail,
  sendConnectionAcceptedEmail,
  sendConnectionRejectedEmail,
} = require('../utils/emailService');

// POST /api/connections  – supporter expresses interest in a startup
exports.create = async (req, res) => {
  try {
    const { startupId, initialMessage } = req.body;

    // Find the supporter's profile
    const supporterProfile = await SupporterProfile.findOne({ user: req.user._id });
    if (!supporterProfile) {
      return res.status(400).json({ message: 'Supporter profile required' });
    }

    // Verify startup exists
    const startupProfile = await StartupProfile.findById(startupId).populate('user', 'email');
    if (!startupProfile) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    // Check duplicate
    const existing = await Connection.findOne({
      startup: startupId,
      supporter: supporterProfile._id,
    });
    if (existing) {
      return res.status(400).json({ message: 'Connection already exists' });
    }

    const connection = await Connection.create({
      startup: startupId,
      supporter: supporterProfile._id,
      initialMessage: initialMessage || '',
    });

    const populated = await connection.populate([
      { path: 'startup', populate: { path: 'user', select: 'email' } },
      { path: 'supporter', populate: { path: 'user', select: 'email' } },
    ]);

    // Send email notification to startup owner
    sendConnectionRequestEmail(
      startupProfile.user.email,
      startupProfile.companyName,
      supporterProfile.fullName
    );

    // Create in-app notification for startup owner
    Notification.create({
      user: startupProfile.user._id,
      type: 'connection_request',
      referenceId: connection._id,
      message: `${supporterProfile.fullName} expressed interest in ${startupProfile.companyName}`,
    }).catch(err => console.error('Notification error:', err.message));

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/connections  – list connections for the logged-in user
exports.getAll = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'startup') {
      const profile = await StartupProfile.findOne({ user: req.user._id });
      if (!profile) return res.json([]);
      filter.startup = profile._id;
    } else if (req.user.role === 'supporter') {
      const profile = await SupporterProfile.findOne({ user: req.user._id });
      if (!profile) return res.json([]);
      filter.supporter = profile._id;
    }

    const connections = await Connection.find(filter)
      .populate({ path: 'startup', populate: { path: 'user', select: 'email' } })
      .populate({ path: 'supporter', populate: { path: 'user', select: 'email' } })
      .sort({ createdAt: -1 });

    res.json(connections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/connections/:id  – accept / reject / archive
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['accepted', 'rejected', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const connection = await Connection.findById(req.params.id)
      .populate('startup')
      .populate('supporter');

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Only startup owner can accept/reject; either party can archive
    if (status === 'accepted' || status === 'rejected') {
      if (connection.startup.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only the startup can accept or reject' });
      }
    }

    if (status === 'archived') {
      const isStartup = connection.startup.user.toString() === req.user._id.toString();
      const isSupporter = connection.supporter.user.toString() === req.user._id.toString();
      if (!isStartup && !isSupporter) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    connection.status = status;
    await connection.save();

    const populated = await connection.populate([
      { path: 'startup', populate: { path: 'user', select: 'email' } },
      { path: 'supporter', populate: { path: 'user', select: 'email' } },
    ]);

    // Send email and in-app notification to supporter
    const supporterEmail = populated.supporter.user.email;
    const startupName = populated.startup.companyName;
    const supporterName = populated.supporter.fullName;

    if (status === 'accepted') {
      sendConnectionAcceptedEmail(supporterEmail, startupName, supporterName);
      Notification.create({
        user: populated.supporter.user._id,
        type: 'connection_accepted',
        referenceId: connection._id,
        message: `${startupName} accepted your connection request`,
      }).catch(err => console.error('Notification error:', err.message));
    } else if (status === 'rejected') {
      sendConnectionRejectedEmail(supporterEmail, startupName, supporterName);
      Notification.create({
        user: populated.supporter.user._id,
        type: 'connection_rejected',
        referenceId: connection._id,
        message: `${startupName} declined your connection request`,
      }).catch(err => console.error('Notification error:', err.message));
    }

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
