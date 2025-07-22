// Kullanıcıyla ilgili kimlik doğrulama ve yetkilendirme işlemleri için API rotaları

const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Kayıt ve giriş işlemleri
router.post('/register', registerUser);
router.post('/login', loginUser);

// Token ile korunan profil bilgisi alma
router.get('/me', protect, getMe);

module.exports = router;
