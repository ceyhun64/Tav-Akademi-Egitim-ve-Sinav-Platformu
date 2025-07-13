const express = require("express");
const router = express.Router();

const questionController = require("../controllers/question.controller");

const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

//teorik soruları getirme
router.get("/teo/:examId",verifyToken, questionController.get_teo_questions);

//görsel soruları getirme
router.get("/img/:examId",verifyToken, questionController.get_img_questions);

//birleşik soruları getirme(teorik)
router.get("/both/teo/:examId",verifyToken, questionController.get_both_questions_teo);

//birleşik soruları getirme(görsel)
router.get("/both/img/:examId",verifyToken, questionController.get_both_questions_img);

router.post(
  "/answer/teo",
  verifyToken,
  questionController.answer_teo_questions
);
 
router.post(
  "/answer/img",
  verifyToken,
  questionController.answer_img_questions
);

module.exports = router;
