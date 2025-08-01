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
const fsp = require("fs").promises; // promise bazlı
const path = require("path");
const JSZip = require("jszip");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const archiver = require("archiver");
const { v2: cloudinary } = require("cloudinary"); // EKLENEN SATIR
const axios = require("axios");
const mammoth = require("mammoth"); // For converting DOCX to HTML

async function createCertificateBufferZip(certificatesData) {
  const templatePath = path.resolve(__dirname, "template.docx");
  const templateContent = fs.readFileSync(templatePath, "binary");


  const zip = new JSZip();

  // Her sertifika için body parçasını topla
  let combinedBody = "";

  for (let i = 0; i < certificatesData.length; i++) {
    const certData = certificatesData[i];

    const zipTemplate = new PizZip(templateContent);
    const doc = new Docxtemplater(zipTemplate, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: "«", end: "»" },
    });

    doc.render({
      AdiSoyadi: `${certData.name} ${certData.surname}`,
      TCNo: certData.tc,
      KursNo: certData.course_no,
      KursAdi: certData.education_name,
      KursBaslangicTarihi: certData.education_date,
      KursBitisTarihi: certData.educationSet_end_date || "",
      EgitimKurulusYetkilisi: certData.requester,
      EgitmenAdi: certData.educatorName,
      SertifikaNo: certData.certificate_number,
    });

    // Bireysel dosya
    const individualBuffer = doc.getZip().generate({ type: "nodebuffer" });
    zip.file(`${certData.tc}.docx`, individualBuffer);

    // İçeriği XML olarak al
    const xml = doc.getZip().file("word/document.xml").asText();
    const match = xml.match(/<w:body>([\s\S]*?)<\/w:body>/);
    if (!match) throw new Error("<w:body> bulunamadı");

    const body = match[1];

    if (combinedBody.length > 0) {
      combinedBody += `
        <w:p>
          <w:r>
            <w:br w:type="page"/>
          </w:r>
        </w:p>
      `;
    }

    combinedBody += body;
  }

  // Yeni combined document.xml oluştur
  const fullXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
              xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
              xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
              xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
              xmlns:v="urn:schemas-microsoft-com:vml"
              xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
              xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
              xmlns:w10="urn:schemas-microsoft-com:office:word"
              xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
              xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
              xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
              xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
              xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
              xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
              mc:Ignorable="w14 wp14">
    <w:body>
      ${combinedBody}
    </w:body>
  </w:document>`;

  // combined.docx üretmek için yeniden template zipini klonla
  const baseZip = new PizZip(templateContent);
  const combinedZip = new PizZip();

  // document.xml'i değiştir
  Object.keys(baseZip.files).forEach((filename) => {
    if (filename === "word/document.xml") {
      combinedZip.file(filename, fullXml);
    } else {
      combinedZip.file(filename, baseZip.files[filename].asNodeBuffer());
    }
  });

  const combinedBuffer = combinedZip.generate({ type: "nodebuffer" });
  zip.file("combined.docx", combinedBuffer);

  return await zip.generateAsync({ type: "nodebuffer" });
}

exports.createCertificate = async (req, res) => {
  try {
    const certificatesData = req.body.certificates;

    if (!Array.isArray(certificatesData) || certificatesData.length === 0) {
      return res
        .status(400)
        .json({ error: "Sertifika verileri boş veya geçersiz." });
    }

    const zipBuffer = await createCertificateBufferZip(certificatesData);

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="sertifikalar.zip"`,
      "Content-Length": zipBuffer.length,
    });

    return res.send(zipBuffer);
  } catch (error) {
    console.error("Sertifikalar oluşturulurken hata:", error);
    res.status(500).json({ error: "Sertifikalar oluşturulurken hata oluştu." });
  }
};

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
