const express = require("express");
const router = express.Router();
const educationController = require("../controllers/education.controller");
const { uploadSingle, uploadMultiple } = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

// Eğitim listeleme
router.get("/", verifyToken, educationController.getAllEducations);

//tamamlanmış eğitimleri getirme
router.get("/complete", verifyToken, educationController.getCompletedEducation);

//type a göre eğitim getir
router.get("/type/:type", verifyToken, educationController.getEducationByType);

//educationSetId ye göre eğitim getirme
router.get(
  "/edusetid/:id",
  verifyToken,
  educationController.getEducationByEducationSetId
);

//eğitim tamamlama
router.put(
  "/complete/:id",
  verifyToken,
  educationController.updateEducationUser
);

// Tekli dosya yükleme
router.post(
  "/single",
  // verifyToken,
  uploadSingle,
  educationController.uploadSingleFile
);

//sayfa süresi ekleme
router.post(
  "/pages/:id",
  // verifyToken,
  // authorize(30),
  educationController.addPageDuration
);

//sayfa süresi getirme
router.get("/pages/:id", verifyToken, educationController.getPageDuration);

// Çoklu dosya yükleme
router.post(
  "/multiple",
  // verifyToken,
  // authorize(30),

  uploadMultiple,
  educationController.uploadMultipleFiles
);

// Eğitim silme
router.delete("/:id", verifyToken, educationController.deleteEducation);

// Eğitim güncelleme
router.put(
  "/:id",
  verifyToken,
  authorize(30),

  uploadSingle,
  educationController.updateEducation
);

// **Son olarak** dinamik id rotası
router.get("/:id", verifyToken, educationController.getEducationById);

module.exports = router;
