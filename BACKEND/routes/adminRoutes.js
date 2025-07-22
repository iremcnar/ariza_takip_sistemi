const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
require('dotenv').config();

// --- Admin yetkilendirme middleware ---

const adminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    try {
      // Token doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı çek
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Kullanıcı bulunamadı.' });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin yetkisi gerekli.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      return res.status(401).json({ success: false, message: 'Geçersiz token' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Token bulunamadı, giriş yapınız.' });
  }
};

// --- Admin giriş ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email ve şifre gerekli.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Email veya şifre hatalı.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Yalnızca adminler giriş yapabilir.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Email veya şifre hatalı.' });
    }

    // Token oluştur
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      message: 'Admin girişi başarılı',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin giriş hatası:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// --- Admin token doğrulama ---
router.get('/verify-token', adminProtect, (req, res) => {
  res.json({
    success: true,
    message: 'Token geçerli',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// --- Admin profil bilgileri ---
router.get('/profile', adminProtect, (req, res) => {
  res.json({
    success: true,
    message: 'Admin profiline erişildi',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// --- Tüm kullanıcıları listele ---
router.get('/users', adminProtect, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // şifreyi gönderme
    res.json({ success: true, users });
  } catch (error) {
    console.error('Kullanıcılar listelenirken hata:', error);
    res.status(500).json({ success: false, message: 'Kullanıcılar listelenemedi' });
  }
});

// --- Admin çıkış (opsiyonel) ---
router.post('/logout', adminProtect, (req, res) => {
  res.json({ success: true, message: 'Admin çıkışı başarılı' });
});

module.exports = router;
