const express = require("express");
const router = express.Router();
const questionCatController = require("../controllers/queDif.controller");
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");

// getir
router.get("/dif", verifyToken, questionCatController.getDifLevels);

router.post("/dif", verifyToken, questionCatController.createDifLevel);

router.delete("/dif/:id", verifyToken, questionCatController.deleteDifLevel);

router.get(
  "/",
  verifyToken,
  authorize(15),
  questionCatController.getQuestionCat
);

router.post("/", verifyToken, questionCatController.createQuestionCat);

router.delete("/:id", verifyToken, questionCatController.deleteQuestionCat);

module.exports = router;
