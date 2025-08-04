const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

router.post(
  "/excel-education-sets",
  verifyToken,
  reportController.assignEducationSetsToExcel
);
router.post(
  "/excel-assign-teo",
  verifyToken,
  reportController.assignTeoExamsToExcel
);

router.post(
  "/excel-assign-img",
  verifyToken,
  reportController.assignImgExamsToExcel
);

router.post("/excel-teo", verifyToken, reportController.userTeoResultsToExcel);

router.post("/excel-img", verifyToken, reportController.userImgResultsToExcel);

router.get("/assign-exams", verifyToken, reportController.getAssignExams);

router.get(
  "/assign-education-sets",
  verifyToken,
  reportController.getAssignEducationSets
);

// Sınav sonuçları detayları
router.get(
  "/result-detail/:userId/:examId",
  verifyToken,
  reportController.getUserResultDetail
);

// Eğitim seti sonuçları detayları
router.get(
  "/education-result-detail/:userId/:educationSetId",
  verifyToken,
  reportController.getUserEducationResultDetail
);

// --- Kategoriye Göre Doğru/Yanlış Getirme ---
// Not: `authorize(8)` genellikle admin rolü anlamına gelir.
// authorize(22) ve authorize(23) muhtemelen daha spesifik yetkilerdir.
router.get(
  "/question-category-result/:userId/:examId",
  verifyToken,
  reportController.getQuestionCategoryResult
);
router.get(
  "/img-question-result/:userId/:examId",
  verifyToken,
  reportController.getImgQuestionResult
);
router.get(
  "/teo-question-result/:userId/:examId",
  verifyToken,

  reportController.getTeoQuestionResult
);

// --- Tüm Kullanıcı Sınav/Eğitim Seti Sonuçlarını Listeleme ---
router.get(
  "/education-set-result",
  verifyToken,
  reportController.getAllUserEducationSetsResult
);
router.get("/teo-result", verifyToken, reportController.getAllUserTeoResults);
router.get("/img-result", verifyToken, reportController.getAllUserImgResults);

router.get(
  "/user-teo-result",
  verifyToken,
  // authorize(Kullanıcının kendi sonuçlarını görme yetkisi), // Eğer gerekiyorsa ekleyin
  reportController.getTeoResultByUser
);
router.get(
  "/user-img-result", // Sondaki "/" kaldırıldı, genellikle eklenmez.
  verifyToken,
  // authorize(Kullanıcının kendi sonuçlarını görme yetkisi), // Eğer gerekiyorsa ekleyin
  reportController.getImgResultByUser
);

// --- Silme İşlemleri ---
// Genel atamaları silme (Admin yetkisi gerektirebilir)
router.delete(
  "/delete-assign-exam/:examId",
  verifyToken,
  reportController.deleteAssignExam
);
router.delete(
  "/delete-assign-education-set/:educationSetId/:userId",
  verifyToken,
  reportController.deleteAssignEducationSet
);

// Kullanıcı sonuçlarını silme (Admin yetkisi veya özel yetki gerektirebilir)
router.delete(
  "/delete-user-education-result",
  verifyToken,
  reportController.deleteUserEducationResult
);
router.delete(
  "/delete-user-result",
  verifyToken,
  reportController.deleteUserExamResult
);

module.exports = router;
