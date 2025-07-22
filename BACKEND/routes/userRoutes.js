const express = require("express");
const router = express.Router();

const { 
  getUser, 
  updateUser, 
  deleteUser, 
  changePassword, 
  getAllUsers
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware"); // ayrı dosyadan al

// Kullanıcı bilgilerini getir
router.get("/me", protect, getUser);

// Kullanıcı bilgilerini güncelle (ad, email)
router.put("/me", protect, updateUser);

// Kullanıcı şifresini değiştir
router.put("/me/password", protect, changePassword);

// Hesabı sil
router.delete("/me", protect, deleteUser);

// === ADMIN İÇİN TÜM KULLANICILARI GETİR ===
router.get("/admin/users", protect, admin, getAllUsers);

module.exports = router;
