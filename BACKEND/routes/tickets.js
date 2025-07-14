const express = require('express');
const router = express.Router();
const {
  getTickets,
  getMyTickets,
  getTicket,
  createTicket,
  uploadTicketFile
} = require('../controllers/tickets');
const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const Ticket = require('../models/Ticket');

// Dosya yükleme için
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

router.use(protect);

router
  .route('/')
  .get(authorize('admin'), advancedResults(Ticket, 'user'), getTickets);

router.route('/mytickets').get(getMyTickets);

router
  .route('/:id')
  .get(getTicket);

router
  .route('/')
  .post(createTicket);

router
  .route('/:id/upload')
  .put(upload.single('file'), uploadTicketFile);

module.exports = router;