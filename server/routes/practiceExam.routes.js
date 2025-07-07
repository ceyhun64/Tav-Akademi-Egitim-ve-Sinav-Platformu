const express = require("express");
const router = express.Router();
const practiceExamController = require("../controllers/practiceExam.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

router.get(
  "/question/:examId",
  verifyToken,
  authorize(16),
  practiceExamController.getQuestionsPracticeExam
);
router.get(
  "/",
  verifyToken,
  authorize(16),
  practiceExamController.getPracticeExam
);
router.post(
  "/",
  verifyToken,
  authorize(16),
  practiceExamController.createPracticeExam
);
router.delete(
  "/:id",
  verifyToken,
  authorize(16),
  practiceExamController.deletePracticeExam
);
router.put(
  "/:id",
  verifyToken,
  authorize(16),
  practiceExamController.updatePracticeExam
);

module.exports = router;
