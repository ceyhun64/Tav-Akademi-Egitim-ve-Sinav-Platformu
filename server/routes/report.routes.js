const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

// --- Rotaları Gruplama ve Sıralama Tavsiyesi ---
// Genel prensip:
// 1. Atama (Assignment) İşlemleri
// 2. Detay Görüntüleme (Specific Details)
// 3. Kategoriye Göre Sonuçlar
// 4. Tüm Sonuçları Listeleme
// 5. Silme İşlemleri (Genellikle en alta veya kendi grubuna)
// 6. Kullanıcıya Özel Sonuçlar (Genel sonuçlardan sonra)

// --- Atama ve Tanımlama İşlemleri ---
// Sınav/Eğitim Seti Atamalarını Listeleme
router.get(
  "/assign-img-exams",
  verifyToken,
  reportController.getAssignImgExams
);
router.get(
  "/assign-teo-exams",
  verifyToken,
  reportController.getAssignTeoExams
);
router.get(
  "/assign-education-sets",
  verifyToken,
  reportController.getAssignEducationSets
);

// --- Detaylı Sonuç Görüntüleme (Kullanıcı ve Sınav/Eğitim Seti Bazında) ---
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
  authorize(8), // Yönetici veya ilgili kullanıcı yetkisi
  reportController.getUserEducationResultDetail
);

// --- Kategoriye Göre Doğru/Yanlış Getirme ---
// Not: `authorize(8)` genellikle admin rolü anlamına gelir.
// authorize(22) ve authorize(23) muhtemelen daha spesifik yetkilerdir.
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
  authorize(23), // Resim sınavı sonuçlarını görme yetkisi
  reportController.getImgQuestionResult
);
router.get(
  "/teo-question-result/:userId/:examId",
  verifyToken,
  authorize(8),
  authorize(22), // Teorik sınav sonuçlarını görme yetkisi
  reportController.getTeoQuestionResult
);

// --- Tüm Kullanıcı Sınav/Eğitim Seti Sonuçlarını Listeleme ---
router.get(
  "/education-set-result",
  verifyToken,
  authorize(8), // Tüm eğitim seti sonuçlarını görme yetkisi
  reportController.getAllUserEducationSetsResult
);
router.get(
  "/teo-result",
  verifyToken,
  authorize(8), // Tüm teorik sınav sonuçlarını görme yetkisi
  reportController.getAllUserTeoResults
);
router.get(
  "/img-result",
  verifyToken,
  authorize(8), // Tüm görsel sınav sonuçlarını görme yetkisi
  reportController.getAllUserImgResults
);

// --- Kullanıcıya Göre Kendi Sonuçlarını Getirme ---
// Not: Bu endpoint'lerde ":userId" parametresi olmaması,
// genellikle token'dan veya oturumdan gelen kullanıcı ID'sini kullandığınız anlamına gelir.
// Bu yüzden authorize(8) yerine, sadece verifyToken yeterli olabilir veya
// kendi yetkilendirme mantığınızı uygulayabilirsiniz.
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
  authorize(8), // Genellikle bu tür silmeler için Admin yetkisi gereklidir
  reportController.deleteAssignExam
);
router.delete(
  "/delete-assign-education-set/:educationSetId",
  verifyToken,
  authorize(8), // Genellikle bu tür silmeler için Admin yetkisi gereklidir
  reportController.deleteAssignEducationSet
);

// Kullanıcı sonuçlarını silme (Admin yetkisi veya özel yetki gerektirebilir)
router.delete(
  "/delete-user-education-result",
  verifyToken,
  authorize(8), // Admin yetkisi
  authorize(34), // Eğitim seti sonuçlarını silme yetkisi
  reportController.deleteUserEducationResult
);
router.delete(
  "/delete-user-result",
  verifyToken,
  authorize(8), // Admin yetkisi
  authorize(32), // Sınav sonuçlarını silme yetkisi
  reportController.deleteUserExamResult
);

module.exports = router;
