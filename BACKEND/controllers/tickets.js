const Ticket = require('../models/Ticket');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const path = require('path');
const fs = require('fs');

// @desc    Tüm arıza kayıtlarını getir (admin)
// @route   GET /api/tickets
// @access  Private/Admin
exports.getTickets = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Kullanıcının arıza kayıtlarını getir
// @route   GET /api/tickets/mytickets
// @access  Private
exports.getMyTickets = asyncHandler(async (req, res, next) => {
  const tickets = await Ticket.find({ user: req.user.id }).sort('-createdAt');
  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets
  });
});

// @desc    Tek arıza kaydını getir
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id).populate('user', 'name email');

  if (!ticket) {
    return next(
      new ErrorResponse(`ID'si ${req.params.id} olan arıza kaydı bulunamadı`, 404)
    );
  }

  // Kullanıcı kendi kaydını veya admin görüntüleyebilir
  if (ticket.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Bu arıza kaydını görüntüleme yetkiniz yok`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc    Yeni arıza kaydı oluştur
// @route   POST /api/tickets
// @access  Private
exports.createTicket = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const ticket = await Ticket.create(req.body);

  res.status(201).json({
    success: true,
    data: ticket
  });
});

// @desc    Dosya yükle
// @route   PUT /api/tickets/:id/upload
// @access  Private
exports.uploadTicketFile = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`ID'si ${req.params.id} olan arıza kaydı bulunamadı`, 404)
    );
  }

  // Kullanıcı kontrolü
  if (ticket.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Bu arıza kaydına dosya yükleme yetkiniz yok`, 401)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Lütfen bir dosya yükleyin`, 400));
  }

  const file = req.files.file;

  // Dosya uzantısı kontrolü
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
  const extname = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.includes(extname)) {
    return next(
      new ErrorResponse(
        `Lütfen geçerli bir dosya türü yükleyin (jpg, jpeg, png, pdf)`,
        400
      )
    );
  }

  // Dosya boyutu kontrolü (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return next(new ErrorResponse(`Dosya boyutu 5MB'den büyük olamaz`, 400));
  }

  // Özel dosya adı oluştur
  file.name = `file_${ticket._id}${path.parse(file.name).ext}`;
  const uploadPath = `${process.env.FILE_UPLOAD_PATH}/${file.name}`;

  // Dosyayı yükle
  file.mv(uploadPath, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Dosya yükleme sırasında bir hata oluştu`, 500));
    }

    await Ticket.findByIdAndUpdate(req.params.id, {
      $push: { files: { path: file.name, originalName: req.files.file.name } }
    });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});