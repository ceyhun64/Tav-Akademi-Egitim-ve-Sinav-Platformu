const express = require("express");
const router = express.Router();
const imageGaleryCatController = require("../controllers/galleryCat.controller");
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");

//gallery kategorileri getirme
router.get("/", verifyToken, imageGaleryCatController.getImageGaleryCat);

///gallery kategorisi oluşturma
router.post("/", verifyToken, imageGaleryCatController.createImageGaleryCat);

//gallery kategorisi güncelleme
router.put("/:id", verifyToken, imageGaleryCatController.updateImageGaleryCat);

//gallery kategorisi silme
router.delete(
  "/:id",
  verifyToken,
  imageGaleryCatController.deleteImageGaleryCat
);

//alt kategori listeleme
router.get("/sub", verifyToken, imageGaleryCatController.getImageGalerySubCat);

//alt kategori listeleme(kategoriye göre)
router.get(
  "/sub/:imageCatId",
  verifyToken,
  imageGaleryCatController.getImageGalerySubCatByCatId
);

//alt kategori oluşturma
router.post(
  "/sub",
  verifyToken,
  imageGaleryCatController.createImageGalerySubCat
);

//alt kategori güncelleme
router.put(
  "/sub/:id",
  verifyToken,
  imageGaleryCatController.updateImageGalerySubCat
);

//alt kategori silme
router.delete(
  "/sub/:id",
  verifyToken,
  imageGaleryCatController.deleteImageGalerySubCat
);

module.exports = router;
