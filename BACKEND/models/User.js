const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deleted: {
  type: Boolean,
  default: false
}

});

userSchema.pre('save', async function(next) {
  console.log("pre('save') middleware tetiklendi. Password:", this.password);
  
  if (!this.isModified('password')) {
    console.log("Password değişmemiş, hashlemeye gerek yok.");
    return next();
  }
  
  if(this.password.startsWith('$2b$')) {
    console.log("Password zaten hashlenmiş, tekrar hashleme yapılmıyor.");
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("Password hashlenip güncellendi:", this.password);
  next();
});

// Şifre karşılaştırma metodu
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);