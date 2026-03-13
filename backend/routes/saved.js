const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { add, remove, getAll } = require('../controllers/savedController');

router.post('/', auth, role('supporter'), add);
router.delete('/:startupId', auth, role('supporter'), remove);
router.get('/', auth, role('supporter'), getAll);

module.exports = router;
