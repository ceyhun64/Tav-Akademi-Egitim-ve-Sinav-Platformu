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

router.get(
  "/requesters",
  verifyToken,
  authorize(7),
  certificateController.getRequesters
);
router.get(
  "/educators",
  verifyToken,
  authorize(7),
  certificateController.getEducators
);
router.get(
  "/courseno",
  verifyToken,
  authorize(7),
  certificateController.getCourseNos
);
router.get(
  "/coursetype",
  verifyToken,
  authorize(7),
  certificateController.getCourseTypes
);
router.post(
  "/requester",
  verifyToken,
  authorize(7),
  certificateController.createRequester
);
router.post(
  "/educator",
  verifyToken,
  authorize(7),
  certificateController.createEducator
);
router.post(
  "/courseno",
  verifyToken,
  authorize(7),
  certificateController.createCourseNo
);
router.post(
  "/coursetype",
  verifyToken,
  authorize(7),
  certificateController.createCourseType
);
router.delete(
  "/requester/:id",
  verifyToken,
  authorize(7),
  certificateController.deleteRequester
);
router.delete(
  "/educator/:id",
  verifyToken,
  authorize(7),
  certificateController.deleteEducator
);
router.delete(
  "/courseno/:id",
  verifyToken,
  authorize(7),
  certificateController.deleteCourseNo
);
router.delete(
  "/coursetype/:id",
  verifyToken,
  authorize(7),
  certificateController.deleteCourseType
);

module.exports = router;
