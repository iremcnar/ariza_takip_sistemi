require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// .env dosyasını kullan
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'FRONTEND'))); // frontend statik dosyaları sunmak için

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB bağlantısı başarılı'))
.catch(err => console.error('❌ MongoDB bağlantı hatası:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('Arıza Takip Sistemi API Çalışıyor');
});

// ROUTE TANIMLARI
const authRoutes = require('./routes/authRoutes');
const arizaRoutes = require('./routes/arizaRoutes');
const destekRoutes = require('./routes/destekRoutes');
const faultRoutes = require('./routes/faultRoutes');
const meRoute = require('./me');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Route kullanımları
app.use('/api/auth', authRoutes);
app.use('/api/auth', meRoute); // aynı grup altında kalıyor
app.use('/api/ariza', arizaRoutes);
app.use('/api/destek', destekRoutes);
app.use('/api/faults', faultRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// PORT
const PORT = process.env.PORT || 5000;0,
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});
