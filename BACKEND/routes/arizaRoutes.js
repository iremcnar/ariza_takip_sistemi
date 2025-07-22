// 1. Önce importları yap
const express = require('express');
const router = express.Router();

const {
  createAriza,
  getMyArizalar,
  getArizalar,
  updateAriza,
} = require('../controllers/arizaController');

const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const upload = require('../middleware/upload');

// 2. Sonra console.log ile tipi kontrol et
console.log('protect:', typeof protect);
console.log('admin:', typeof admin);
console.log('upload:', typeof upload);
console.log('createAriza:', typeof createAriza);
console.log('getMyArizalar:', typeof getMyArizalar);
console.log('getArizalar:', typeof getArizalar);
console.log('updateAriza:', typeof updateAriza);

// 3. Router tanımlamaları
router
  .route('/')
  .post(protect, upload.array('dosyalar', 5), createAriza)
  .get(protect, admin, getArizalar);

router.get('/benim', protect, getMyArizalar);

router.put('/:id', protect, admin, updateAriza);

module.exports = router;
