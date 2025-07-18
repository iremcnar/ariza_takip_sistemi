const mongoose = require('mongoose');

const FaultReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: String,
  description: String,
  priority: { type: String, enum: ['Düşük', 'Orta', 'Yüksek'], default: 'Orta' },
  fileUrl: String,
  status: { type: String, enum: ['Beklemede', 'İşleme Alındı', 'Çözüldü'], default: 'Beklemede' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FaultReport', FaultReportSchema);
