const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Kullanıcı bilgilerini getir
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı.");
  }
  res.json(user);
});

// Ad, email ve şifre güncelle
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı.");
  }

  // Email değişmişse başka kullanıcıda kayıtlı mı kontrol et
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error("Bu email başka bir kullanıcı tarafından kullanılıyor.");
    }
  }

  user.name = name || user.name;
  user.email = email || user.email;

  // Şifre değişikliği varsa hashleyip kaydet
  // Controller'da
if (password) {
  user.password = password; // modelde hashlenir
}

const updatedUser = await user.save();
console.log("User updated:", updatedUser);


  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role
  });
});

// Şifre değiştirme (Eski şifre doğrulamasıyla)
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Eski ve yeni şifre girilmelidir.");
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı.");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Eski şifre yanlış.");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();
  res.json({ message: "Şifre başarıyla güncellendi." });
});

// Hesabı sil
const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: "Hesap başarıyla silindi." });
});

// Admin için tüm kullanıcıları getir
const getAllUsers = asyncHandler(async (req, res) => {
  // Tüm kullanıcıları getir, sadece gerekli alanları seç
  const users = await User.find().select("name email role createdAt");
  res.json(users);
});

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  getAllUsers
};
