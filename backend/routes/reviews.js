const router = require('express').Router();
const auth = require('../middleware/auth');
const { create, getByUser, getByConnection } = require('../controllers/reviewController');

router.post('/', auth, create);
router.get('/user/:userId', getByUser);
router.get('/connection/:connectionId', auth, getByConnection);

module.exports = router;
