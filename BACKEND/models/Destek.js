const mongoose = require('mongoose');

const destekSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mesaj: {
    type: String,
    required: true
  },
  cevaplar: [{
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  durum: {
    type: String,
    enum: ['beklemede', 'cevaplandı', 'kapandı'],
    default: 'beklemede'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Destek', destekSchema);