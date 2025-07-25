const express = require('express');
const router = express.Router();



console.log('🚀 arizaRoutes.js dosyası yüklendi');

// Debug middleware - her route'tan önce çalışır
router.use((req, res, next) => {
  console.log(`📋 Ariza router: ${req.method} ${req.path} - URL: ${req.url}`);
  next();
});

const {
  createAriza,
  getMyArizalar,
  getArizalar,
  updateAriza
} = require('../controllers/arizaController');

const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');


console.log('protect:', typeof protect);
console.log('admin:', typeof admin);
console.log('upload:', typeof upload);
console.log('createAriza:', typeof createAriza);
console.log('getMyArizalar:', typeof getMyArizalar);
console.log('getArizalar:', typeof getArizalar);
console.log('updateAriza:', typeof updateAriza);

// Test route (isteğe bağlı, development için)
if (process.env.NODE_ENV !== 'production') {
  router.get('/test', (req, res) => {
    console.log('✅ Test route çalıştı');
    res.json({ message: 'Ariza routes çalışıyor!', timestamp: new Date() });
  });
}

// ------------------------
// Tüm arıza kayıtlarını getir (admin yetkili)
router.get('/arizalar', protect, admin, getArizalar);

// ------------------------
// Kullanıcının kendi arızalarını getir
router.get('/benim', protect, getMyArizalar);

// ------------------------
// Arıza güncelleme (admin)
router.put('/update/:id', protect, admin, updateAriza);

// ------------------------
// Arıza oluşturma (kullanıcı)
router.post('/', protect, upload.array('dosyalar', 5), createAriza);

module.exports = router;
