const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addFault, getUserFaults } = require('../controllers/faultController');

router.post('/add', protect, addFault);
router.get('/myfaults', protect, getUserFaults);

module.exports = router;
