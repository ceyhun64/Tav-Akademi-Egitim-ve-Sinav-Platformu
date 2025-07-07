const { QuestionCategory, DifLevel } = require("../models/index");
const logActivity = require("../helpers/logActivity");

/// Kategori listeleme
exports.getQuestionCat = async (req, res) => {
  try {
    const questionCats = await QuestionCategory.findAll();
    res.status(200).json(questionCats);
  } catch (error) {
    console.error("Kategori alma hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kategori oluşturma
exports.createQuestionCat = async (req, res) => {
  try {
    const { name } = req.body;
    const newquestionCat = await QuestionCategory.create({ name });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından soru kategorisi oluşturuldu.`,
      category: "QuestionCategory",
    });
    res.status(201).json(newquestionCat);
  } catch (error) {
    console.error("Kategori oluşturma hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kategori silme
exports.deleteQuestionCat = async (req, res) => {
  try {
    const { id } = req.params;
    const questionCat = await QuestionCategory.findByPk(id);
    await questionCat.destroy();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından soru kategorisi silindi.`,
      category: "QuestionCategory",
    });
    res.status(200).json({ message: "Kategori başarıyla silindi." });
  } catch (error) {
    console.error("Kategori silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//zorluk seviyesi

/// Kategori listeleme
exports.getDifLevels = async (req, res) => {
  try {
    const difLevels = await DifLevel.findAll();

    res.status(200).json(difLevels);
  } catch (error) {
    console.error("Kategori alma hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kategori oluşturma
exports.createDifLevel = async (req, res) => {
  try {
    const { name } = req.body;
    const newDifLevel = await DifLevel.create({ name });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından zorluk seviyesi oluşturuldu.`,
      category: "DifLevel",
    });
    res.status(201).json(newDifLevel);
  } catch (error) {
    console.error("Kategori oluşturma hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kategori silme
exports.deleteDifLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const difLevel = await DifLevel.findByPk(id);
    await difLevel.destroy();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından zorluk seviyesi silindi.`,
      category: "DifLevel",
    });
    res.status(200).json({ message: "Kategori başarıyla silindi." });
  } catch (error) {
    console.error("Kategori silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
