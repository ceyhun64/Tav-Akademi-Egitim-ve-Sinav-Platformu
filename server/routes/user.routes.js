const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

const { uploadSingle } = require("../middlewares/upload");

// Kullanıcı detaylarını getir
router.get("/details/:id", verifyToken, userController.get_user_details);

//kullanıcıları getir
router.get("/", verifyToken, userController.get_all_users);

//aktif paasif yapma
router.put("/aktifpasif", verifyToken, userController.aktif_pasif_user);

// kullanıcı detayı güncelleme
router.put(
  "/update/:id",
  verifyToken,
  uploadSingle,
  userController.update_user_details
);

router.delete("/", verifyToken, authorize(28), userController.delete_users);

module.exports = router;
