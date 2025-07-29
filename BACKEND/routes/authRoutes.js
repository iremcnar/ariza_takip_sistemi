const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const User = require('../models/User'); // Kullanıcı modeli
const { registerUser, loginUser, getMe, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Nodemailer transporter ayarı
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Kayıt, Giriş, Profil ve Silme rotaları
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.delete('/delete', protect, deleteUser);

// Şifre sıfırlama rotası
router.post('/send-reset-password', async (req, res) => {
  const { email } = req.body;

  console.log("Şifre sıfırlama talebi alındı:", email);

  try {
    // Kullanıcı var mı kontrol et
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.' });

    // Yeni şifre üret (rastgele 8 karakter)
    const newPassword = Math.random().toString(36).slice(-8);

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Veritabanında şifreyi güncelle
    user.password = hashedPassword;
    await user.save();

    // Mail içeriği hazırla
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Şifre Yenileme Talebi',
      text: `Merhaba,\n\nYeni şifreniz: ${newPassword}\n\nLütfen giriş yaptıktan sonra şifrenizi değiştirin.`,
    };

    // Mail gönder
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Mail gönderme hatası:', err);
        return res.status(500).json({ message: 'Mail gönderilemedi.' });
      }
      res.json({ message: 'Yeni şifre e-posta adresinize gönderildi.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

module.exports = router;
