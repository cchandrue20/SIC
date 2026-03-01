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
  uploadLogo,
  uploadPitchDeck,
} = require('../controllers/startupController');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', auth, role('startup'), create);
router.put('/:id', auth, role('startup'), update);
router.delete('/:id', auth, role('startup'), remove);
router.post('/:id/upload-logo', auth, role('startup'), upload.single('logo'), uploadLogo);
router.post('/:id/upload-pitchdeck', auth, role('startup'), upload.single('pitchDeck'), uploadPitchDeck);

module.exports = router;
