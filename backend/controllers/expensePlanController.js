const ExpensePlan = require('../models/ExpensePlan');
const StartupProfile = require('../models/StartupProfile');
const SupporterProfile = require('../models/SupporterProfile');
const Connection = require('../models/Connection');

// Create or Update Expense Plan Rows
exports.createOrUpdatePlan = async (req, res) => {
  try {
    const { id: startupId } = req.params;
    const { rows } = req.body; // Array of { category, plannedAmount }

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'At least one expense row is required' });
    }

    // Check if startup profile exists
    const startup = await StartupProfile.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup profile not found' });
    }

    // Authorization check
    if (startup.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this plan' });
    }

    // Validation: sum of all plannedAmounts must equal startup's investmentNeeded
    // Only validate if investmentNeeded is set
    if (startup.investmentNeeded > 0) {
      const totalPlanned = rows.reduce((sum, row) => sum + (Number(row.plannedAmount) || 0), 0);
      if (totalPlanned !== startup.investmentNeeded) {
        return res.status(400).json({
          message: `Total planned amount (₹${totalPlanned.toLocaleString('en-IN')}) must equal investment needed (₹${startup.investmentNeeded.toLocaleString('en-IN')})`,
        });
      }
    }

    // Clear existing rows and insert new ones
    await ExpensePlan.deleteMany({ startupId });
    const newRows = rows.map((row) => ({
      startupId,
      category: row.category,
      plannedAmount: Number(row.plannedAmount) || 0,
      actualAmount: 0,
    }));

    const savedPlan = await ExpensePlan.insertMany(newRows);
    res.status(200).json(savedPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Plan for a Startup (public, but actual amounts gated)
exports.getPlan = async (req, res) => {
  try {
    const { id: startupId } = req.params;
    const plan = await ExpensePlan.find({ startupId });

    // Check authorization for actualAmount visibility
    const startup = await StartupProfile.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup profile not found' });
    }

    let canSeeActual = false;

    if (req.user) {
      // Startup owner can always see actuals
      if (startup.user.toString() === req.user.id) {
        canSeeActual = true;
      } else if (req.user.role === 'supporter') {
        // Supporters with accepted connections can see actuals
        const supporterProfile = await SupporterProfile.findOne({ user: req.user.id });
        if (supporterProfile) {
          const connection = await Connection.findOne({
            startup: startupId,
            supporter: supporterProfile._id,
            status: 'accepted',
          });
          if (connection) canSeeActual = true;
        }
      }
    }

    if (!canSeeActual) {
      // Return plan without actual amounts for public/non-connected users
      const publicPlan = plan.map(item => ({
        _id: item._id,
        startupId: item.startupId,
        category: item.category,
        plannedAmount: item.plannedAmount,
        actualAmount: 0,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      return res.status(200).json(publicPlan);
    }

    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Actual Amount per category
exports.updateActual = async (req, res) => {
  try {
    const { id: startupId, planId } = req.params;
    const { actualAmount } = req.body;

    const startup = await StartupProfile.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup profile not found' });
    }

    // Authorization: Only the startup owner can update actualAmount
    if (startup.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update actual spend' });
    }

    const updatedRow = await ExpensePlan.findOneAndUpdate(
      { _id: planId, startupId },
      { actualAmount: Number(actualAmount) || 0 },
      { new: true }
    );

    if (!updatedRow) {
      return res.status(404).json({ message: 'Expense plan row not found' });
    }

    res.status(200).json(updatedRow);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Funding Progress Stats (public endpoint)
exports.getFundingProgress = async (req, res) => {
  try {
    const { id: startupId } = req.params;

    const startup = await StartupProfile.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup profile not found' });
    }

    // Find all accepted connections for this startup
    const acceptedConnections = await Connection.find({
      startup: startupId,
      status: 'accepted',
    }).populate('supporter', 'fullName');

    // Total Interested = sum of interestedAmount from all accepted connections
    const totalInterested = acceptedConnections.reduce(
      (sum, conn) => sum + (conn.interestedAmount || 0),
      0
    );

    const investmentNeeded = startup.investmentNeeded || 0;
    const remaining = Math.max(0, investmentNeeded - totalInterested);
    const percentage = investmentNeeded > 0
      ? (totalInterested / investmentNeeded) * 100
      : 0;

    const investors = acceptedConnections
      .filter((c) => c.interestedAmount > 0)
      .map((c) => ({
        name: c.supporter?.fullName || 'Anonymous Investor',
        amount: c.interestedAmount,
      }));

    res.status(200).json({
      investmentNeeded,
      totalInterested,
      remaining,
      percentage: Math.min(100, percentage),
      investors,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
