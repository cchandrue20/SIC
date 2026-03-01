const mongoose = require('mongoose');

const startupProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    pitch: { type: String, default: '' },
    fundingNeeded: { type: Number, default: 0 },
    technicalHelp: { type: String, default: '' },
    website: { type: String, default: '' },
    location: { type: String, default: '' },
    logo: { type: String, default: '' },
    pitchDeck: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StartupProfile', startupProfileSchema);
