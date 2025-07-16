const {
  Education,
  EducationPages,
  EduAndEduSet,
  EducationUser,
} = require("../models/index");
const logActivity = require("../helpers/logActivity");
// Tekli dosya yükleme (her sayfa için farklı süre)
const {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  ExportPDFToImagesJob,
  ExportPDFToImagesTargetFormat,
  ExportPDFToImagesOutputType,
  ExportPDFToImagesParams,
  ExportPDFToImagesResult,
  SDKError,
  ServiceUsageError,
  ServiceApiError,
} = require("@adobe/pdfservices-node-sdk");
const os = require("os");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
// Yardımcı: URL olup olmadığını kontrol eder
function isUrl(str) {
  return str.startsWith("http://") || str.startsWith("https://");
}

// Yardımcı: URL'den PDF'yi indirip geçici dosya oluşturur
async function downloadToTempFile(url) {
  const tempPath = path.join(os.tmpdir(), `download_${Date.now()}.pdf`);
  const writer = fs.createWriteStream(tempPath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  await new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  return tempPath;
}
exports.uploadSingleFile = async (req, res) => {
  let readStream;
  let tempFilePath;

  try {
    const { name, duration, type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Dosya yüklenmedi." });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf") {
      return res
        .status(400)
        .json({ message: "Sadece PDF dosyaları destekleniyor." });
    }

    // Adobe Credentials
    const credentials = new ServicePrincipalCredentials({
      clientId: "bff289c0382e4c81a70ea65fc4a9f896",
      clientSecret: "p8e-pi8g_A-wmbHxSj08okSNidei5bHasSWK",
    });

    const pdfServices = new PDFServices({ credentials });

    // Cloudinary URL'den dosya indir (gerekirse)
    let filePath = file.path;
    if (isUrl(filePath)) {
      tempFilePath = await downloadToTempFile(filePath);
      filePath = tempFilePath;
    }

    // Dosyayı stream olarak oku
    readStream = fs.createReadStream(filePath);
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF,
    });

    const params = new ExportPDFToImagesParams({
      targetFormat: ExportPDFToImagesTargetFormat.JPEG,
      outputType: ExportPDFToImagesOutputType.LIST_OF_PAGE_IMAGES,
    });

    const job = new ExportPDFToImagesJob({ inputAsset, params });
    const pollingURL = await pdfServices.submit({ job });
    const result = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExportPDFToImagesResult,
    });

    const resultAssets = result.result.assets;
    const tempDir = path.join(__dirname, "..", "tmp");
    fs.mkdirSync(tempDir, { recursive: true });

    const pageImageUrls = [];

    for (let i = 0; i < resultAssets.length; i++) {
      const imageAsset = resultAssets[i];
      const tempImagePath = path.join(
        tempDir,
        `page_${Date.now()}_${i + 1}.jpeg`
      );

      const streamAsset = await pdfServices.getContent({ asset: imageAsset });
      const outputStream = fs.createWriteStream(tempImagePath);

      await new Promise((resolve, reject) => {
        streamAsset.readStream
          .pipe(outputStream)
          .on("finish", resolve)
          .on("error", reject);
      });

      const uploadResult = await cloudinary.uploader.upload(tempImagePath, {
        folder: "education_pages",
      });

      pageImageUrls.push(uploadResult.secure_url);
      fs.unlinkSync(tempImagePath);
    }

    // Eğitim kaydını oluştur
    const newEducation = await Education.create({
      name,
      duration,
      type,
      file_url: file.path, // orijinal path (Cloudinary URL olabilir)
      num_pages: pageImageUrls.length,
      page_image_urls: pageImageUrls,
    });

    res.status(201).json({ newEducation, pages: pageImageUrls });
  } catch (error) {
    console.error("Tekli dosya yükleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  } finally {
    readStream?.destroy();
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath); // Geçici indirilmiş PDF'yi temizle
    }
  }
};
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

    // await logActivity({
    //   userId: req.user.id,
    //   action: `${req.user.name} adlı kullanıcı '${id}' ID'li eğitimin sayfa sürelerini güncelledi.`,
    //   category: "Education",
    // });
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
    // await logActivity({
    //   userId: req.user.id,
    //   action: `${req.user.name} adlı kullanıcı '${newEducations.length}' adet eğitim dosyası yükledi.`,
    //   category: "Education",
    // });

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
