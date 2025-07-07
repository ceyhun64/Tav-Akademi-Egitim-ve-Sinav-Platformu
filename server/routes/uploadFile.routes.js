const express = require("express");
const router = express.Router();
const uploadFileController = require("../controllers/uploadFile.controller");
const { uploadSingle, uploadMultiple } = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

router.get(
  "/downloaded",
  verifyToken,
  authorize(9),
  authorize(20),
  uploadFileController.getDownloadedUser
);

router.post(
  "/",
  uploadSingle,
  verifyToken,
  authorize(9),
  authorize(20),

  uploadFileController.uploadSingleFile
);
router.post(
  "/multiple",
  uploadMultiple,
  verifyToken,
  authorize(9),
  authorize(20),

  uploadFileController.uploadMultipleFiles
);
router.get(
  "/manager",
  verifyToken,
  authorize(9),
  authorize(20),

  uploadFileController.getUploadedFilesByManager
);

router.get("/user", verifyToken, uploadFileController.getUploadedFilesByUser);

router.delete(
  "/",
  verifyToken,
  authorize(9),
  uploadFileController.deleteUploadedFile
);

router.put("/downloaded", verifyToken, uploadFileController.updateDowloaded);

module.exports = router;
