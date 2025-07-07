const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/session.controller");
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");

/// listele
router.get("/", verifyToken, authorize(18), sessionController.listSessions);

//pasif yap
router.put(
  "/deactivate/:sessionId",
  verifyToken,
  authorize(18),
  sessionController.deactivateSession
);

//aktif yap
router.put(
  "/activate/:sessionId",
  verifyToken,
  authorize(18),
  sessionController.activateSession
);

module.exports = router;
