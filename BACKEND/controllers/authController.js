const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');

// Token oluşturma fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Lütfen tüm alanları doldurun');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Bu email ile zaten kayıtlı bir kullanıcı var');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Geçersiz kullanıcı verisi');
  }
});

// @desc    Giriş yap
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Login denemesi:", email, password);

  const user = await User.findOne({ email });

  if (user) {
    if (user.deleted) {
      res.status(403);
      throw new Error("Bu hesap artık aktif değil.");
    }

    const isMatch = await user.matchPassword(password);
    console.log("Şifre karşılaştırma sonucu:", isMatch);

    if (isMatch) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
      return;
    }
  }

  res.status(401);
  throw new Error('Geçersiz email veya şifre');
});


// @desc    Hesabı sil (soft delete)
// @route   DELETE /api/auth/delete
// @access  Private (token ile)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı.");
  }

  user.deleted = true;
  await user.save();

  res.status(200).json({ message: "Hesabınız başarıyla devre dışı bırakıldı." });
});

// @desc    Kullanıcı bilgilerini getir
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Şifre sıfırlama maili gönder
// @route   POST /api/auth/send-reset-password
// @access  Public
const bcrypt = require('bcryptjs'); // controller'da varsa iyi

const sendResetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Bu email ile kayıtlı bir kullanıcı bulunamadı.");
  }

  // Yeni random 8 haneli şifre oluştur
  const newPassword = Math.random().toString(36).slice(-8);

  // Şifreyi manuel hashle
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  // Mail içeriği
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Şifre Sıfırlama Talebi',
    html: `
      <p>Merhaba ${user.name},</p>
      <p>Şifreniz başarıyla sıfırlandı.</p>
      <p>Yeni şifreniz: <strong>${newPassword}</strong></p>
      <p>Lütfen bu şifre ile giriş yapın ve sonra şifrenizi değiştirin.</p>
    `,
  };

  // Mail gönderimi (transporter tanımı controller'ın üstünde olmalı)
  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: "Yeni şifreniz e-posta adresinize gönderildi." });
});

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  getMe,
  sendResetPassword,
};