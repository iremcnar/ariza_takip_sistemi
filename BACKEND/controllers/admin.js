const Ticket = require('../models/Ticket');
const SupportMessage = require('../models/SupportMessage');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Arıza kaydı durumunu güncelle
// @route   PUT /api/admin/tickets/:id/status
// @access  Private/Admin
exports.updateTicketStatus = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`ID'si ${req.params.id} olan arıza kaydı bulunamadı`, 404)
    );
  }

  ticket.status = req.body.status;
  ticket.updatedAt = Date.now();
  await ticket.save();

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc    Arıza kaydına yorum ekle
// @route   PUT /api/admin/tickets/:id/comment
// @access  Private/Admin
exports.addTicketComment = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`ID'si ${req.params.id} olan arıza kaydı bulunamadı`, 404)
    );
  }

  const newComment = {
    comment: req.body.comment,
    commentedBy: req.user.id
  };

  ticket.adminComments.push(newComment);
  ticket.updatedAt = Date.now();
  await ticket.save();

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc    Destek mesajına cevap yaz
// @route   PUT /api/admin/support/:id/reply
// @access  Private/Admin
exports.replySupportMessage = asyncHandler(async (req, res, next) => {
  const message = await SupportMessage.findById(req.params.id);

  if (!message) {
    return next(
      new ErrorResponse(`ID'si ${req.params.id} olan destek mesajı bulunamadı`, 404)
    );
  }

  message.adminReply = req.body.reply;
  message.repliedBy = req.user.id;
  message.repliedAt = Date.now();
  await message.save();

  res.status(200).json({
    success: true,
    data: message
  });
});