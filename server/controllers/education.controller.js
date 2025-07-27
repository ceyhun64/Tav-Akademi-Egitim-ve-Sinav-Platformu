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

// Yardımcı: URL'den dosyayı indirip geçici dosya oluşturur
// Not: Bu fonksiyon artık sadece PDF değil, genel bir dosya indirebilir.
async function downloadToTempFile(url, fileExtension) {
  const tempPath = path.join(
    os.tmpdir(),
    `download_${Date.now()}${fileExtension}`
  );
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
  let tempFilePath; // Orijinal dosyadan indirildiyse geçici yol

  try {
    const { name, duration, type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Dosya yüklenmedi." });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const allowedPdfs = [".pdf"];
    const allowedVideos = [".mp4", ".mov", ".avi", ".wmv", ".webm", ".mkv"]; // Desteklenen video formatları
    const allowedPowerpoints = [".ppt", ".pptx"]; // Desteklenen PowerPoint formatları

    let fileTypeCategory; // "pdf", "video" veya "powerpoint" olabilir

    if (allowedPdfs.includes(ext)) {
      fileTypeCategory = "pdf";
    } else if (allowedVideos.includes(ext)) {
      fileTypeCategory = "video";
    } else if (allowedPowerpoints.includes(ext)) {
      fileTypeCategory = "powerpoint";
    } else {
      return res.status(400).json({
        message:
          "Desteklenmeyen dosya türü. Sadece PDF, Video (MP4, MOV, vb.) ve PowerPoint (PPT, PPTX) desteklenmektedir.",
      });
    }

    // Adobe Kimlik Bilgileri - Sadece PDF işlemleri için başlat
    let credentials;
    let pdfServices;
    if (fileTypeCategory === "pdf") {
      credentials = new ServicePrincipalCredentials({
        clientId: "bff289c0382e4c81a70ea65fc4a9f896",
        clientSecret: "p8e-pi8g_A-wmbHxSj08okSNidei5bHasSWK",
      });
      pdfServices = new PDFServices({ credentials });
    }

    // Cloudinary URL'den dosya indir (gerekirse) - `downloadToTempFile` fonksiyonu güncellendi
    let filePath = file.path;
    if (isUrl(filePath)) {
      tempFilePath = await downloadToTempFile(filePath, ext); // Uzantıyı da gönderiyoruz
      filePath = tempFilePath;
    }

    const pageImageUrls = [];
    let numPages = 0; // Sayfa sayısı veya video/PowerPoint ise 1

    switch (fileTypeCategory) {
      case "pdf":
        // Mevcut PDF'den resimlere dönüştürme mantığı (değişmedi)
        readStream = fs.createReadStream(filePath);
        const inputAssetPdf = await pdfServices.upload({
          readStream,
          mimeType: MimeType.PDF,
        });

        const paramsPdf = new ExportPDFToImagesParams({
          targetFormat: ExportPDFToImagesTargetFormat.JPEG,
          outputType: ExportPDFToImagesOutputType.LIST_OF_PAGE_IMAGES,
        });

        const jobPdf = new ExportPDFToImagesJob({
          inputAsset: inputAssetPdf,
          params: paramsPdf,
        });
        const pollingURLPdf = await pdfServices.submit({ job: jobPdf });
        const resultPdf = await pdfServices.getJobResult({
          pollingURL: pollingURLPdf,
          resultType: ExportPDFToImagesResult,
        });

        const resultAssetsPdf = resultPdf.result.assets;
        const tempDirPdf = path.join(os.tmpdir(), "education_temp_images");
        fs.mkdirSync(tempDirPdf, { recursive: true });

        for (let i = 0; i < resultAssetsPdf.length; i++) {
          const imageAsset = resultAssetsPdf[i];
          const tempImagePath = path.join(
            tempDirPdf,
            `page_${Date.now()}_${i + 1}.jpeg`
          );

          const streamAsset = await pdfServices.getContent({
            asset: imageAsset,
          });
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
          fs.unlinkSync(tempImagePath); // Geçici resmi sil
        }
        numPages = pageImageUrls.length;
        break;

      case "video":
        // Video dosyalarını doğrudan Cloudinary'ye yükle, dönüştürme yok.
        const videoUploadResult = await cloudinary.uploader.upload(filePath, {
          resource_type: "video", // Cloudinary'ye bunun bir video olduğunu bildir
          folder: "education_videos", // Videolar için ayrı bir klasör kullanmak mantıklı olabilir
          // Dönüştürme istemediğiniz için 'eager' veya başka dönüşüm seçenekleri eklemiyoruz.
        });
        pageImageUrls.push(videoUploadResult.secure_url); // Video URL'sini burada saklıyoruz
        numPages = 1; // Video için sayfa sayısı genellikle 1 kabul edilir (tek bir kaynak)
        break;

      case "powerpoint":
        // PowerPoint dosyalarını doğrudan Cloudinary'ye yükle, dönüştürme yok.
        // PPTX dosyalarını Cloudinary'ye docx/pdf olarak da yükleyebilirsiniz, ancak dönüştürme istemediğiniz belirtildi.
        const pptUploadResult = await cloudinary.uploader.upload(filePath, {
          resource_type: "raw", // PowerPoint için 'raw' veya 'auto' kullanılabilir. 'auto' Cloudinary'nin en iyi şekilde algılamasını sağlar.
          folder: "education_powerpoints", // PowerPoint'ler için ayrı bir klasör
        });
        pageImageUrls.push(pptUploadResult.secure_url); // PowerPoint dosyasının URL'sini saklıyoruz
        numPages = 1; // PowerPoint dosyasını tek bir varlık olarak kabul ediyoruz
        break;
    }

    // Eğitim kaydını oluştur
    const newEducation = await Education.create({
      name,
      duration,
      type,
      file_url: file.path, // Orijinal yol (Cloudinary URL veya yerel temp yol olabilir)
      file_type: fileTypeCategory, // Dosya kategorisini kaydet (pdf, video, powerpoint)
      num_pages: numPages,
      page_image_urls: pageImageUrls, // Bu alan artık video/PPTX URL'sini de içerebilir
    });

    res.status(201).json({ newEducation, pages: pageImageUrls });
  } catch (error) {
    console.error("Tekli dosya yükleme hatası:", error);
    // Adobe PDF Services'a özgü hata detaylarını logla (sadece PDF işlemleri sırasında ortaya çıkabilir)
    if (
      error instanceof SDKError ||
      error instanceof ServiceUsageError ||
      error instanceof ServiceApiError
    ) {
      console.error("Adobe PDF Services Hata Detayı:", error.message);
      if (error.requestTrackingId) {
        console.error(
          "Adobe PDF Services Request Tracking ID:",
          error.requestTrackingId
        );
      }
    }
    res.status(500).json({ message: "Sunucu hatası." });
  } finally {
    readStream?.destroy(); // Okuma stream'ini kapat

    // Tüm geçici dosyaları temizle
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    // Geçici resim klasörünü temizle (eğer boşsa)
    const tempDirForImages = path.join(os.tmpdir(), "education_temp_images");
    if (
      fs.existsSync(tempDirForImages) &&
      fs.readdirSync(tempDirForImages).length === 0
    ) {
      fs.rmdirSync(tempDirForImages, { recursive: true }); // Klasör boş olsa bile bazen rmdirSync recursive ister
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
      category: "Education",
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
