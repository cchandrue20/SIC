const Review = require('../models/Review');
const Connection = require('../models/Connection');
const StartupProfile = require('../models/StartupProfile');
const SupporterProfile = require('../models/SupporterProfile');
const User = require('../models/User');
const Notification = require('../models/Notification');

// POST /api/reviews
exports.create = async (req, res) => {
  try {
    const { connectionId, rating, comment } = req.body;

    if (!connectionId || !rating) {
      return res.status(400).json({ message: 'Connection ID and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const connection = await Connection.findById(connectionId)
      .populate('startup', 'user companyName')
      .populate('supporter', 'user fullName');

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }
    if (connection.status !== 'accepted') {
      return res.status(400).json({ message: 'Connection must be accepted to leave a review' });
    }

    // Determine who the reviewer is and who they are reviewing
    const startupUserId = connection.startup.user.toString();
    const supporterUserId = connection.supporter.user.toString();
    const userId = req.user._id.toString();

    if (userId !== startupUserId && userId !== supporterUserId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const toUser = userId === startupUserId ? supporterUserId : startupUserId;

    // Check if already reviewed
    const existing = await Review.findOne({ connection: connectionId, fromUser: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this connection' });
    }

    const review = await Review.create({
      fromUser: req.user._id,
      toUser,
      connection: connectionId,
      rating,
      comment: comment || '',
    });

    // Update average rating on the reviewed user
    const reviews = await Review.find({ toUser });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(toUser, {
      averageRating: Math.round(avg * 10) / 10,
      reviewCount: reviews.length,
    });

    // Create notification for the reviewed user
    const reviewerName = userId === startupUserId
      ? connection.startup.companyName
      : connection.supporter.fullName;

    await Notification.create({
      user: toUser,
      type: 'review_received',
      referenceId: review._id,
      message: `${reviewerName} left you a ${rating}-star review`,
    });

    const populated = await review.populate([
      { path: 'fromUser', select: 'email' },
      { path: 'toUser', select: 'email' },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this connection' });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reviews (list all reviews)
exports.getAll = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('fromUser', 'email')
      .populate('toUser', 'email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reviews/user/:userId
exports.getByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ toUser: req.params.userId })
      .populate('fromUser', 'email')
      .sort({ createdAt: -1 });

    const user = await User.findById(req.params.userId).select('averageRating reviewCount');

    res.json({
      reviews,
      averageRating: user?.averageRating || 0,
      reviewCount: user?.reviewCount || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reviews/connection/:connectionId
exports.getByConnection = async (req, res) => {
  try {
    const reviews = await Review.find({ connection: req.params.connectionId })
      .populate('fromUser', 'email')
      .populate('toUser', 'email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
