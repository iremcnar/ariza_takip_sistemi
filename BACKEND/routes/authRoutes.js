//kullanıcıyla ilgili kimlik doğrulama ve yetkilendirme işlemlerini yöneten API rotalarını yönetir.
// Bu dosya, kullanıcı kayıt, giriş ve profil bilgilerini alma gibi işlemleri içerir.

const express = require('express'); //
const router = express.Router(); // Express.js ile yönlendirme işlemlerini yapar.

const { 
  registerUser,
  loginUser,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// post isteği ile kullanıcı kaydı, giriş ve profil bilgilerini alma işlemlerini yöneten rotalar tanımlanır.
// get isteği ile kullanıcı doğrulama işlemleri yapılır.
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;