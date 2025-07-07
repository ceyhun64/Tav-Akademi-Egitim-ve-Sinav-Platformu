const express = require("express");
const router = express.Router();

const examController = require("../controllers/exam.controller");

const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

//teorik sınav oluşturma
router.post("/teo", verifyToken,authorize(5), examController.create_teo_exam);

//görüntü sınav oluşturma
router.post("/img",verifyToken,authorize(5), examController.create_img_exam);

//birleşik sınav oluşturmaa
router.post("/both", verifyToken,authorize(5), examController.create_unified_exam);
//tüm sınavları getirme
router.get("/", verifyToken,authorize(10), examController.get_all_exam);

//kişiye özel sınavları getirme
router.get("/user", verifyToken, examController.get_exam_by_userid);

//sınav detayını getirme
router.get("/:examId", verifyToken, examController.get_exam_by_id);

//sınav silme
router.delete("/:examId", verifyToken, examController.delete_exam);

//kullanıcı kendine atanan sınavları getirme(teorik)
router.get("/user/teo", verifyToken, examController.get_user_teo_exams);

//kullanıcı kendine atanan sınavları getirme(görüntü)
router.get("/user/img", verifyToken, examController.get_user_img_exams);

//lullanıcının kendine atanan sınavları getirme(birleşik)
router.get("/user/both", verifyToken, examController.get_user_unified_exams);


module.exports = router;
