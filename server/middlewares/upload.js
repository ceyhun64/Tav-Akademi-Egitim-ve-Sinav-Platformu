const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage ayarı (görsel, video, pdf, sunum)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // MIME türüne göre format belirleme
    let resource_type = "auto"; // auto: image, video, raw gibi her şeyi destekler

    return {
      folder: "uploads",
      resource_type, // bu en kritik satır, otomatik tür belirlenmesini sağlar
      public_id: `${Date.now()}-${file.originalname}`, // dosya ismini benzersizleştir
    };
  },
});

// Tekli dosya yükleme
const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // max 100 MB
}).single("file"); // frontend'de formData.append("file", ...)

// Çoklu dosya yükleme (isteğe bağlı)
const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // her dosya max 100 MB
}).array("files", 100); // frontend'de formData.append("files", ...)

module.exports = { uploadSingle, uploadMultiple };
