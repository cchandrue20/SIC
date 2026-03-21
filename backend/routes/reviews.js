const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAll, create, getByUser, getByConnection } = require('../controllers/reviewController');

router.get('/', getAll);
router.post('/', auth, create);
router.get('/user/:userId', getByUser);
router.get('/connection/:connectionId', auth, getByConnection);

module.exports = router;
