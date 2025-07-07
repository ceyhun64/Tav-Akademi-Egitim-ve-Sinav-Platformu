const express = require("express");
const router = express.Router();

const educationSetController = require("../controllers/educationSet.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

// Eğitim seti oluşturma
router.post(
  "/",
  verifyToken,
  authorize(6),

  educationSetController.createEducationSet
);

//eğitim seti ata
router.post(
  "/assign",
  verifyToken,
  authorize(6),
  educationSetController.assignEducationSet
);

// Eğitim seti getirme (kullanıcıya göre) — önce gelmeli
router.get("/user", verifyToken, educationSetController.getEducationSetsUser);

// Tamamlanmış eğitimleri getirme
router.get("/complete", educationSetController.getCompletedEducationSet);

// Eğitim seti tamamlama
router.put(
  "/complete/:id",
  verifyToken,
  educationSetController.updateEducationSetUser
);

// Eğitim seti getirme (id'ye göre)
router.get("/:id", verifyToken, educationSetController.getEducationSetById);

// Eğitim seti getirme (tüm)
router.get(
  "/",
  verifyToken,
  authorize(11),
  educationSetController.getAllEducationSets
);

// Eğitim seti silme
router.delete(
  "/:id",
  verifyToken,
  authorize(31),
  educationSetController.deleteEducationSet
);

// Eğitim seti güncelleme
router.put(
  "/:id",
  verifyToken,
  authorize(31),
  educationSetController.updateEducationSet
);

module.exports = router;
