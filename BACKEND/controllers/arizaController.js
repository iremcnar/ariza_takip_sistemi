const Ariza = require('../models/Ariza');
const asyncHandler = require('express-async-handler');

// @desc    Yeni arıza kaydı oluştur
// @route   POST /api/ariza
// @access  Private
const createAriza = asyncHandler(async (req, res) => {
  try {
    const { baslik, aciklama, oncelik } = req.body;

    console.log('Gelen body:', req.body);
    console.log('Gelen dosyalar:', req.files);  // Multer ile yüklenen dosyalar
    console.log('Kullanıcı:', req.user);

    // Dosyalar yoksa boş dizi döner
    const dosyalar = req.files?.map(file => ({
      path: file.path,             // Multer'ın kaydettiği dosya yolu
      originalname: file.originalname // Orijinal dosya adı
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

// @desc    Kullanıcının arıza kayıtlarını getir
// @route   GET /api/ariza/benim
// @access  Private
const getMyArizalar = asyncHandler(async (req, res) => {
  const arizalar = await Ariza.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate('user', 'name email');

  res.json(arizalar);
});

// @desc    Tüm arıza kayıtlarını getir (admin)
// @route   GET /api/ariza
// @access  Private/Admin
const getArizalar = asyncHandler(async (req, res) => {
  const arizalar = await Ariza.find()
    .sort({ createdAt: -1 })
    .populate('user', 'name email');
  res.json(arizalar);
});

// @desc    Arıza kaydını güncelle (admin)
// @route   PUT /api/ariza/:id
// @access  Private/Admin
const updateAriza = asyncHandler(async (req, res) => {
  const { durum, not } = req.body;

  const ariza = await Ariza.findById(req.params.id);

  if (!ariza) {
    res.status(404);
    throw new Error('Arıza kaydı bulunamadı');
  }

  if (durum) {
    ariza.durum = durum;
  }

  if (not) {
    ariza.adminNotlari.push({
      text: not,
      createdBy: req.user.id
    });
  }

  ariza.updatedAt = Date.now();

  const updatedAriza = await ariza.save();

  res.json(updatedAriza);
});

module.exports = {
  createAriza,
  getMyArizalar,
  getArizalar,
  updateAriza
};
