const express = require('express');
const router = express.Router();
const expensePlanController = require('../controllers/expensePlanController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Optional auth: attach user if token present, but don't block if not
const optionalAuth = async (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (_) {
    // Silently ignore invalid tokens for optional auth
  }
  next();
};

router.post(
  '/startups/:id/expense-plan',
  auth,
  role('startup'),
  expensePlanController.createOrUpdatePlan
);

// Public (with optional auth for actual amount visibility)
router.get(
  '/startups/:id/expense-plan',
  optionalAuth,
  expensePlanController.getPlan
);

router.put(
  '/startups/:id/expense-plan/:planId',
  auth,
  role('startup'),
  expensePlanController.updateActual
);

// Public endpoint - anyone can see funding progress
router.get(
  '/startups/:id/funding-progress',
  optionalAuth,
  expensePlanController.getFundingProgress
);

module.exports = router;
