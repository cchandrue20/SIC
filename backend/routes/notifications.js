const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAll, markRead, markAllRead } = require('../controllers/notificationController');

router.get('/', auth, getAll);
router.put('/read-all', auth, markAllRead);
router.put('/:id/read', auth, markRead);

module.exports = router;
