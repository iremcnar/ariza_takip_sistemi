const Destek = require('../models/Destek');
const asyncHandler = require('express-async-handler');

// @desc    Yeni destek mesajı oluştur
// @route   POST /api/destek
// @access  Private
const createDestek = asyncHandler(async (req, res) => {
  const { mesaj } = req.body;

  const destek = await Destek.create({
    user: req.user.id,
    mesaj
  });

  res.status(201).json(destek);
});

// @desc    Kullanıcının destek mesajlarını getir
// @route   GET /api/destek/benim
// @access  Private
const getMyDestekler = asyncHandler(async (req, res) => {
  const destekler = await Destek.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate('user', 'name email');

  res.json(destekler);
});

// @desc    Tüm destek mesajlarını getir (admin)
// @route   GET /api/destek
// @access  Private/Admin
const getDestekler = asyncHandler(async (req, res) => {
  console.log('Admin destek mesajları talebi geldi.');
  const destekler = await Destek.find()
    .sort({ createdAt: -1 })
    .populate('user', 'name email');
  console.log(`Toplam destek mesajı sayısı: ${destekler.length}`);
  res.json(destekler);
});

// @desc    Destek mesajına cevap yaz (admin)
// @route   POST /api/destek/:id/cevap
// @access  Private/Admin
const addCevap = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const destek = await Destek.findById(req.params.id);

  if (!destek) {
    res.status(404);
    throw new Error('Destek mesajı bulunamadı');
  }

  destek.cevaplar.push({
    text,
    createdBy: req.user.id
  });

  destek.durum = 'cevaplandı';

  const updatedDestek = await destek.save();

  res.json(updatedDestek);
});

module.exports = {
  createDestek,
  getMyDestekler,
  getDestekler,
  addCevap
};