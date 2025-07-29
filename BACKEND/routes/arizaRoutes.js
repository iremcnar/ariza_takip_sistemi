const express = require('express');
const router = express.Router();

const Ariza = require('../models/Ariza');  // Model importu eklendi
const {
  createAriza,
  getMyArizalar,
  getArizalar,
  updateAriza
} = require('../controllers/arizaController');

const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');

console.log('🚀 arizaRoutes.js dosyası yüklendi');

// Debug middleware - her route'tan önce çalışır
router.use((req, res, next) => {
  console.log(`📋 Ariza router: ${req.method} ${req.path} - URL: ${req.url}`);
  next();
});

// Test route (isteğe bağlı, development için)
if (process.env.NODE_ENV !== 'production') {
  router.get('/test', (req, res) => {
    console.log('✅ Test route çalıştı');
    res.json({ message: 'Ariza routes çalışıyor!', timestamp: new Date() });
  });
}

// ------------------------
// Tüm arıza kayıtlarını getir (admin yetkili) - limit parametresi destekli
router.get('/arizalar', protect, admin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;

    let query = Ariza.find().sort({ createdAt: -1 }).populate('user', 'name email');
    if (limit > 0) {
      query = query.limit(limit);
    }

    const arizalar = await query;
    res.status(200).json(arizalar);
  } catch (error) {
    console.error('Arıza kayıtları getirme hatası:', error);
    res.status(500).json({ success: false, message: 'Arıza kayıtları getirilemedi: ' + error.message });
  }
});

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
