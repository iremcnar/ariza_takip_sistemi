const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Kullanıcı var mı kontrolü
  const userExists = await User.findOne({ email }); 
  if (userExists) {
    res.status(400);
    throw new Error('Bu email ile zaten kayıtlı bir kullanıcı var');
  }

  // Kullanıcı oluşturma
  const user = await User.create({
    name,
    email,
    password,
    role: 'user'
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Geçersiz kullanıcı verisi');
  }
});

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Kullanıcıyı email ile bulma
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Geçersiz email veya şifre');
  }
});

// @desc    Kullanıcı bilgilerini getir
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // req.user middleware ile atanmış, burada direkt dönüyoruz
  res.status(200).json(req.user);
});

// JWT Token oluşturma fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
