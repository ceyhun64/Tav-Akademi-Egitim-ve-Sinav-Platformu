const { PoolTeo } = require("../models/index");
const logActivity = require("../helpers/logActivity");
const axios = require("axios");
const XLSX = require("xlsx");
exports.getPoolTeos = async (req, res) => {
  try {
    const poolTeos = await PoolTeo.findAll();
    res.json(poolTeos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPoolTeoById = async (req, res) => {
  try {
    const { id } = req.params;
    const poolTeo = await PoolTeo.findByPk(id);
    if (!poolTeo) {
      return res.status(404).json({ message: "PoolTeo not found" });
    }
    res.json(poolTeo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createPoolTeo = async (req, res) => {
  try {
    const { question, a, b, c, d, e, answer, bookletId, difLevelId } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const newPoolTeo = await PoolTeo.create({
      question,
      a,
      b,
      c,
      d,
      e,
      answer,
      image: imagePath,
      bookletId,
      difLevelId,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından teorik soru eklendi.`,
      category: "PoolTeo",
    });
    res.status(201).json(newPoolTeo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadQuestionsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Excel dosyası yüklenmedi." });
    }

    const fileUrl = req.file.path || req.file.secure_url;

    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const workbook = XLSX.read(response.data, { type: "buffer" });
    const sheet = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    const { bookletId } = req.body;

    if (!bookletId) {
      return res.status(400).json({ message: "bookletId eksik." });
    }

    const results = {
      created: [],
      failed: [],
    };

    for (const [i, row] of data.entries()) {
      const { question, a, b, c, d, e, answer, difLevelId } = row;

      if (
        !question ||
        !a ||
        !b ||
        !c ||
        !d ||
        !e ||
        !["a", "b", "c", "d", "e"].includes(answer?.toLowerCase()) ||
        !difLevelId
      ) {
        results.failed.push({
          row: i + 2,
          reason: "Zorunlu veya geçersiz alan.",
        });
        continue;
      }

      try {
        const newQuestion = await PoolTeo.create({
          question,
          a,
          b,
          c,
          d,
          e,
          answer: answer.toLowerCase(),
          bookletId,
          difLevelId,
        });

        results.created.push({
          row: i + 2,
          question: newQuestion.question,
        });
      } catch (err) {
        results.failed.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      message: "Excel'den sorular işlendi.",
      results,
    });
  } catch (error) {
    console.error("Soru kayıt hatası:", error);
    res.status(500).json({ message: "Sunucu hatası.", error: error.message });
  }
};

exports.updatePoolTeo = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, a, b, c, d, e, answer, bookletId, difLevel } = req.body;
    const imagePath = req.file ? req.file.path : req.body.image;

    const poolTeo = await PoolTeo.findByPk(id);
    if (!poolTeo) {
      return res.status(404).json({ message: "PoolTeo not found" });
    }
    await poolTeo.update({
      question,
      a,
      b,
      c,
      d,
      e,
      answer,
      image: imagePath,
      bookletId,
      difLevel,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından teorik soru güncellendi.`,
      category: "PoolTeo",
    });
    res.json(poolTeo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePoolTeo = async (req, res) => {
  try {
    const { id } = req.params;
    const poolTeo = await PoolTeo.findByPk(id);
    if (!poolTeo) {
      return res.status(404).json({ message: "PoolTeo not found" });
    }
    await poolTeo.destroy();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından teorik soru silindi.`,
      category: "PoolTeo",
    });
    res.json({ message: "PoolTeo deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPoolTeosByBookletId = async (req, res) => {
  try {
    const { bookletId } = req.params;
    const poolTeos = await PoolTeo.findAll({
      where: { bookletId },
    });
    res.json(poolTeos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
