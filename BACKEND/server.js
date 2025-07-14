require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.log('MongoDB bağlantı hatası:', err));

// Basit bir route test için
app.get('/', (req, res) => {
  res.send('Arıza Takip Sistemi API');
});

// Routes
const authRoutes = require('./routes/authRoutes');
const arizaRoutes = require('./routes/arizaRoutes');
const destekRoutes = require('./routes/destekRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/ariza', arizaRoutes);
app.use('/api/destek', destekRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));