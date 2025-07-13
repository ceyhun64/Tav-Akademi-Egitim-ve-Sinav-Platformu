const {
  EducationSet,
  Exam,
  Certificate,
  ExamUser,
  Education,
  EducationSetUser,
  User,
  EducationExam,
  Requester,
  Educator,
  CourseNo,
  CourseType,
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
      return res
        .status(400)
        .json({ error: "Sertifika verileri boş veya geçersiz." });
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
        KursNo: certData.course_no,
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

exports.getRequesters = async (req, res) => {
  try {
    const requesters = await Requester.findAll();
    res.json(requesters);
  } catch (error) {
    console.error("İstekciler alınırken hata:", error);
    res.status(500).json({ error: "İstekciler alınırken hata oluştu." });
  }
};
exports.getEducators = async (req, res) => {
  try {
    const educators = await Educator.findAll();
    res.json(educators);
  } catch (error) {
    console.error("Eğitmenler alınırken hata:", error);
    res.status(500).json({ error: "Eğitmenler alınırken hata oluştu." });
  }
};
exports.getCourseNos = async (req, res) => {
  try {
    const courseNos = await CourseNo.findAll();
    res.json(courseNos);
  } catch (error) {
    console.error("Kurs numaraları alınırken hata:", error);
    res.status(500).json({ error: "Kurs numaraları alınırken hata oluştu." });
  }
};
exports.getCourseTypes = async (req, res) => {
  try {
    const courseTypes = await CourseType.findAll();
    res.json(courseTypes);
  } catch (error) {
    console.error("Kurs tipleri alınırken hata:", error);
    res.status(500).json({ error: "Kurs tipleri alınırken hata oluştu." });
  }
};
exports.createRequester = async (req, res) => {
  try {
    const { name } = req.body;
    const requester = await Requester.create({
      name,
    });
    res.status(201).json(requester);
  } catch (error) {
    console.error("İstekçi oluşturulurken hata:", error);
    res.status(500).json({ error: "İstekçi oluşturulurken hata oluştu." });
  }
};
exports.createEducator = async (req, res) => {
  try {
    const { name } = req.body;
    const educator = await Educator.create({
      name,
    });
    res.status(201).json(educator);
  } catch (error) {
    console.error("Eğitmen oluşturulurken hata:", error);
    res.status(500).json({ error: "Eğitmen oluşturulurken hata oluştu." });
  }
};
exports.createCourseNo = async (req, res) => {
  try {
    const { name } = req.body;
    const courseNo = await CourseNo.create({
      name,
    });
    res.status(201).json(courseNo);
  } catch (error) {
    console.error("Kurs numarası oluşturulurken hata:", error);
    res
      .status(500)
      .json({ error: "Kurs numarası oluşturulurken hata oluştu." });
  }
};
exports.createCourseType = async (req, res) => {
  try {
    const { name } = req.body;
    const courseType = await CourseType.create({
      name,
    });
    res.status(201).json(courseType);
  } catch (error) {
    console.error("Kurs tipi oluşturulurken hata:", error);
    res.status(500).json({ error: "Kurs tipi oluşturulurken hata oluştu." });
  }
};
exports.deleteRequester = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = await Requester.findByPk(id);
    if (!requester) {
      return res.status(404).json({ error: "İstekçi bulunamadı." });
    }
    await requester.destroy();
    res.json(requester);
  } catch (error) {
    console.error("İstekçi silinirken hata:", error);
    res.status(500).json({ error: "İstekçi silinirken hata oluştu." });
  }
};
exports.deleteEducator = async (req, res) => {
  try {
    const { id } = req.params;
    const educator = await Educator.findByPk(id);
    if (!educator) {
      return res.status(404).json({ error: "Eğitmen bulunamadı." });
    }
    await educator.destroy();
    res.json(educator);
  } catch (error) {
    console.error("Eğitmen silinirken hata:", error);
    res.status(500).json({ error: "Eğitmen silinirken hata oluştu." });
  }
};
exports.deleteCourseNo = async (req, res) => {
  try {
    const { id } = req.params;
    const courseNo = await CourseNo.findByPk(id);
    if (!courseNo) {
      return res.status(404).json({ error: "Kurs numarası bulunamadı." });
    }
    await courseNo.destroy();
    res.json(courseNo);
  } catch (error) {
    console.error("Kurs numarası silinirken hata:", error);
    res.status(500).json({ error: "Kurs numarası silinirken hata oluştu." });
  }
};
exports.deleteCourseType = async (req, res) => {
  try {
    const { id } = req.params;
    const courseType = await CourseType.findByPk(id);
    if (!courseType) {
      return res.status(404).json({ error: "Kurs tipi bulunamadı." });
    }
    await courseType.destroy();
    res.json(courseType);
  } catch (error) {
    console.error("Kurs tipi silinirken hata:", error);
    res.status(500).json({ error: "Kurs tipi silinirken hata oluştu." });
  }
};
