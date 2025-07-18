const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Model yolunu kendi projenize göre ayarlayın

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token yok" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    req.user = user; // Kullanıcı bilgilerini req.user'a atıyoruz
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token geçersiz" });
  }
};

router.get("/me", authenticateToken, (req, res) => {
  res.json({ name: req.user.name, email: req.user.email, role: req.user.role });
});

module.exports = router;
