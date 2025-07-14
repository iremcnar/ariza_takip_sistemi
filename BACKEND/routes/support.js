const express = require('express');
const router = express.Router();
const {
  getMySupportMessages,
  createSupportMessage
} = require('../controllers/support');
const { protect } = require('../middlewares/auth');

router.use(protect);

router
  .route('/')
  .get(getMySupportMessages)
  .post(createSupportMessage);

module.exports = router;