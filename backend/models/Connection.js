const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema(
  {
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StartupProfile',
      required: true,
    },
    supporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SupporterProfile',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'archived'],
      default: 'pending',
    },
    initialMessage: { type: String, default: '' },
    interestedAmount: { type: Number, default: 0 }, // amount supporter is willing to invest
  },
  { timestamps: true }
);

// Prevent duplicate connections
connectionSchema.index({ startup: 1, supporter: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);
