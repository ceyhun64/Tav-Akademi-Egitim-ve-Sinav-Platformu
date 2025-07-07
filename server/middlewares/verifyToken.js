require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Session, User } = require("../models/index");

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");
  const sessionId = req.header("x-session-id");

  if (!token || !sessionId) {
    return res.status(401).json("Token veya oturum ID’si eksik");
  }

  try {
    const decodedToken = jwt.verify(token, jwtPrivateKey);

    // Kullanıcıyı DB'den çek
    const user = await User.findByPk(decodedToken.id);
    if (!user) {
      return res.status(404).json("Kullanıcı bulunamadı");
    }

    // Kullanıcı bilgisi eklenmiş şekilde req.user oluştur
    req.user = {
      ...decodedToken,
      name: user.ad, // veya username
      roleId: user.roleId,
    };

    // Session kontrolü
    const session = await Session.findOne({
      where: {
        userId: decodedToken.id,
        sessionId,
        isActive: true,
      },
    });

    if (!session) {
      return res
        .status(403)
        .json("Aktif oturum bulunamadı veya geçersiz session ID.");
    }

    req.session = session;
    next();
  } catch (ex) {
    console.error("Token doğrulama hatası:", ex);
    return res.status(400).json("Geçersiz token");
  }
};
