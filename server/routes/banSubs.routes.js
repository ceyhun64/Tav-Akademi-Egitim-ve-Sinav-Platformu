const express = require("express");
const router = express.Router();
const banSubsController = require("../controllers/banSubs.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

// getir
router.get(
  "/",
  verifyToken,
  authorize(9),
  authorize(14),
  banSubsController.getBanSubs
);

// sil
router.delete(
  "/:id",
  verifyToken,
  authorize(9),
  banSubsController.deleteBanSubs
);

//ekle
router.post("/", verifyToken, authorize(9), banSubsController.createBanSubs);

// güncelle
router.put("/:id", verifyToken, authorize(9), banSubsController.updateBanSubs);

module.exports = router;
