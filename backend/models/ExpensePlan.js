const mongoose = require('mongoose');

const expensePlanSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StartupProfile',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Product Development',
        'Marketing',
        'Infrastructure',
        'Salaries',
        'Legal & Misc',
        'Other',
      ],
    },
    plannedAmount: { type: Number, required: true },
    actualAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExpensePlan', expensePlanSchema);
