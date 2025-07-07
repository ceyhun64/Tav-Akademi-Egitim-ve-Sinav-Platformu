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
  authorize(4),
  imageGaleryController.getAllGalleries
);

//id ye göre galeri getir
router.get(
  "/:id",
  verifyToken,
  authorize(4),
  imageGaleryController.getGalleryById
);

// Kategoriye göre galeri getir
router.get(
  "/cat/:imageCatId",
  verifyToken,
  authorize(4),
  imageGaleryController.getGalleryByCategory
);

// Alt kategoriye göre galeri getir
router.get(
  "/sub/:imageSubCatId",
  verifyToken,
  authorize(4),
  imageGaleryController.getGalleryBySubCategory
);

// Tekli resim yükleme
router.post(
  "/single",
  verifyToken,
  uploadSingle,
  authorize(4),
  imageGaleryController.uploadSingleImage
);

// Çoklu resim yükleme
router.post(
  "/multiple",
  verifyToken,
  uploadMultiple,
  authorize(4),
  imageGaleryController.uploadMultipleImages
);

// Galeri silme
router.delete(
  "/:id",
  verifyToken,
  authorize(4),
  imageGaleryController.deleteGallery
);

// Galeri güncelleme
router.put(
  "/:id",
  verifyToken,
  uploadSingle,
  authorize(4),
  imageGaleryController.updateGallery
);

module.exports = router;
