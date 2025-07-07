const { User, Role } = require("../models/index");
const { Op } = require("sequelize");
const logActivity = require("../helpers/logActivity");

exports.update_user_details = async (req, res) => {
  try {
    // Gelen form verileri
    const { id } = req.params;
    const {
      tcno,
      sicil,
      ad,
      soyad,
      kullanici_adi,
      sifre, // boş gönderilirse şifre değişmeyecek
      telefon,
      email,
      il,
      ilce,
      adres,
      ise_giris_tarihi,
      cinsiyet,
      grup,
      lokasyon,
    } = req.body;

    // Zorunlu kontroller
    if (!tcno || !sicil || !ad || !soyad || !kullanici_adi || !email) {
      return res.status(400).json({ message: "Zorunlu alanlar eksik." });
    }

    // Benzersiz alanlar kontrolü: Kendi kaydımız hariç çakışma varsa hata
    const conflict = await User.findOne({
      where: {
        id,
        [Op.or]: [{ email }, { kullanici_adi }, { tcno }, { sicil }],
      },
    });
    if (conflict) {
      return res.status(400).json({
        message: "Email, kullanıcı adı, TC no veya sicil zaten kullanılıyor.",
      });
    }

    // Güncellenecek alanları bir objede toplayın
    const updates = {};
    if (tcno) updates.tcno = tcno;
    if (sicil) updates.sicil = sicil;
    if (ad) updates.ad = ad;
    if (soyad) updates.soyad = soyad;
    if (kullanici_adi) updates.kullanici_adi = kullanici_adi;
    if (telefon) updates.telefon = telefon;
    if (email) updates.email = email;
    if (il) updates.il = il;
    if (ilce) updates.ilce = ilce;
    if (adres) updates.adres = adres;
    if (ise_giris_tarihi) updates.ise_giris_tarihi = ise_giris_tarihi;
    if (cinsiyet) updates.cinsiyet = cinsiyet;
    if (grup) updates.grup = grup;
    if (lokasyon) updates.lokasyon = lokasyon;

    // Şifre eğer boş değilse, güncellenecek alanlara ekleyin
    if (sifre && sifre.trim() !== "") {
      updates.sifre = sifre;
    }

    // Dosya yüklendiyse (multer ile), path'i ekleyin
    if (req.file) {
      updates.image = req.file.path;
    }

    // Güncelleme işlemi
    await User.update(updates, { where: { id: userId } });

    // Güncellenmiş kullanıcıyı tekrar okuyup dönün
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["sifre"] },
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kullanıcı detayları güncellendi.`,
      category: "User",
    });

    return res.status(200).json({
      message: "Kullanıcı detayları başarıyla güncellendi.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return res
      .status(500)
      .json({ message: "Sunucu hatası.", error: error.message });
  }
};

exports.get_all_users = async (req, res) => {
  try {
    const roleId = req.user.roleId;
    const userId = req.user.id;

    // Kullanıcının rol seviyesini al
    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ message: "Role bulunamadı" });
    const level = role.level;

    // Kullanıcı bilgileri
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    const grupId = user.grupId;
    const lokasyonId = user.lokasyonId;

    // Level'a göre rol id'lerini al
    const lowerRoles = await Role.findAll({
      where: {
        level: { [Op.gte]: level },
      },
    });
    const roleIds = lowerRoles.map((role) => role.id);

    let users;
    if (roleId === 1) {
      // Admin tüm kullanıcıları getirir
      users = await User.findAll({
        include: [{ model: Role, as: "role" }],
      });
    } else {
      // Diğer kullanıcılar için grup, lokasyon ve roleIds filtreli kullanıcıları getir
      users = await User.findAll({
        where: {
          grupId,
          lokasyonId,
          roleId: { [Op.in]: roleIds },
        },
        include: [{ model: Role, as: "role" }],
      });
    }

    res.json(users);
  } catch (error) {
    console.error("get_all_users error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.delete_users = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "Geçersiz kullanıcılar." });
    }

    // Kullanıcıları tek tek sil, Promise.all ile hepsini paralel yap
    await Promise.all(userIds.map((id) => User.destroy({ where: { id } })));

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kullanıcı silindi.`,
      category: "User",
    });
    res.json({ message: "Kullanıcılar başarıyla silindi." });
  } catch (error) {
    console.error("Silme işleminde hata:", error);
    res.status(500).json({ message: error.message || "Sunucu hatası." });
  }
};

exports.aktif_pasif_user = async (req, res) => {
  try {
    const { userIds, durum } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "Geçersiz kullanıcılar." });
    }
    await Promise.all(
      userIds.map((id) => User.update({ durum }, { where: { id } }))
    );
    const updatedUsers = await User.findAll();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kullanıcı aktif pasif durumu güncellendi.`,
      category: "User",
    });
    res.json(updatedUsers);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    res.status(500).json({ message: error.message || "Sunucu hatası." });
  }
};
