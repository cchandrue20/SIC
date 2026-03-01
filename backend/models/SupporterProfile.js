const mongoose = require('mongoose');

const supporterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    type: {
      type: String,
      enum: ['investor', 'technical_expert', 'both'],
      default: 'investor',
    },
    investmentMin: { type: Number, default: 0 },
    investmentMax: { type: Number, default: 0 },
    expertiseAreas: { type: String, default: '' },
    location: { type: String, default: '' },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SupporterProfile', supporterProfileSchema);
