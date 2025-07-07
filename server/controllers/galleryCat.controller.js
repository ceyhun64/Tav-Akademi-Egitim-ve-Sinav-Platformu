const { ImageGaleryCat, ImageGalerySubCat } = require("../models/index");
const logActivity = require("../helpers/logActivity");

/// Kategori listeleme
exports.getImageGaleryCat = async (req, res) => {
  try {
    const imageGaleryCats = await ImageGaleryCat.findAll();
    res.status(200).json(imageGaleryCats);
  } catch (error) {
    console.error("Kategori alma hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kategori oluşturma
exports.createImageGaleryCat = async (req, res) => {
  try {
    const { name } = req.body;
    const newImageGaleryCat = await ImageGaleryCat.create({ name });

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kütüphane kategori oluşturuldu.`,
      category: "Gallery",
    });
    res.status(201).json(newImageGaleryCat);
  } catch (error) {
    console.error("Kategori oluşturma hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kategori güncelleme
exports.updateImageGaleryCat = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const imageGaleryCat = await ImageGaleryCat.findByPk(id);
    await imageGaleryCat.update({ name });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kütüphane kategorisi güncellendi.`,
      category: "Gallery",
    });
    res.status(200).json(imageGaleryCat);
  } catch (error) {
    console.error("Kategori güncelleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kategori silme
exports.deleteImageGaleryCat = async (req, res) => {
  try {
    const { id } = req.params;
    const imageGaleryCat = await ImageGaleryCat.findByPk(id);
    await imageGaleryCat.destroy();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kütüphane kategorisi silindi.`,
      category: "Gallery",
    });
    res.status(200).json({ message: "Kategori başarıyla silindi." });
  } catch (error) {
    console.error("Kategori silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//alt kategori listeleme
exports.getImageGalerySubCat = async (req, res) => {
  try {
    const imageGalerySubCats = await ImageGalerySubCat.findAll();
    res.status(200).json(imageGalerySubCats);
  } catch (error) {
    console.error("Alt kategori alma hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Alt kategori listeleme(kategoriye göre)
exports.getImageGalerySubCatByCatId = async (req, res) => {
  try {
    const { imageCatId } = req.params;
    const imageGalerySubCats = await ImageGalerySubCat.findAll({
      where: { imageCatId },
    });
    res.status(200).json(imageGalerySubCats);
  } catch (error) {
    console.error("Alt kategori alma hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Alt kategori oluşturma
exports.createImageGalerySubCat = async (req, res) => {
  try {
    const name = req.body.categoryData.name;
    const categoryId = req.body.categoryData.categoryId;
    const existingSubCategory = await ImageGalerySubCat.findOne({
      where: { name, imageCatId: categoryId },
    });
    if (existingSubCategory) {
      return res.status(400).json({ message: "Bu alt kategori zaten mevcut!" });
    }
    const subCategory = await ImageGalerySubCat.create({
      name,
      imageCatId: categoryId,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kütüphane alt kategorisi oluşturuldu.`,
      category: "Gallery",
    });
    res
      .status(201)
      .json({ message: "Alt kategori başarıyla oluşturuldu", subCategory });
  } catch (error) {
    console.error("Alt kategori oluşturulurken hata oluştu:", error);
    res.status(500).json({
      message: "Sunucu hatası",
      error: error.message || "Bilinmeyen bir hata oluştu",
    });
  }
};

// Alt kategori güncelleme
exports.updateImageGalerySubCat = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageCatId } = req.body;
    const imageGalerySubCat = await ImageGalerySubCat.findByPk(id);
    await imageGalerySubCat.update({ name, imageCatId });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kütüphane alt kategorisi güncellendi.`,
      category: "Gallery",
    });
    res.status(200).json(imageGalerySubCat);
  } catch (error) {
    console.error("Alt kategori güncelleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Alt kategori silme
exports.deleteImageGalerySubCat = async (req, res) => {
  try {
    const { id } = req.params;
    const imageGalerySubCat = await ImageGalerySubCat.findByPk(id);
    await imageGalerySubCat.destroy();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kütüphane alt kategorisi silindi.`,
      category: "Gallery",
    });
    res.status(200).json({ message: "Alt kategori başarıyla silindi." });
  } catch (error) {
    console.error("Alt kategori silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
