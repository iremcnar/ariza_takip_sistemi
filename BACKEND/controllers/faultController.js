const FaultReport = require('../models/FaultReport');

exports.addFault = async (req, res) => {
  try {
    const { subject, description, priority, fileUrl } = req.body;
    const userId = req.user.id;

    const newFault = new FaultReport({
      user: userId,
      subject,
      description,
      priority,
      fileUrl,
      status: 'Beklemede'
    });

    await newFault.save();

    res.status(201).json({ msg: 'Arıza kaydı oluşturuldu' });
  } catch (err) {
    res.status(500).json({ msg: 'Arıza kaydı oluşturulamadı', error: err.message });
  }
};

exports.getUserFaults = async (req, res) => {
  try {
    const userId = req.user.id;
    const faults = await FaultReport.find({ user: userId }).sort({ createdAt: -1 });
    res.json(faults);
  } catch (err) {
    res.status(500).json({ msg: 'Kayıtlar alınamadı', error: err.message });
  }
};
