const { ImageGalery } = require("../models/index");
const fs = require("fs");
const path = require("path");
const logActivity = require("../helpers/logActivity");

// Galeriyi getir
exports.getAllGalleries = async (req, res) => {
  try {
    const galleryItems = await ImageGalery.findAll();
    res.status(200).json(galleryItems);
  } catch (error) {
    console.error("Galeri alanı hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

exports.getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const galleryItem = await ImageGalery.findByPk(id);
    if (!galleryItem) {
      return res.status(404).json({ message: "Galeri öğesi bulunamadı." });
    }
    res.status(200).json(galleryItem);
  } catch (error) {
    console.error("Galeri alanı hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kategoriye göre galeri getir
exports.getGalleryByCategory = async (req, res) => {
  try {
    const { imageCatId } = req.params;
    const galleryItems = await ImageGalery.findAll({ where: { imageCatId } });
    res.status(200).json(galleryItems);
  } catch (error) {
    console.error("Kategoriye göre galeri alma hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Alt kategoriye göre galeri getir
exports.getGalleryBySubCategory = async (req, res) => {
  try {
    const { imageSubCatId } = req.params;
    const galleryItems = await ImageGalery.findAll({
      where: { imageSubCatId },
    });
    res.status(200).json(galleryItems);
  } catch (error) {
    console.error("Alt kategoriye göre galeri alma hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Tekli resim yükleme
exports.uploadSingleImage = async (req, res) => {
  try {
    const { imageCatId, imageSubCatId } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const newGalleryItem = await ImageGalery.create({
      imageCatId,
      imageSubCatId,
      image: imagePath,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kütüphaney yeni resim yüklendi.`,
      category: "Gallery",
    });

    res.status(201).json(newGalleryItem);
  } catch (error) {
    console.error("Tekli resim yükleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Çoklu resim yükleme
exports.uploadMultipleImages = async (req, res) => {
  try {
    const { imageCatId, imageSubCatId } = req.body;
    const images = req.files.map((file) => file.path);

    const newGalleryItems = await Promise.all(
      images.map((imagePath) =>
        ImageGalery.create({
          imageCatId,
          imageSubCatId,
          image: imagePath,
        })
      )
    );

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kütüphaneye yeni çoklu resim yüklendi.`,
      category: "Gallery",
    });

    res.status(201).json(newGalleryItems);
  } catch (error) {
    console.error("Çoklu resim yükleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Resim silme
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const galleryItem = await ImageGalery.findByPk(id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Galeri öğesi bulunamadı." });
    }

    // İlgili dosya varsa sistemden de sil (isteğe bağlı)
    if (galleryItem.image && fs.existsSync(galleryItem.image)) {
      fs.unlinkSync(galleryItem.image);
    }
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kütüphane resmi silindi.`,
      category: "Gallery",
    });

    await galleryItem.destroy();
    res.status(200).json({ message: "Resim başarıyla silindi." });
  } catch (error) {
    console.error("Resim silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Resim güncelleme
exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageCatId, imageSubCatId } = req.body;
    const imagePath = req.file ? req.file.path : undefined;

    const galleryItem = await ImageGalery.findByPk(id);
    if (!galleryItem) {
      return res.status(404).json({ message: "Galeri öğesi bulunamadı." });
    }

    await galleryItem.update({
      imageCatId,
      imageSubCatId,
      ...(imagePath && { image: imagePath }),
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kütüphane resmi güncellendi.`,
      category: "Gallery",
    });

    res.status(200).json(galleryItem);
  } catch (error) {
    console.error("Resim güncelleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
