const express = require('express');
const router = express.Router();
const {
  updateTicketStatus,
  addTicketComment,
  replySupportMessage
} = require('../controllers/admin');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);
router.use(authorize('admin'));

router
  .route('/tickets/:id/status')
  .put(updateTicketStatus);

router
  .route('/tickets/:id/comment')
  .put(addTicketComment);

router
  .route('/support/:id/reply')
  .put(replySupportMessage);

module.exports = router;