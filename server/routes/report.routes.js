const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

//kategoriye göre doğru yanlış getirme
router.get(
  "/question-category-result/:userId/:examId",
  verifyToken,
  authorize(8),
  reportController.getQuestionCategoryResult
);
router.get(
  "/img-question-result/:userId/:examId",
  verifyToken,
  authorize(8),
  authorize(23),

  reportController.getImgQuestionResult
);

router.get(
  "/teo-question-result/:userId/:examId",
  verifyToken,
  authorize(8),
  authorize(22),

  reportController.getTeoQuestionResult
);

// Exam sonuçları
router.get(
  "/result-detail/:userId/:examId",
  verifyToken,
  authorize(8),

  reportController.getUserResultDetail
);

// Eğitim seti sonuçları
router.get(
  "/education-result-detail/:userId/:educationSetId",
  verifyToken,
  authorize(8),

  reportController.getUserEducationResultDetail
);
router.get(
  "/education-set-result",
  verifyToken,
  authorize(8),

  reportController.getAllUserEducationSetsResult
);

// Eğitim seti sonuçlarını silme
router.delete(
  "/delete-user-education-result",
  verifyToken,
  authorize(8),
  authorize(34),

  reportController.deleteUserEducationResult
);

// Sınav sonuçlarını silme
router.delete(
  "/delete-user-result",
  verifyToken,
  authorize(8),
  authorize(32),
  reportController.deleteUserExamResult
);

// Kullanıcıya göre sonuçları getirme
router.get(
  "/user-teo-result",
  verifyToken,
  reportController.getTeoResultByUser
);
router.get(
  "/user-img-result/",
  verifyToken,
  reportController.getImgResultByUser
);

// Diğer sonuç türleri
router.get(
  "/teo-result",
  verifyToken,
  authorize(8),
  reportController.getAllUserTeoResults
);
router.get(
  "/img-result",
  verifyToken,
  authorize(8),
  reportController.getAllUserImgResults
);

//kullanıcıya göre sonuç getirme

module.exports = router;
