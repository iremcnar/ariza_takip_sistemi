const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token bulunamadı, giriş yapınız.' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin yetkisi gerekli.' });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Admin middleware hatası:', error);
    return res.status(401).json({ message: 'Geçersiz token veya yetkisiz erişim.' });
  }
};

module.exports = adminProtect;
