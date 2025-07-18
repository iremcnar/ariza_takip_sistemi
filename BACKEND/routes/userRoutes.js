const express = require("express");
const router = express.Router();
const { getUser, updateUser, deleteUser, changePassword } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Kullanıcı bilgilerini getir
router.get("/me", protect, getUser);

// Kullanıcı bilgilerini güncelle (ad, email)
router.put("/me", protect, updateUser);

// Kullanıcı şifresini değiştir
router.put("/me/password", protect, changePassword);

// Hesabı sil
router.delete("/me", protect, deleteUser);

module.exports = router;
