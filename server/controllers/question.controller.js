const {
  Exam,
  ExamUser,
  ExamQuestions,
  PoolImg,
  PoolTeo,
  UserTeoAnswers,
  UserImgAnswers,
} = require("../models/index");
const pointInPolygon = require("point-in-polygon");
const logActivity = require("../helpers/logActivity");

//teorik soruları getir
exports.get_teo_questions = async (req, res) => {
  try {
    const examId = req.params.examId;
    const questions = await ExamQuestions.findAll({
      where: { examId },
      include: [
        {
          model: PoolTeo,
          as: "teoQuestion",
          attributes: {
            exclude: ["difLevel", "answer", "bookletId", "imageCategory"],
          },
        },
      ],
    });
    const exam = await Exam.findOne({ where: { id: examId } });
    const duration = exam.sure;
    const name = exam.name;
    res.status(200).json({ questions, duration, name });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//görsel soruları getir
exports.get_img_questions = async (req, res) => {
  try {
    const examId = req.params.examId;
    const questions = await ExamQuestions.findAll({
      where: { examId },
      include: [
        {
          model: PoolImg,
          as: "imgQuestion",

          attributes: {
            exclude: ["difLevel", "answer", "bookletId", "imageCategory"],
          },
        },
      ],
    });
    const exam = await Exam.findOne({ where: { id: examId } });
    const duration = exam.sure;
    const name = exam.name;
    res.status(200).json({ questions, duration, name });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//birleşik soruları getir(teorik)
exports.get_both_questions_teo = async (req, res) => {
  try {
    const examId = parseInt(req.params.examId, 10);

    const exam = await Exam.findOne({ where: { id: examId } });
    const duration = exam.sure;

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const unifiedId = exam.unifiedId;

    // unifiedId'ye ait tüm sınavları getir
    const exams = await Exam.findAll({ where: { unifiedId } });

    // Diğer sınav (senin examId dışında) examId'si
    const otherExam = exams.find((e) => e.id !== examId);

    // Şimdi sadece senin sınavına ait soruları çek (teo soruları)
    const questions = await ExamQuestions.findAll({
      where: {
        examId: examId,
      },
      include: [
        {
          model: PoolTeo,
          as: "teoQuestion",
          attributes: {
            exclude: ["difLevel", "answer", "bookletId", "imageCategory"],
          },
        },
      ],
    });
    const name = exam.name;
    // Soruların examId'sini kontrol et
    res.status(200).json({
      questions,
      otherExamId: otherExam ? otherExam.id : null, // diğer sınavın examId'si
      duration,
      name,
    });
  } catch (error) {
    console.error("get_both_questions_teo error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//birleşik soruları getir(görsel)
exports.get_both_questions_img = async (req, res) => {
  try {
    const examId = req.params.examId;
    const questions = await ExamQuestions.findAll({
      where: { examId },
      include: [
        {
          model: PoolImg,
          as: "imgQuestion",
          attributes: {
            exclude: ["difLevel", "answer", "bookletId", "imageCategory"],
          },
        },
      ],
    });
    const exam = await Exam.findOne({ where: { id: examId } });
    const duration = exam.sure;
    const name = exam.name;
    res.status(200).json({ duration, questions, name });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//teorik soruları cevapla
exports.answer_teo_questions = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { answers, examId, entry_date, entry_time, exit_date, exit_time } =
      req.body;

    if (!Array.isArray(answers) || !examId) {
      return res.status(400).json({ error: "Geçersiz veri formatı." });
    }

    const savedAnswers = [];
    let correctAnswer = 0;

    for (const item of answers) {
      const { question_id, answer } = item;

      if (!question_id || typeof answer !== "string" || answer.trim() === "")
        continue;

      const existingAnswer = await UserTeoAnswers.findOne({
        where: { user_id, question_id },
      });

      if (existingAnswer) continue;

      const question = await PoolTeo.findByPk(question_id);
      if (!question) continue;

      const isCorrect =
        question.answer?.toLowerCase().trim() === answer.toLowerCase().trim();

      if (isCorrect) correctAnswer++;

      const saved = await UserTeoAnswers.create({
        user_id,
        question_id,
        exam_id: Number(examId),
        answer,
        is_correct: isCorrect,
      });

      savedAnswers.push(saved);
    }

    const exam = await Exam.findOne({ where: { id: examId } });
    if (!exam) {
      return res.status(404).json({ error: "Sınav bulunamadı." });
    }

    const question_count = exam.question_count;
    const question_point = 100 / question_count;
    const score = Number((correctAnswer * question_point).toFixed(2));

    const examUser = await ExamUser.findOne({
      where: { userId: user_id, examId },
    });

    if (!examUser) {
      return res
        .status(404)
        .json({ error: "Sınav kullanıcı kaydı bulunamadı." });
    }

    const answeredCount = savedAnswers.length;

    examUser.score = score;
    examUser.pass = score >= exam.passing_score;
    examUser.true_count = correctAnswer;
    examUser.false_count = answeredCount - correctAnswer;
    examUser.completed = true;

    // Tarih ve saat bilgilerini ata (varsa modelde alanlar olmalı)
    if (entry_date) examUser.entry_date = entry_date;
    if (entry_time) examUser.entry_time = entry_time;
    if (exit_date) examUser.exit_date = exit_date;
    if (exit_time) examUser.exit_time = exit_time;

    await examUser.save();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı teorik sınavı bitirdi.`,
      category: "Question",
    });

    res.status(201).json({
      message: "Cevaplar başarıyla kaydedildi.",
      savedCount: savedAnswers.length,
      score,
      pass: examUser.pass,
      data: savedAnswers,
    });
  } catch (error) {
    console.error("Toplu cevap kaydederken hata:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//görsel soruları cevapla
exports.answer_img_questions = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { answers, examId, entry_date, entry_time, exit_date, exit_time } =
      req.body;

    if (!Array.isArray(answers) || !examId) {
      return res.status(400).json({ error: "Geçersiz veri formatı." });
    }

    const savedAnswers = [];
    let correctAnswer = 0;

    for (const item of answers) {
      const { question_id, answer, coordinates } = item;
      if (!question_id) continue;
      if (!answer && !coordinates) continue;

      const existingAnswer = await UserImgAnswers.findOne({
        where: { user_id, question_id },
      });

      if (existingAnswer) continue;

      const question = await PoolImg.findByPk(question_id);
      if (!question) continue;

      let isCorrect = false;

      // Koordinat kontrolü
      if (
        coordinates &&
        typeof coordinates === "object" &&
        "x" in coordinates &&
        "y" in coordinates
      ) {
        let polygons = [];
        try {
          polygons =
            typeof question.coordinate === "string"
              ? JSON.parse(question.coordinate)
              : question.coordinate;
        } catch {
          polygons = [];
        }

        const point = [coordinates.x, coordinates.y];

        isCorrect = polygons.some((polygon) => {
          const polygonArray = polygon.map((p) => [p.x, p.y]);
          return pointInPolygon(point, polygonArray);
        });
      }

      // Metin tabanlı kontrol (gerekirse)
      if (!isCorrect && typeof answer === "string" && answer.trim() !== "") {
        isCorrect =
          question.correct_answer?.toLowerCase().trim() ===
          answer.toLowerCase().trim();
      }

      if (isCorrect) correctAnswer++;

      const saved = await UserImgAnswers.create({
        user_id,
        question_id,
        exam_id: Number(examId),
        answer: answer
          ? typeof answer === "object"
            ? JSON.stringify(answer)
            : answer
          : null,
        coordinate: coordinates ? JSON.stringify(coordinates) : null,
        is_correct: isCorrect,
      });

      savedAnswers.push(saved);
    }

    // Sınav bilgisi
    const exam = await Exam.findOne({ where: { id: examId } });
    if (!exam) {
      return res.status(404).json({ error: "Sınav bulunamadı." });
    }

    const question_count = exam.question_count;
    const question_point = 100 / question_count;
    const score = Number((correctAnswer * question_point).toFixed(2));

    // Kullanıcı-sınav ilişkisi
    const examUser = await ExamUser.findOne({
      where: { userId: user_id, examId },
    });

    if (!examUser) {
      return res
        .status(404)
        .json({ error: "Sınav kullanıcı kaydı bulunamadı." });
    }

    const answeredCount = savedAnswers.length;

    examUser.true_count = correctAnswer;
    examUser.false_count = answeredCount - correctAnswer;
    examUser.score = score;
    examUser.pass = score >= exam.passing_score;
    examUser.completed = true;

    // Gelen veriler varsa kaydet
    if (entry_date) examUser.entry_date = new Date(entry_date);
    if (entry_time) examUser.entry_time = entry_time; // string olarak saklanıyorsa
    if (exit_date) examUser.exit_date = new Date(exit_date);
    else examUser.exit_date = new Date(); // yoksa şimdiki zamanı kullan
    if (exit_time) examUser.exit_time = exit_time;

    await examUser.save();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı görsel sınavı bitirdi.`,
      category: "Question",
    });

    res.status(201).json({
      message: "Cevaplar başarıyla kaydedildi.",
      savedCount: savedAnswers.length,
      score,
      pass: examUser.pass,
      data: savedAnswers,
    });
  } catch (error) {
    console.error("Toplu cevap kaydederken hata:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
