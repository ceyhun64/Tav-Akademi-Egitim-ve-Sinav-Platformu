require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendMail = require("../helpers/sendMail");
const logActivity = require("../helpers/logActivity");
const { User, Session } = require("../models/index");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const path = require("path");

const XLSX = require("xlsx");
const fs = require("fs");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

// Kullanıcı kaydı
exports.register = async (req, res) => {
  try {
    const {
      tcno,
      sicil,
      ad,
      soyad,
      kullanici_adi,
      sifre, // Şifre artık modelde hash'leniyor
      telefon,
      email,
      il,
      ilce,
      adres,
      ise_giris_tarihi,
      cinsiyet,
      grupId,
      lokasyonId,
    } = req.body;

    // Resim kaydetme
    const image = req.file ? req.file.path : null; // Tek resim için

    // Zorunlu alan kontrolleri
    if (
      !tcno ||
      !sicil ||
      !ad ||
      !soyad ||
      !kullanici_adi ||
      !sifre ||
      !email
    ) {
      return res.status(400).json({ message: "Zorunlu alanlar eksik." });
    }

    // Benzersiz alan kontrolleri
    const [existingMail, existingUsername, existingTc, existingSicil] =
      await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { kullanici_adi } }),
        User.findOne({ where: { tcno } }),
        User.findOne({ where: { sicil } }),
      ]);

    if (existingMail || existingUsername || existingTc || existingSicil) {
      return res.status(400).json({
        message:
          "Kullanıcı zaten kayıtlı. (Email, kullanıcı adı, TC veya sicil zaten var.)",
      });
    }

    // Kullanıcı oluştur
    const newUser = await User.create({
      tcno,
      sicil,
      ad,
      soyad,
      kullanici_adi,
      sifre, // Şifre modelde hash'lenecek
      telefon,
      email,
      il,
      ilce,
      adres,
      ise_giris_tarihi,
      cinsiyet,
      grupId,
      lokasyonId,
      image: image, // Resim yolu kaydediliyor
      durum: 1,
      roleId: 0,
      is2FAEnabled: false,
    });
    // Token oluştur (createAuthToken fonksiyonu varsa)
    const token = newUser.createAuthToken(); // Eğer modelde varsa

    // Mail gönder
    const mailOptions = {
      to: email,
      subject: "Kayıt Başarılı",
      text: `Merhaba ${ad}, kayıt işleminiz başarılı!`,
    };
    await sendMail(mailOptions); // Mail gönderme işlemi

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından ${ad} ${soyad} için yeni kullanıcı kaydı oluşturuldu`,
      category: "User",
    });

    res
      .status(201)
      .header("x-auth-token", token) // Token'ı header'da gönder
      .json({ message: "Kayıt başarılı.", user: newUser });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    res.status(500).json({ message: "Sunucu hatası.", error: error.message });
  }
};

exports.uploadUsersFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Excel dosyası yüklenmedi." });
    }

    // Cloudinary'den gelen dosya URL'si (bazı multer-cloudinary versiyonlarında 'path' yerine 'secure_url' olabilir)
    const fileUrl = req.file.path || req.file.secure_url;

    // Dosyayı indir, buffer olarak al
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

    // Buffer'ı workbook olarak oku
    const workbook = XLSX.read(response.data, { type: "buffer" });
    const sheet = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    const results = {
      created: [],
      skipped: [],
      errors: [],
    };

    for (const [i, row] of data.entries()) {
      const {
        tcno,
        sicil,
        ad,
        soyad,
        kullanici_adi,
        sifre,
        telefon,
        email,
        il,
        ilce,
        adres,
        ise_giris_tarihi,
        cinsiyet,
        grupId,
        lokasyonId,
        roleId,
      } = row;

      if (
        !tcno ||
        !sicil ||
        !ad ||
        !soyad ||
        !kullanici_adi ||
        !sifre ||
        !email
      ) {
        results.skipped.push({
          row: i + 2,
          reason: "Zorunlu alanlar eksik.",
        });
        continue;
      }

      const [existingMail, existingUsername, existingTc, existingSicil] =
        await Promise.all([
          User.findOne({ where: { email } }),
          User.findOne({ where: { kullanici_adi } }),
          User.findOne({ where: { tcno } }),
          User.findOne({ where: { sicil } }),
        ]);

      if (existingMail || existingUsername || existingTc || existingSicil) {
        results.skipped.push({
          row: i + 2,
          reason: "Kayıt zaten var (TC, sicil, kullanıcı adı veya email).",
        });
        continue;
      }

      // Burada resim kontrolü eğer varsa
      const localImagePath = path.join(
        __dirname,
        "../public/images",
        `image-${tcno}.jpg`
      );
      const imageExists = fs.existsSync(localImagePath);
      const imageUrl = imageExists ? `/images/image-${tcno}.jpg` : null;

      try {
        const hashedPassword = await bcrypt.hash(sifre, 10);

        const newUser = await User.create({
          tcno,
          sicil,
          ad,
          soyad,
          kullanici_adi,
          sifre: hashedPassword,
          telefon,
          email,
          il,
          ilce,
          adres,
          ise_giris_tarihi,
          cinsiyet,
          grupId,
          lokasyonId,
          roleId,
          image: imageUrl, // URL olarak kaydet
          durum: 1,
          yetki: "kullanici",
        });

        results.created.push({
          row: i + 2,
          ad: newUser.ad,
          soyad: newUser.soyad,
        });

        await sendMail({
          to: email,
          subject: "Kayıt Başarılı",
          text: `Merhaba ${ad}, sistem kaydınız başarıyla yapıldı.`,
        });

        if (req.user) {
          await logActivity({
            userId: req.user.id,
            action: `${req.user.name} tarafından ${ad} ${soyad} eklendi.`,
            category: "User",
          });
        }
      } catch (err) {
        results.errors.push({ row: i + 2, error: err.message });
      }
    }

    return res.status(200).json({
      message: "Excel'den kullanıcılar işlendi.",
      results,
    });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    res.status(500).json({ message: "Sunucu hatası.", error: error.message });
  }
};

exports.uploadUserImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Hiç dosya yüklenmedi." });
    }

    const results = {
      uploaded: [],
      matched: [],
      skipped: [],
    };

    for (const file of req.files) {
      const originalName = file.originalname;

      // Artık sadece 4-6 haneli sicil numarası ile başlayan dosya adları kabul ediliyor
      const match = /^(\d{4,10})\.(jpg|jpeg|png)$/i.exec(originalName);

      if (!match) {
        results.skipped.push({
          file: originalName,
          reason: "Geçersiz dosya ismi formatı. (örnek: 1234.jpg)",
        });
        continue;
      }

      const sicil = match[1];
      const user = await User.findOne({ where: { sicil } });

      if (!user) {
        results.skipped.push({
          file: originalName,
          reason: `Kullanıcı bulunamadı (Sicil: ${sicil})`,
        });
        continue;
      }

      const imageUrl = file.path || file.secure_url || file.url;

      if (!imageUrl) {
        results.skipped.push({
          file: originalName,
          reason: "Cloudinary'den URL alınamadı.",
        });
        continue;
      }

      user.image = imageUrl;
      await user.save();

      results.uploaded.push(originalName);
      results.matched.push({
        sicil,
        user: `${user.ad} ${user.soyad}`,
        image: imageUrl,
      });
    }

    return res.status(200).json({
      message: "Cloudinary'e toplu resim yükleme tamamlandı.",
      summary: results,
    });
  } catch (err) {
    console.error("Toplu resim yükleme hatası:", err);
    return res
      .status(500)
      .json({ message: "Sunucu hatası", error: err.message });
  }
};

exports.syncUserImages = async (req, res) => {
  try {
    const imageDir = path.join(__dirname, "../public/images");
    const files = fs.readdirSync(imageDir);

    let updatedCount = 0;
    let skipped = [];
    let updated = [];

    for (const file of files) {
      // image-<tcno>.jpg gibi olmalı
      const match = /^image-(\d{11})\.(jpg|jpeg|png)$/.exec(file);
      if (!match) {
        skipped.push({ file, reason: "Dosya adı uygun formatta değil." });
        continue;
      }

      const tcno = match[1];
      const imageUrl = `/images/${file}`;

      const user = await User.findOne({ where: { tcno } });
      if (!user) {
        skipped.push({ file, reason: `Kullanıcı bulunamadı (TC: ${tcno})` });
        continue;
      }

      // Kullanıcıya resmi eşleştir
      user.image = imageUrl;
      await user.save();

      updated.push({ user: `${user.ad} ${user.soyad}`, tcno });
      updatedCount++;
    }

    res.status(200).json({
      message: `Toplam ${updatedCount} kullanıcıya resim eşlendi.`,
      updated,
      skipped,
    });
  } catch (error) {
    console.error("Resim eşleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

//2 adımda doğrulama kaydı qr code ile setup yapıyoruz kuruyoruz
exports.setup2FA = async (req, res) => {
  const { userId } = req.body;
  console.log("userId:", userId);
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    // Eğer zaten secret varsa, aynı QR kodu tekrar gönder
    if (user.twoFactorSecret) {
      const otpauthUrl = speakeasy.otpauthURL({
        secret: user.twoFactorSecret,
        label: `Tav Akademi (${user.kullanici_adi})`,
        encoding: "base32",
      });
      const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);
      return res.json({ qrCodeDataURL });
    }

    // Secret yoksa oluştur ve kaydet
    const secret = speakeasy.generateSecret({
      name: `Tav Akademi (${user.kullanici_adi})`,
    });
    user.twoFactorSecret = secret.base32;
    await user.save();

    const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);

    res.json({ qrCodeDataURL, secret: secret.base32 });
  } catch (err) {
    console.error("2FA setup hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

//kullancının göndereceği 6 haneli kod (uygulamadan aldığı)
exports.verify2FA = async (req, res) => {
  const { userId, token } = req.body;
  console.log("userId:", userId);
  console.log("token:", token);
  try {
    const user = await User.findByPk(userId);
    if (!user || !user.twoFactorSecret)
      return res
        .status(400)
        .json({ message: "2FA kurulmamış veya kullanıcı bulunamadı." });

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret, // doğru alan adı neyse onu yaz
      encoding: "base32",
      token: String(token), // token string olmalı
      window: 1,
    });

    if (!verified)
      return res.status(400).json({ message: "Geçersiz 2FA kodu" });

    user.is2FAEnabled = true;
    await user.save();

    res.json({ message: "2FA başarıyla etkinleştirildi" });
  } catch (err) {
    console.error("2FA doğrulama hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
// Kullanıcı girişi
exports.login = async (req, res) => {
  const { kullanici_adi, sifre } = req.body;

  try {
    const user = await User.findOne({ where: { kullanici_adi } });
    if (!user)
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı kayıtlı değil." });

    const isMatch = await bcrypt.compare(sifre, user.sifre);
    if (!isMatch) return res.status(400).json({ message: "Hatalı şifre." });

    if (user.is2FAEnabled) {
      // 2FA açık, frontend'e 2FA kodu isteniyor diye bilgi ver
      return res.status(200).json({
        twoFARequired: true,
        message: "Lütfen 2FA kodunuzu girin.",
        userId: user.id,
      });
    } else {
      // 2FA kapalı ise direkt login yap

      // Var olan aktif oturumu kapat
      const existingSession = await Session.findOne({
        where: { userId: user.id, isActive: true },
      });
      if (existingSession) await existingSession.destroy();

      // Yeni session oluştur
      const sessionId = uuidv4();
      await Session.create({
        userId: user.id,
        sessionId,
        isActive: true,
      });

      await logActivity({
        userId: user.id,
        action: `${user.ad} ${user.soyad} adlı kullanıcı sisteme giriş yaptı`,
        category: "User",
      });

      const token = user.createAuthToken();
      return res.status(200).json({
        message: "Giriş başarılı.",
        userId: user.id,
        sessionId,
        ad: user.ad,
        is2FAEnabled: user.is2FAEnabled,
        token,
      });
    }
  } catch (err) {
    console.error("Login hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

//admin girişi
exports.adminLogin = async (req, res) => {
  const { kullanici_adi, sifre } = req.body;

  try {
    const user = await User.findOne({ where: { kullanici_adi } });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı kayıtlı değil." });
    }

    if (user.roleId == 0 || user.roleId == null) {
      return res.status(403).json({
        message: "Yetkiniz yok veya admin paneline erişim izniniz bulunmuyor.",
        roleId: user.roleId,
      });
    }

    const isMatch = await bcrypt.compare(sifre, user.sifre);
    if (!isMatch) {
      return res.status(400).json({ message: "Hatalı şifre." });
    }

    if (user.is2FAEnabled) {
      // 2FA aktif, frontend'e 2FA kodu isteniyor diye bilgi ver
      return res.status(200).json({
        twoFARequired: true,
        message: "Lütfen 2FA kodunuzu girin.",
        userId: user.id,
      });
    } else {
      // 2FA yoksa direkt login

      // Aktif oturumu sonlandır
      const existingSession = await Session.findOne({
        where: { userId: user.id, isActive: true },
      });
      if (existingSession) await existingSession.destroy();

      // Yeni session oluştur
      const sessionId = uuidv4();
      await Session.create({
        userId: user.id,
        sessionId,
        isActive: true,
      });

      await logActivity({
        userId: user.id,
        action: `${user.ad} ${user.soyad} adlı yönetici sisteme giriş yaptı`,
        category: "Yönetici",
      });

      const token = user.createAuthToken();
      return res.status(200).json({
        message: "Giriş başarılı.",
        userId: user.id,
        sessionId,
        ad: user.ad,
        token,
      });
    }
  } catch (err) {
    console.error("Login hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Kullanıcı çıkışı
exports.logout = async (req, res) => {
  const sessionId = req.header("x-session-id");

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID eksik!" });
  }

  try {
    // Session'ı pasifleştir
    const session = await Session.findOne({ where: { sessionId } });
    if (session) {
      session.isActive = false;
      await session.save();
      await logActivity({
        userId: req.user.id,
        action: `${req.user.name} adlı kullanıcı sistemden çıkış yaptı`,
        category: "User",
      });

      return res.status(200).json({ message: "Çıkış yapıldı!" });
    } else {
      return res.status(400).json({ message: "Session bulunamadı!" });
    }
  } catch (error) {
    console.error("Logout hatası:", error);
    res.status(500).json({ message: "Çıkış sırasında hata oluştu." });
  }
};

//şifre güncelleme maili gönderir
exports.passwordEmail = async (req, res) => {
  const email = req.body.email;
  // Kullanıcıyı veritabanında bul
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "Kullanıcı bulunamadı." });
  }

  // Şifre sıfırlama token'ı oluştur (JWT kullanıyoruz)
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: "1h" }
  );

  // Şifre sıfırlama linki
  const resetLink = `${process.env.FRONTEND_URL}/update-password/${token}`;

  // Mail gönderme
  const mailOptions = {
    to: email,
    subject: "Şifre Sıfırlama",
    text: `Şifre sıfırlama işlemi için aşağıdaki linke tıklayın: ${resetLink}`,
  };

  try {
    await sendMail(mailOptions); // Mail gönder
    await logActivity({
      userId: user.id,
      action: `${user.ad} ${user.soyad} adlı kullanıcı için şifre sıfırlama maili gönderildi`,
      category: "User",
    });

    res
      .status(200)
      .json({ message: "Şifre sıfırlama için e-posta gönderildi." });
  } catch (error) {
    console.error("Mail gönderimi sırasında hata:", error);
    res.status(500).json({ message: "E-posta gönderme hatası." });
  }
};

// Şifre güncelleme (şifre değiştir butonuna tıklandığında mail gönderir , maildeki link buraya yönlendirir)
exports.updatePassword = async (req, res) => {
  const { token } = req.params; // URL'den gelen token
  const { sifre, yenisifre, tekraryenisifre } = req.body;

  if (!sifre || !yenisifre || !tekraryenisifre) {
    return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
  }

  // Token'ı doğrula
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    // Token'dan kullanıcıyı bul
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // Eski şifreyi kontrol et
    const isMatch = await bcrypt.compare(sifre, user.sifre);
    if (!isMatch) {
      return res.status(400).json({ message: "Mevcut şifre hatalı." });
    }

    // Yeni şifreleri karşılaştır
    if (yenisifre !== tekraryenisifre) {
      return res.status(400).json({ message: "Yeni şifreler eşleşmiyor." });
    }

    // Yeni şifreyi güncelle
    await user.update({ sifre: yenisifre });
    await logActivity({
      userId: user.id,
      action: `${user.ad} ${user.soyad} adlı kullanıcı şifresini güncelledi`,
      category: "User",
    });

    res.status(200).json({ message: "Şifre başarıyla güncellendi." });
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    res.status(400).json({ message: "Geçersiz veya süresi dolmuş token." });
  }
};
