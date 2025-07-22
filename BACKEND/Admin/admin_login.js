router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Kullanıcı bulunamadı' });

    if (user.role !== 'admin') return res.status(403).json({ message: 'Yalnızca admin giriş yapabilir.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Şifre yanlış' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'gizliAnahtar', { expiresIn: '1h' });

    res.json({ message: 'Giriş başarılı', user, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});
