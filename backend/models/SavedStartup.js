const mongoose = require('mongoose');

const savedStartupSchema = new mongoose.Schema(
  {
    supporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SupporterProfile',
      required: true,
    },
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StartupProfile',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate saves
savedStartupSchema.index({ supporter: 1, startup: 1 }, { unique: true });

module.exports = mongoose.model('SavedStartup', savedStartupSchema);
