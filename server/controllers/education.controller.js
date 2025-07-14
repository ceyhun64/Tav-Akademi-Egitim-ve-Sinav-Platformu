const {
  Education,
  EducationPages,
  EduAndEduSet,
  EducationUser,
} = require("../models/index");
const fs = require("fs");
const { fromPath } = require("pdf2pic");
const { PDFDocument } = require("pdf-lib");
const { fromBuffer } = require("pdf2pic");

const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const logActivity = require("../helpers/logActivity");

// Galeriyi getir
exports.getAllEducations = async (req, res) => {
  try {
    const educations = await Education.findAll();
    res.status(200).json(educations);
  } catch (error) {
    console.error("eğitim alanı hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// id ye göre eğitim getir
exports.getEducationById = async (req, res) => {
  try {
    const { id } = req.params;
    const education = await Education.findByPk(id);
    if (!education) {
      return res.status(404).json({ message: "Eğitim öğesi bulunamadı." });
    }

    res.status(200).json(education);
  } catch (error) {
    console.error("eğitim alanı hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//educationSetId ye göre eğitim getirme
exports.getEducationByEducationSetId = async (req, res) => {
  try {
    const { id } = req.params;

    const education = await EduAndEduSet.findAll({
      where: { educationSetId: id },
    });
    if (!education) {
      return res.status(404).json({ message: "Eğitim bulunamadı." });
    }
    res.status(200).json(education);
  } catch (error) {
    console.error("eğitim alanı hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//type a göre eğitim getir
exports.getEducationByType = async (req, res) => {
  try {
    const { type } = req.params;
    const education = await Education.findAll({ where: { type } });
    if (!education) {
      return res.status(404).json({ message: "Eğitim bulunamadı." });
    }
    res.status(200).json(education);
  } catch (error) {
    console.error("eğitim alanı hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Tekli dosya yükleme (her sayfa için farklı süre)

exports.uploadSingleFile = async (req, res) => {
  try {
    const { name, duration, type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Dosya yüklenmedi." });
    }

    const fileUrl = file.secure_url || file.path;
    const ext = path.extname(file.originalname).toLowerCase();
    let numPages = 0;
    let pageImages = [];

    if (ext === ".pdf") {
      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
      });
      const pdfBuffer = Buffer.from(response.data);

      const pdfDoc = await PDFDocument.load(pdfBuffer);
      numPages = pdfDoc.getPageCount();

      const convert = fromBuffer(pdfBuffer, {
        density: 200,
        format: "jpeg",
        width: 1000,
        height: 1414,
        saveFilename: "page",
        savePath: "./tmp", // Render destekli geçici klasör
      });

      for (let i = 1; i <= numPages; i++) {
        const result = await convert(i); // i = page number
        const uploadRes = await cloudinary.uploader.upload(result.path, {
          folder: "education_pages",
        });
        pageImages.push(uploadRes.secure_url);

        // Temizle
        fs.unlinkSync(result.path);
      }
    }

    const newEducation = await Education.create({
      name,
      duration,
      type,
      file_url: fileUrl,
      num_pages: numPages,
    });

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı '${name}' adlı eğitimi oluşturdu.`,
      category: "Education",
    });

    res.status(201).json({ newEducation, pages: pageImages });
  } catch (error) {
    console.error("Tekli dosya yükleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Sayfa süresi ekleme
exports.addPageDuration = async (req, res) => {
  try {
    const { id } = req.params; // Eğitim ID'sini URL parametrelerinden alır
    const pages = req.body.pages; // Sayfa süreleri verisini request body'sinden alır

    // Her bir sayfa için süreleri veritabanına kaydeder/günceller.
    // Burada duration değeri saniye cinsinden saklanır, çünkü frontend'den saniye olarak gelmektedir.
    const educationPages = await Promise.all(
      pages.map(({ page, duration }) => {
        const parsedDuration = parseInt(duration, 10); // Gelen string süreyi tamsayıya çevirir
        return EducationPages.create({
          // Veya update/upsert kullanabilirsiniz
          educationId: id,
          page,
          duration: isNaN(parsedDuration) ? 0 : parsedDuration, // Sayı değilse 0 olarak ayarlar
        });
      })
    );

    // Tüm sayfaların toplam süresini saniye cinsinden hesaplar
    const totalDurationInSeconds = pages.reduce((sum, p) => {
      const dur = parseInt(p.duration, 10);
      return sum + (isNaN(dur) ? 0 : dur); // Geçersiz süreleri 0 olarak kabul eder
    }, 0);

    // Toplam süreyi saniyeden dakikaya çevirir ve aşağı yuvarlar (örneğin 121 saniye -> 2 dakika)
    const totalDurationInMinutes = Math.floor(totalDurationInSeconds / 60);

    // Ana Education modelini toplam dakika süresiyle günceller
    await Education.update(
      { duration: totalDurationInMinutes },
      { where: { id } }
    );

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı '${id}' ID'li eğitimin sayfa sürelerini güncelledi.`,
      category: "Education",
    });
    // Başarılı yanıt gönderir
    res.status(200).json(educationPages);
  } catch (error) {
    // Hata durumunda konsola log düşer ve sunucu hatası mesajı gönderir
    console.error("Sayfa süresi güncelleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//sayfa süresi getirme
exports.getPageDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const educationPages = await EducationPages.findAll({
      where: { educationId: id },
    });
    res.status(200).json(educationPages);
  } catch (error) {
    console.error("Sayfa süresi hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Çoklu dosya yükleme
exports.uploadMultipleFiles = async (req, res) => {
  try {
    const { name, duration, type } = req.body;
    const fileUrls = req.files.map((file) => file.path); // Dosya URL'lerini alıyoruz

    // Her bir dosya için eğitim kaydı oluşturuyoruz
    const newEducations = await Promise.all(
      fileUrls.map((fileUrl) =>
        Education.create({
          name,
          duration,
          type,
          file_url: fileUrl, // Her dosyanın URL'sini buraya ekliyoruz
        })
      )
    );
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı '${newEducations.length}' adet eğitim dosyası yükledi.`,
      category: "Education",
    });

    res.status(201).json(newEducations); // Başarılı sonuç
  } catch (error) {
    console.error("Çoklu dosya yükleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// dosya silme
exports.deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const education = await Education.findByPk(id);

    if (!education) {
      return res.status(404).json({ message: "Galeri öğesi bulunamadı." });
    }

    // İlgili dosya varsa sistemden de sil (isteğe bağlı)
    if (education.image && fs.existsSync(education.image)) {
      fs.unlinkSync(education.image);
    }
    // Eğitim kaydını siliyoruz
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı '${education.name}' adlı eğitimi sildi.`,
      category: "Education",
    });
    await education.destroy();
    res.status(200).json({ message: "Dosya başarıyla silindi." });
  } catch (error) {
    console.error("Dosya silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// dosya güncelleme
exports.updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, type } = req.body;
    const fileUrl = req.file ? req.file.path : null;

    const newEducation = await Education.findByPk(id);
    if (!newEducation) {
      return res.status(404).json({ message: "Galeri öğesi bulunamadı." });
    }

    await newEducation.update({
      name,
      duration,
      type,
      file_url: fileUrl,
    });

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı '${newEducation.name}' adlı eğitimi güncelledi.`,
      category: "Education",
    });

    res.status(200).json(newEducation);
  } catch (error) {
    console.error("Resim güncelleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//educationUser güncelleme
exports.updateEducationUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      completed,
      entry_date,
      entry_time,
      exit_date,
      exit_time,
      lastSection,
      lastTime,
    } = req.body;
    const educationUser = await EducationUser.findOne({
      where: { educationId: id, userId },
    });
    if (!educationUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    await educationUser.update({
      completed,
      entry_date,
      entry_time,
      exit_date,
      exit_time,
      lastSection,
      lastTime,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı '${id}' ID'li eğitimi tamamladı.`,
    });
    res.status(200).json({ message: "Kullanıcı başarıyla güncellendi." });
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    res.status(500).json({ error: "Kullanıcı güncellenirken hata oluştu." });
  }
};

//tamamlanmış eğitimleri getirme
exports.getCompletedEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const educationUsers = await EducationUser.findAll({
      where: { userId, completed: true },
    });
    const educationIds = educationUsers.map(
      (educationUser) => educationUser.educationSetId
    );
    const educations = await Education.findAll({
      where: { id: { [Op.in]: educationIds } },
    });

    res.status(200).json(educations);
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    res.status(500).json({ error: "Kullanıcı güncellenirken hata oluştu." });
  }
};
