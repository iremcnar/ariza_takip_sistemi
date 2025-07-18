// Arıza kayıtları ile ilgili API rotalarını tanımlıyor.
const express = require('express');
const router = express.Router();
const {
  createAriza,
  getMyArizalar,
  getArizalar,
  updateAriza
} = require('../controllers/arizaController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.route('/')
  .post(protect, upload.array('dosyalar', 5), createAriza)
  .get(protect, admin, getArizalar);

router.get('/benim', protect, getMyArizalar);
router.put('/:id', protect, admin, updateAriza);

module.exports = router;