const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcement.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

router.get(
  "/",
  verifyToken,
  authorize(19),
  announcementController.getAnnouncements
);
router.post(
  "/",
  verifyToken,
  authorize(19),
  announcementController.createAnnouncement
);
router.delete(
  "/:id",
  verifyToken,
  authorize(19),
  announcementController.deleteAnnouncement
);
router.put(
  "/:id",
  verifyToken,
  authorize(19),
  announcementController.updateAnnouncement
);

module.exports = router;
