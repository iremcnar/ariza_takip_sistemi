const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// Kayıt ol
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Kullanıcı oluştur
  const user = await User.create({
    name,
    email,
    password
  });

  // Token oluştur ve gönder
  sendTokenResponse(user, 201, res);
});

// Giriş yap
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Email ve şifre kontrolü
  if (!email || !password) {
    return next(new ErrorResponse('Lütfen email ve şifre giriniz', 400));
  }

  // Kullanıcıyı bul
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Geçersiz kimlik bilgileri', 401));
  }

  // Şifre kontrolü
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Geçersiz kimlik bilgileri', 401));
  }

  // Token oluştur ve gönder
  sendTokenResponse(user, 200, res);
});

// Token oluşturma yardımcı fonksiyonu
const sendTokenResponse = (user, statusCode, res) => {
  // Token oluştur
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};

// Güncel kullanıcı bilgileri
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});