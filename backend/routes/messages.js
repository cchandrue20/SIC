const router = require('express').Router();
const auth = require('../middleware/auth');
const { getMessages, sendMessage } = require('../controllers/messageController');

router.get('/:connectionId', auth, getMessages);
router.post('/:connectionId', auth, sendMessage);

module.exports = router;
