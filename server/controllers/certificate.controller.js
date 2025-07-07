const {
  EducationSet,
  Exam,
  Certificate,
  ExamUser,
  Education,
  EducationSetUser,
  User,
  EducationExam,
} = require("../models/index");
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const archiver = require("archiver");
const { v2: cloudinary } = require("cloudinary"); // EKLENEN SATIR

exports.getCompletedEducationSets = async (req, res) => {
  try {
    const userId = req.user.id;
    const requester = await User.findByPk(userId);
    const { educationSetId } = req.params;
    const completeUsers = await EducationSetUser.findAll({
      where: {
        educationSetId,
        completed: true,
      },
      include: [
        {
          model: User,
        },
        {
          model: EducationSet,
          include: [{ model: Education }],
        },
      ],
    });
    res.json({ completeUsers, requester });
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    res.status(500).json({ error: "Kullanıcı güncellenirken hata oluştu." });
  }
};

exports.createCertificate = async (req, res) => {
  try {
    const certificatesData = req.body.certificates;

    if (!Array.isArray(certificatesData) || certificatesData.length === 0) {
      return res.status(400).json({ error: "Sertifika verileri boş veya geçersiz." });
    }

    const tempDir = path.resolve(__dirname, "temp_certs");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const uploadedCertificates = [];

    for (const certData of certificatesData) {
      const data = {
        AdiSoyadi: `${certData.name} ${certData.surname}`,
        TCNo: certData.tc,
        KursNo: "Kurs 1",
        KursAdi: certData.education_name,
        KursBaslangicTarihi: certData.education_date,
        KursBitisTarihi: certData.educationSet_end_date || "",
        EgitimKurulusYetkilisi: certData.requester,
        EgitmenAdi: certData.educatorName,
        SertifikaNo: certData.certificate_number,
      };

      const templatePath = path.resolve(__dirname, "template.docx");
      const content = fs.readFileSync(templatePath, "binary");
      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "«", end: "»" },
      });

      doc.render(data);
      const buf = doc.getZip().generate({ type: "nodebuffer" });

      const outputFileName = `sertifika_${Date.now()}.docx`;
      const outputPath = path.resolve(tempDir, outputFileName);
      fs.writeFileSync(outputPath, buf);

      // Cloudinary'e yükle
      const result = await cloudinary.uploader.upload(outputPath, {
        resource_type: "raw",
        folder: "certificates",
        public_id: `certificate_${Date.now()}`,
      });

      // DB'ye kayıt (şimdi certificate_url hazır)
      const certificate = await Certificate.create({
        ...certData,
        certificate_url: result.secure_url,
      });

      fs.unlinkSync(outputPath); // Geçici dosya sil

      uploadedCertificates.push({
        id: certificate.id,
        url: result.secure_url,
        name: certData.name,
        surname: certData.surname,
      });
    }

    res.status(201).json({
      message: "Sertifikalar başarıyla oluşturuldu ve yüklendi.",
      data: uploadedCertificates,
    });
  } catch (error) {
    console.error("Sertifikalar oluşturulurken hata:", error);
    res.status(500).json({ error: "Sertifikalar oluşturulurken hata oluştu." });
  }
};


exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.findAll();
    res.json(certificates);
  } catch (error) {
    console.error("Sertifikalar alınırken hata:", error);
    res.status(500).json({ error: "Sertifikalar alınırken hata oluştu." });
  }
};
