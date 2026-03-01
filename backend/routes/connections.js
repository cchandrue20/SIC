const router = require('express').Router();
const auth = require('../middleware/auth');
const { create, getAll, updateStatus } = require('../controllers/connectionController');

router.post('/', auth, create);
router.get('/', auth, getAll);
router.put('/:id', auth, updateStatus);

module.exports = router;
