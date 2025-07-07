const express = require("express");
const router = express.Router();
const imageGaleryCatController = require("../controllers/galleryCat.controller");
const authorize = require("../middlewares/authorize");

//gallery kategorileri getirme
router.get("/", imageGaleryCatController.getImageGaleryCat);

///gallery kategorisi oluşturma
router.post("/", imageGaleryCatController.createImageGaleryCat);

//gallery kategorisi güncelleme
router.put("/:id", imageGaleryCatController.updateImageGaleryCat);

//gallery kategorisi silme
router.delete("/:id", imageGaleryCatController.deleteImageGaleryCat);

//alt kategori listeleme
router.get("/sub", imageGaleryCatController.getImageGalerySubCat);

//alt kategori listeleme(kategoriye göre)
router.get(
  "/sub/:imageCatId",
  imageGaleryCatController.getImageGalerySubCatByCatId
);

//alt kategori oluşturma
router.post("/sub", imageGaleryCatController.createImageGalerySubCat);

//alt kategori güncelleme
router.put("/sub/:id", imageGaleryCatController.updateImageGalerySubCat);

//alt kategori silme
router.delete("/sub/:id", imageGaleryCatController.deleteImageGalerySubCat);

module.exports = router;
