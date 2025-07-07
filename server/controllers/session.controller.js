const { Session } = require("../models/index");
const geoip = require("geoip-lite");
// Oturumları listele
exports.listSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll({
      include: ["user"],
    });

    res.json(sessions);
  } catch (error) {
    console.error("Oturumları listeleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Oturumu pasifleştir
exports.deactivateSession = async (req, res) => {
  const sessionId = req.params.sessionId;
  try {
    const session = await Session.findOne({ where: { sessionId } });
    if (!session) {
      return res.status(404).json({ message: "Oturum bulunamadı" });
    }
    session.isActive = false;
    await session.save();

    res.json({ message: "Oturum pasifleştirildi" });
  } catch (error) {
    console.error("Oturum pasifleştirme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
//oturumu aktif yap
exports.activateSession = async (req, res) => {
  const sessionId = req.params.sessionId;
  try {
    const session = await Session.findOne({ where: { sessionId } });
    if (!session) {
      return res.status(404).json({ message: "Oturum bulunamadı" });
    }
    session.isActive = true;
    await session.save();
    res.json({ message: "Oturum aktif hale getirildi" });
  } catch (error) {
    console.error("Oturum aktif hale getirme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

function generateSessionId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
