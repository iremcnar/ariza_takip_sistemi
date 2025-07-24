const multer = require('multer');
const path = require('path');

// Depolama ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Yüklenen dosyalar 'uploads' klasörüne kaydedilir
  },
  filename: (req, file, cb) => {
    // Dosya adı: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  }
});

// Dosya türü kontrolü
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);  // Dosya kabul edilir
  } else {
    cb(new Error('Sadece resim ve PDF dosyaları yüklenebilir!'), false);  // Dosya reddedilir
  }
};

// Multer upload objesi
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // Maksimum dosya boyutu 5MB
  }
});

module.exports = upload;
