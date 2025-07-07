const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { uploadSingle, uploadMultiple } = require("../middlewares/upload");
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");

router.post("/setup-2fa", authController.setup2FA);

router.post("/verify-2fa", authController.verify2FA);
//kullanıcı toplu kayıt
router.post(
  "/bulk-register",
  verifyToken,
  authorize(28),
  uploadSingle,

  authController.uploadUsersFromExcel
);
// Kullanıcı girişi (admin)
router.post("/admin-login", authController.adminLogin);

// Kullanıcı kayıt
router.post("/register", uploadSingle, authController.register);

// Kullanıcı girişi
router.post("/login", authController.login);

// Kullanıcı çıkışı
router.post("/logout", verifyToken, authController.logout);

// Şifre sıfırlama maili gönderir
router.post("/password-email", authController.passwordEmail);

// Şifre sıfırlama
router.put("/update-password/:token", authController.updatePassword);

module.exports = router;
