const express = require("express");
const router = express.Router();
const practiceExamController = require("../controllers/practiceExam.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get(
  "/question/:examId",
  verifyToken,
  practiceExamController.getQuestionsPracticeExam
);
router.get("/", verifyToken, practiceExamController.getPracticeExam);
router.post("/", verifyToken, practiceExamController.createPracticeExam);
router.delete("/:id", verifyToken, practiceExamController.deletePracticeExam);
router.put("/:id", verifyToken, practiceExamController.updatePracticeExam);

module.exports = router;
