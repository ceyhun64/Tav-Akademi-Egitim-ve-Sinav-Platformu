const { BanSubs } = require("../models/index");
const logActivity = require("../helpers/logActivity");

exports.getBanSubs = async (req, res) => {
  try {
    const banSubs = await BanSubs.findAll();
    res.status(200).json(banSubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteBanSubs = async (req, res) => {
  try {
    const { id } = req.params;
    const banSub = await BanSubs.findByPk(id);
    if (!banSub) {
      return res.status(404).json({ message: "BanSub bulunamadı" });
    }
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından ${banSub.name} adlı yasaklı madde sildi`,
      category: "BanSubs",
    });

    await banSub.destroy(); // silme işlemi

    res.status(200).json(banSub); // silinen id'yi dön
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBanSubs = async (req, res) => {
  try {
    const { name } = req.body;
    const banSubs = await BanSubs.create({
      name: name,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından ${name} adlı yasaklı madde ekledi`,
      category: "BanSubs",
    });
    res.status(200).json(banSubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateBanSubs = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Update işlemi
    await BanSubs.update({ name: name }, { where: { id: id } });

    // Güncellenen kaydı tekrar çek
    const updatedBanSub = await BanSubs.findOne({ where: { id: id } });

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından ${name} adlı yasaklı madde düzenlendi`,
      category: "BanSubs",
    });

    res.status(200).json(updatedBanSub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
