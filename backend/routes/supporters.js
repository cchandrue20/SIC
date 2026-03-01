const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');
const {
  getAll,
  getOne,
  create,
  update,
  remove,
  uploadAvatar,
} = require('../controllers/supporterController');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', auth, role('supporter'), create);
router.put('/:id', auth, role('supporter'), update);
router.delete('/:id', auth, role('supporter'), remove);
router.post('/:id/upload-avatar', auth, role('supporter'), upload.single('avatar'), uploadAvatar);

module.exports = router;
