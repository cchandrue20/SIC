const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    connection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Connection',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

// One review per connection per direction
reviewSchema.index({ connection: 1, fromUser: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
