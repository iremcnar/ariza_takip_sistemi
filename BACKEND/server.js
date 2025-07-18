// Bu dosyanın amacı backend sunucusunu başlatmak ve yapılandırmaktır. (Apı oluşturma)
// HTTTP isteklerini dinler, MongoDB veritabanına bağlanır ve gerekli rotaları tanımlar.
// Route(yol) yönetimi, middleware kullanımı ve MongoDB bağlantısı gibi temel işlevleri içerir.
require('dotenv').config(); //.env dosyasından bilgileri almamıza yarar. Bu sayede gizli bilgileri kodda direkt yazmamış oluruz.
const express = require('express'); // Web sunucusu oluşturmak için
const mongoose = require('mongoose'); //MongoDB ile etkileşim için
const cors = require('cors'); // Farklı kaynaklardan gelen istekleri kabul etmek için

const app = express();

// Middleware
app.use(cors());  // CORS ayarları, farklı kaynaklardan gelen istekleri kabul eder. Backend ve frontend farklı portlarda çalıştığı için bu gerekli.
app.use(express.json()); // Gelen JSON formatındaki istek gövdesini (body) işler.
app.use('/uploads', express.static('uploads')); // 'uploads' klasöründeki dosyaları statik olarak sunar. Örneğin, resim yükleme işlemleri için kullanılır.

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGODB_URI)
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