const mongoose = require('mongoose');

const arizaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  baslik: {
    type: String,
    required: true,
    trim: true
  },
  aciklama: {
    type: String,
    required: true
  },
  oncelik: {
    type: String,
    enum: ['düşük', 'orta', 'yüksek'],
    default: 'orta'
  },
  dosyalar: [
    {
      path: String,          // Dosyanın serverdaki yolu
      originalname: String   // Orijinal dosya ismi
    }
  ],
  durum: {
    type: String,
    enum: ['beklemede', 'işlemde', 'çözüldü'],
    default: 'beklemede'
  },
  adminNotlari: [
    {
      text: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// Güncelleme yapıldığında updatedAt otomatik güncellensin
arizaSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Ariza', arizaSchema);
