const Ariza = require('../models/Ariza');
const asyncHandler = require('express-async-handler');

const createAriza = asyncHandler(async (req, res) => {
  try {
    const { baslik, aciklama, oncelik } = req.body;

    console.log('Gelen body:', req.body);
    console.log('Gelen dosyalar:', req.files);
    console.log('Kullanıcı:', req.user);

    // Dosyalar yoksa boş dizi döner
    const dosyalar = req.files?.map(file => ({
      path: file.path,
      originalname: file.originalname
    })) || [];

    const ariza = await Ariza.create({
      user: req.user.id,
      baslik,
      aciklama,
      oncelik,
      dosyalar
    });

    res.status(201).json(ariza);

  } catch (error) {
    console.error('createAriza hata:', error);
    res.status(500).json({ message: 'Sunucu hatası: ' + error.message });
  }
});

const getMyArizalar = asyncHandler(async (req, res) => {
  const arizalar = await Ariza.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate('user', 'name email');
  
  res.json(arizalar);
});

// @desc    Tüm arıza kayıtlarını getir (admin)
// @route   GET /api/ariza/tum
// @access  Private/Admin
const getArizalar = asyncHandler(async (_req, res) => {
  try {
    const arizalar = await Ariza.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    console.log('Bulunan arıza sayısı:', arizalar.length);
    res.json(arizalar);
  } catch (error) {
    console.error('getArizalar hata:', error);
    res.status(500).json({ message: 'Kayıtlar getirilemedi: ' + error.message });
  }
});

// @desc    Arıza kaydını güncelle (admin)
// @route   PUT /api/ariza/update/:id
// @access  Private/Admin
const updateAriza = asyncHandler(async (req, res) => {
  try {
    // Frontend'den gelen adminReply'yi not olarak al
    const { durum, adminReply } = req.body;
    
    console.log('Güncelleme verileri:', { durum, adminReply, id: req.params.id });

    const ariza = await Ariza.findById(req.params.id);

    if (!ariza) {
      res.status(404);
      throw new Error('Arıza kaydı bulunamadı');
    }

    // Durum güncelleme
    if (durum) {
      ariza.durum = durum;
    }

    // Admin notu ekleme (sadece boş değilse)
    if (adminReply && adminReply.trim()) {
      ariza.adminNotlari.push({
        text: adminReply.trim(),
        createdBy: req.user.id,
        createdAt: new Date()
      });
    }

    ariza.updatedAt = Date.now();

    const updatedAriza = await ariza.save();
    
    console.log('Arıza güncellendi:', updatedAriza._id);
    res.json(updatedAriza);

  } catch (error) {
    console.error('updateAriza hata:', error);
    res.status(500).json({ message: 'Güncelleme hatası: ' + error.message });
  }
});

module.exports = {
  createAriza,
  getMyArizalar,
  getArizalar,
  updateAriza,
};