const { Announcement, User, Institution, Group } = require("../models/index");
const sendMail = require("../helpers/sendMail");
const logActivity = require("../helpers/logActivity");

// Duyuruları getir
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      include: [
        { model: Institution, as: "institution" },
        { model: Group, as: "group" },
      ],
    });
    res.json(announcements);
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};

exports.getUserAnnouncements = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    const institutionId = user.lokasyonId;
    const groupId = user.grupId;
    const announcements = await Announcement.findAll({
      where: {
        institutionId: institutionId,
        groupId: groupId,
      },
    });
    res.json(announcements);
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};

// Duyuru oluştur
exports.createAnnouncement = async (req, res) => {
  try {
    const { institutionId, groupId, content } = req.body;

    // Filtreleme için koşullu where objesi oluştur
    const userFilter = {};
    if (groupId) userFilter.grupId = groupId;
    if (institutionId) userFilter.lokasyonId = institutionId;

    const users = await User.findAll({
      where: userFilter,
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "İlgili kullanıcı bulunamadı." });
    }

    // Duyuruyu oluştur
    const announcement = await Announcement.create({
      institutionId: institutionId || null,
      groupId: groupId || null,
      content,
    });

    // E-postaları paralel gönder (daha hızlı)
    await Promise.all(
      users.map((user) =>
        sendMail({
          to: user.email,
          subject: "TAV AKADEMİ",
          text: content,
        })
      )
    );

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından bir duyuru oluşturuldu`,
      category: "Announcement",
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Duyuru oluşturulurken hata oluştu." });
  }
};

// Duyuru sil
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: "Duyuru bulunamadı." });
    }
    await announcement.destroy();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından bir duyuru silindi (ID: ${id})`,
      category: "Announcement",
    });

    res.json({ message: "Duyuru başarıyla silindi.", announcement });
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Duyuru silinirken hata oluştu." });
  }
};

// Duyuru güncelle
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { institutionId, groupId, content } = req.body;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: "Duyuru bulunamadı." });
    }

    announcement.institutionId = institutionId ?? null;
    announcement.groupId = groupId ?? null;
    announcement.content = content ?? announcement.content;

    await announcement.save();

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından bir duyuru güncellendi (ID: ${id})`,
      category: "Announcement",
    });

    res.json(announcement);
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Duyuru güncellenirken hata oluştu." });
  }
};
