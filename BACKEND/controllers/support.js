const SupportMessage = require('../models/SupportMessage');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Kullanıcının destek mesajlarını getir
// @route   GET /api/support
// @access  Private
exports.getMySupportMessages = asyncHandler(async (req, res, next) => {
  const messages = await SupportMessage.find({ user: req.user.id }).sort('-createdAt');
  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
});

// @desc    Yeni destek mesajı oluştur
// @route   POST /api/support
// @access  Private
exports.createSupportMessage = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const message = await SupportMessage.create(req.body);

  res.status(201).json({
    success: true,
    data: message
  });
});