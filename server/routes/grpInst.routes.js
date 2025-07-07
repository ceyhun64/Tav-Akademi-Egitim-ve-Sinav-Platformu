const express = require("express");
const router = express.Router();
const grpInstController = require("../controllers/grpInst.controller");
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");

router.get("/groups", verifyToken, authorize(17), grpInstController.getGroups);
router.delete(
  "/groups/:id",
  verifyToken,
  authorize(17),
  grpInstController.deleteGroups
);
router.post(
  "/groups",
  verifyToken,
  authorize(17),
  grpInstController.createGroups
);
router.put(
  "/groups/:id",
  verifyToken,
  authorize(17),
  grpInstController.updateGroups
);
router.get(
  "/institutions",
  verifyToken,
  authorize(17),
  grpInstController.getInstitutions
);
router.delete(
  "/institutions/:id",
  verifyToken,
  authorize(17),
  grpInstController.deleteInstitutions
);
router.post(
  "/institutions",
  verifyToken,
  authorize(17),
  grpInstController.createInstitutions
);
router.put(
  "/institutions/:id",
  verifyToken,
  authorize(17),
  grpInstController.updateInstitutions
);
module.exports = router;
