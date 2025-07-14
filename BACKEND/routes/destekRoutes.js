const express = require('express');
const router = express.Router();
const {
  createDestek,
  getMyDestekler,
  getDestekler,
  addCevap
} = require('../controllers/destekController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, createDestek)
  .get(protect, admin, getDestekler);

router.get('/benim', protect, getMyDestekler);
router.post('/:id/cevap', protect, admin, addCevap);

module.exports = router;