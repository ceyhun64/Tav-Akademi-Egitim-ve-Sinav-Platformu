const { Group, Institution } = require("../models/index");
const logActivity = require("../helpers/logActivity");

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteGroups = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id);

    if (!group) {
      return res.status(404).json({ message: "Grup bulunamadı" });
    }
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından grup silindi.`,
      category: "Group",
    });

    await group.destroy();
    res.status(200).json({ id: group.id }); // sadece id dönmek daha temiz olabilir
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGroups = async (req, res) => {
  try {
    const { name } = req.body;
    const group = await Group.create({
      name: name,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından grup oluşturuldu.`,
      category: "Group",
    });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateGroups = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Update işlemi
    await Group.update({ name: name }, { where: { id: id } });

    // Güncellenen kaydı tekrar çek
    const updatedGroup = await Group.findOne({ where: { id: id } });

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından grup güncellendi.`,
      category: "Group",
    });
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.findAll();
    res.status(200).json(institutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteInstitutions = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await Institution.findByPk(id);
    await institution.destroy(); // silme işlemi
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından lokasyon silindi.`,
      category: "Institution",
    });
    res.status(200).json(institution); // silinen id'yi dön
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createInstitutions = async (req, res) => {
  try {
    const { name } = req.body;
    const institution = await Institution.create({
      name: name,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından lokasyon oluşturuldu.`,
      category: "Institution",
    });
    res.status(200).json(institution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateInstitutions = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    // Update işlemi
    await Institution.update({ name: name }, { where: { id: id } });
    // Güncellenen kaydı tekrar çek
    const updatedInstitution = await Institution.findOne({
      where: { id: id },
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından lokasyon güncellendi.`,
      category: "Institution",
    });
    res.status(200).json(updatedInstitution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
