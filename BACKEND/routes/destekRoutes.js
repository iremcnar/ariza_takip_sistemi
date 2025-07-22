const express = require('express');
const router = express.Router();

const {
  createDestek,
  getMyDestekler,
  getDestekler,
  addCevap
} = require('../controllers/destekController');

const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.route('/')
  .post(protect, createDestek)
  .get(protect, admin, getDestekler);

router.get('/benim', protect, getMyDestekler);
router.post('/:id/cevap', protect, admin, addCevap);

module.exports = router;
