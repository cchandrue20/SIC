const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {
  getUsers,
  updateUser,
  getStartups,
  toggleStartup,
  getSupporters,
  toggleSupporter,
  getUserStats,
  getConnectionStats,
  getTagStats,
} = require('../controllers/adminController');

router.use(auth, role('admin'));

router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/startups', getStartups);
router.put('/startups/:id/toggle', toggleStartup);
router.get('/supporters', getSupporters);
router.put('/supporters/:id/toggle', toggleSupporter);

// Analytics
router.get('/stats/users', getUserStats);
router.get('/stats/connections', getConnectionStats);
router.get('/stats/tags', getTagStats);

module.exports = router;
