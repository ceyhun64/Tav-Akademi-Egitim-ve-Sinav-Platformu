const express = require("express");
const router = express.Router();
const imageGaleryController = require("../controllers/gallery.controller");
const { uploadSingle, uploadMultiple } = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

// Galeri listeleme
router.get(
  "/",
  verifyToken,
  imageGaleryController.getAllGalleries
);

//id ye göre galeri getir
router.get(
  "/:id",
  verifyToken,
  imageGaleryController.getGalleryById
);

// Kategoriye göre galeri getir
router.get(
  "/cat/:imageCatId",
  verifyToken,
  imageGaleryController.getGalleryByCategory
);

// Alt kategoriye göre galeri getir
router.get(
  "/sub/:imageSubCatId",
  verifyToken,
  imageGaleryController.getGalleryBySubCategory
);

// Tekli resim yükleme
router.post(
  "/single",
  verifyToken,
  uploadSingle,
  imageGaleryController.uploadSingleImage
);

// Çoklu resim yükleme
router.post(
  "/multiple",
  verifyToken,
  uploadMultiple,
  imageGaleryController.uploadMultipleImages
);

// Galeri silme
router.delete(
  "/:id",
  verifyToken,
  imageGaleryController.deleteGallery
);

// Galeri güncelleme
router.put(
  "/:id",
  verifyToken,
  uploadSingle,
  imageGaleryController.updateGallery
);

module.exports = router;
