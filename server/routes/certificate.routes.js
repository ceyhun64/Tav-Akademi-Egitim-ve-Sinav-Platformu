const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificate.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

router.get(
  "/complete/:educationSetId",
  verifyToken,
  authorize(7),
  certificateController.getCompletedEducationSets
);
router.get(
  "/",
  verifyToken,
  authorize(7),
  certificateController.getCertificates
);

router.post(
  "/",
  verifyToken,
  authorize(7),
  certificateController.createCertificate
);
module.exports = router;
