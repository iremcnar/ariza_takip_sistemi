const User = require('../models/User');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Admin Giriş
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Kullanıcı bulunamadı' });

  if (user.role !== 'admin')
    return res.status(403).json({ message: 'Yalnızca admin giriş yapabilir.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Şifre yanlış' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ message: 'Giriş başarılı', user, token });
});

// Tüm Kullanıcıları Getir (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('name email role createdAt');
  res.json(users);
});


module.exports = {
  adminLogin,
  getAllUsers,
};
