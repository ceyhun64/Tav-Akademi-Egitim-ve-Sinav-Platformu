const express = require("express");
const router = express.Router();
const questionCatController = require("../controllers/queDif.controller");
const authorize = require("../middlewares/authorize");

// getir
router.get("/dif", questionCatController.getDifLevels);

router.post("/dif", questionCatController.createDifLevel);

router.delete("/dif/:id", questionCatController.deleteDifLevel);

router.get("/",authorize(15), questionCatController.getQuestionCat);

router.post("/", questionCatController.createQuestionCat);

router.delete("/:id", questionCatController.deleteQuestionCat);

module.exports = router;
