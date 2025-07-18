const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token'ı header'dan al
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula ve içindeki userId'yi al
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı veritabanından şifre hariç çek
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
      }

      // Kullanıcı objesini req.user olarak ata
      req.user = user;
      next();
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      return res.status(401).json({ message: 'Yetkisiz erişim, token geçersiz.' });
    }
  } else {
    return res.status(401).json({ message: 'Yetkisiz erişim, token yok.' });
  }
});

// Admin yetkisi kontrolü middleware'i
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(401).json({ message: 'Yetkisiz erişim, admin değil.' });
  }
};

module.exports = { protect, admin };
