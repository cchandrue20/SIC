const router = require('express').Router();

/**
 * Test all endpoints and return their status
 * GET /api/test/endpoints
 */
router.get('/endpoints', (req, res) => {
  const endpoints = [
    // Health checks
    { method: 'GET', path: '/api/health', description: 'Health check' },
    { method: 'GET', path: '/api/db-check', description: 'MongoDB connection check' },
    
    // Auth endpoints
    { method: 'POST', path: '/api/auth/register', description: 'Register new user', requiresAuth: false },
    { method: 'POST', path: '/api/auth/login', description: 'Login user', requiresAuth: false },
    { method: 'POST', path: '/api/auth/logout', description: 'Logout user', requiresAuth: false },
    { method: 'GET', path: '/api/auth/me', description: 'Get current user', requiresAuth: true },
    { method: 'POST', path: '/api/auth/forgot-password', description: 'Forgot password', requiresAuth: false },
    { method: 'POST', path: '/api/auth/reset-password/:token', description: 'Reset password', requiresAuth: false },

    // Startup endpoints
    { method: 'GET', path: '/api/startups', description: 'Get all startups', requiresAuth: false },
    { method: 'GET', path: '/api/startups/:id', description: 'Get startup by ID', requiresAuth: false },
    { method: 'POST', path: '/api/startups', description: 'Create startup', requiresAuth: true },
    { method: 'PUT', path: '/api/startups/:id', description: 'Update startup', requiresAuth: true },
    { method: 'DELETE', path: '/api/startups/:id', description: 'Delete startup', requiresAuth: true },

    // Supporter endpoints
    { method: 'GET', path: '/api/supporters', description: 'Get all supporters', requiresAuth: false },
    { method: 'GET', path: '/api/supporters/:id', description: 'Get supporter by ID', requiresAuth: false },
    { method: 'POST', path: '/api/supporters', description: 'Create supporter', requiresAuth: true },
    { method: 'PUT', path: '/api/supporters/:id', description: 'Update supporter', requiresAuth: true },

    // Connections
    { method: 'GET', path: '/api/connections', description: 'Get connections', requiresAuth: true },
    { method: 'POST', path: '/api/connections', description: 'Create connection', requiresAuth: true },
    { method: 'PUT', path: '/api/connections/:id', description: 'Update connection', requiresAuth: true },

    // Messages
    { method: 'GET', path: '/api/messages/:connectionId', description: 'Get messages', requiresAuth: true },
    { method: 'POST', path: '/api/messages', description: 'Send message', requiresAuth: true },

    // Notifications
    { method: 'GET', path: '/api/notifications', description: 'Get notifications', requiresAuth: true },
    { method: 'PUT', path: '/api/notifications/:id', description: 'Mark notification as read', requiresAuth: true },

    // Reviews
    { method: 'GET', path: '/api/reviews/:targetId', description: 'Get reviews', requiresAuth: false },
    { method: 'POST', path: '/api/reviews', description: 'Create review', requiresAuth: true },

    // Saved startups
    { method: 'GET', path: '/api/saved', description: 'Get saved startups', requiresAuth: true },
    { method: 'POST', path: '/api/saved/:startupId', description: 'Save startup', requiresAuth: true },
    { method: 'DELETE', path: '/api/saved/:startupId', description: 'Unsave startup', requiresAuth: true },

    // Admin
    { method: 'GET', path: '/api/admin/stats', description: 'Get admin stats', requiresAuth: true },
    { method: 'GET', path: '/api/admin/users', description: 'Get all users', requiresAuth: true },
    { method: 'PUT', path: '/api/admin/users/:id', description: 'Update user', requiresAuth: true },

    // AI endpoints
    { method: 'POST', path: '/api/ai/assurance', description: 'Get investment assurance', requiresAuth: true },
  ];

  res.json({
    totalEndpoints: endpoints.length,
    endpoints: endpoints.map(ep => ({
      ...ep,
      status: 'configured'
    })),
    timestamp: new Date().toISOString()
  });
});

/**
 * Quick status check
 * GET /api/test/status
 */
router.get('/status', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const mongooseState = mongoose.connection.readyState;
    
    res.json({
      status: 'ok',
      mongodb: {
        connected: mongooseState === 1,
        state: mongooseState
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

module.exports = router;
