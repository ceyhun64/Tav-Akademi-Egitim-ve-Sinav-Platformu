const express = require("express");
const router = express.Router();
const banSubsController = require("../controllers/banSubs.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

// getir
router.get("/", verifyToken, banSubsController.getBanSubs);

// sil
router.delete("/:id", verifyToken, banSubsController.deleteBanSubs);

//ekle
router.post("/", verifyToken, banSubsController.createBanSubs);

// güncelle
router.put("/:id", verifyToken, banSubsController.updateBanSubs);

module.exports = router;
