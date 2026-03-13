const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['startup', 'supporter', 'admin'],
      default: 'startup',
    },
    isActive: { type: Boolean, default: true },
    // Password reset
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    // Ratings
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
