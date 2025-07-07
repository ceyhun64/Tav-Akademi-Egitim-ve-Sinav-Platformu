const express = require("express");
const router = express.Router();
const poolTeoController = require("../controllers/poolTeo.controller");
const { uploadSingle } = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

// GET /api/poolTeos
router.get("/",verifyToken,authorize(2), poolTeoController.getPoolTeos);

// GET /api/poolTeos/:id
router.get("/:id",verifyToken, poolTeoController.getPoolTeoById);

//çoklu soru ekleme
router.post(
  "/upload-questions",
  verifyToken, // middleware to verify token
  uploadSingle, // multer single middleware
  poolTeoController.uploadQuestionsFromExcel
);

// POST /api/poolTeos
router.post("/", verifyToken, uploadSingle, poolTeoController.createPoolTeo);

// PUT /api/poolTeos/:id
router.put("/:id", verifyToken, uploadSingle, poolTeoController.updatePoolTeo);

// DELETE /api/poolTeos/:id
router.delete("/:id", verifyToken, poolTeoController.deletePoolTeo);

// GET /api/poolTeos/booklet/:bookletId
router.get("/booklet/:bookletId",verifyToken, poolTeoController.getPoolTeosByBookletId);

module.exports = router;
