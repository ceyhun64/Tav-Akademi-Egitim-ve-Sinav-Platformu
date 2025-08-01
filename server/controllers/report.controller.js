const {
  sequelize,
  Exam,
  Booklet,
  User,
  ExamQuestions,
  ExamUser,
  PoolImg,
  PoolTeo,
  UserTeoAnswers,
  EducationSet,
  Education,
  EducationSetUser,
  UserImgAnswers,
  QuestionCategory,
} = require("../models/index");
const logActivity = require("../helpers/logActivity");
const { Op, where } = require("sequelize");
const XLSX = require("xlsx");

exports.getAllUserTeoResults = async (req, res) => {
  try {
    const teoExams = await Exam.findAll({
      where: { exam_type: "teo" },
    });

    const teoExamIds = teoExams.map((exam) => exam.id);

    const userTeoExams = await ExamUser.findAll({
      where: {
        examId: teoExamIds,
      },
      include: [
        {
          model: User,
        },
        {
          model: Exam,
          include: [
            {
              model: Booklet,
              attributes: ["name"], // Sadece name alanını istiyoruz
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: "Teorik sınav sonuçları başarıyla getirildi.",
      data: userTeoExams,
    });
  } catch (error) {
    console.error("Teorik sınav cevaplarını alırken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.getAllUserImgResults = async (req, res) => {
  try {
    const imgExams = await Exam.findAll({
      where: {
        exam_type: "img", // düzeltildi: "type" değil, "exam_type"
      },
    });

    const imgExamIds = imgExams.map((exam) => exam.id);

    const userImgExams = await ExamUser.findAll({
      where: {
        examId: imgExamIds,
      },
      include: [
        {
          model: User,
        },
        {
          model: Exam,
          include: [
            {
              model: Booklet,
              attributes: ["name"], // Sadece name alanını istiyoruz
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: "Görsel sınav sonuçları başarıyla getirildi.",
      data: userImgExams,
    });
  } catch (error) {
    console.error("Görsel sınav cevaplarını alırken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.getUserResultDetail = async (req, res) => {
  try {
    const { userId, examId } = req.params;
    const examUser = await ExamUser.findOne({
      where: {
        userId,
        examId,
      },
      include: [
        {
          model: User,
        },
        {
          model: Exam,
        },
      ],
    });
    res.status(200).json({
      message: "Sınav sonuçları başarıyla getirildi.",
      data: examUser,
    });
  } catch (error) {
    console.error("Sınav sonuçlarını alırken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.deleteUserExamResult = async (req, res) => {
  try {
    const { userExamIds } = req.body;

    if (!Array.isArray(userExamIds) || userExamIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Geçersiz kullanıcı sınav verisi." });
    }

    await ExamUser.destroy({
      where: {
        [Op.or]: userExamIds.map(({ userId, examId }) => ({
          userId,
          examId,
        })),
      },
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı sınav sonucu sildi`,
      category: "Report",
    });

    res
      .status(200)
      .json({ message: "Sınav sonucu başarıyla silindi.", userExamIds });
  } catch (error) {
    console.error("Sınav sonucunu silerken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.getAllUserEducationSetsResult = async (req, res) => {
  try {
    const educationSetUsers = await EducationSetUser.findAll({
      include: {
        model: EducationSet,
        include: [
          {
            model: Education,
          },
        ],
      },
      include: {
        model: User,
      },
    });
    res.status(200).json({
      message: "Eğitim setleri başarıyla getirildi.",
      data: educationSetUsers,
    });
  } catch (error) {
    console.error("Eğitim setlerini alırken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.getUserEducationResultDetail = async (req, res) => {
  try {
    const { userId, educationSetId } = req.params;
    const educationSetUser = await EducationSetUser.findOne({
      where: {
        userId,
        educationSetId,
      },
      include: {
        model: EducationSet,
        include: [
          {
            model: Education,
          },
        ],
      },
      include: {
        model: User,
      },
    });
    res.status(200).json({
      message: "Eğitim seti sonuçları başarıyla getirildi.",
      data: educationSetUser,
    });
  } catch (error) {
    console.error("Eğitim seti sonuçlarını alırken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.deleteUserEducationResult = async (req, res) => {
  try {
    const { userEducationIds } = req.body;
    if (!Array.isArray(userEducationIds) || userEducationIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Geçersiz kullanıcı eğitim verisi." });
    }
    const { Op } = require("sequelize");
    await EducationSetUser.destroy({
      where: {
        [Op.or]: userEducationIds.map(({ userId, educationSetId }) => ({
          userId,
          educationSetId,
        })),
      },
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı eğitim sonucu sildi`,
      category: "Report",
    });

    res.status(200).json({
      message: "Eğitim seti sonucu başarıyla silindi.",
      userEducationIds,
    });
  } catch (error) {
    console.error("Eğitim seti sonucunu silerken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.getQuestionCategoryResult = async (req, res) => {
  try {
    const { examId, userId } = req.params;

    const results = await UserImgAnswers.findAll({
      where: {
        user_id: userId,
        exam_id: examId,
      },
      attributes: [
        [sequelize.col("poolImg.questionCategoryId"), "questionCategoryId"],
        [sequelize.col("poolImg->questionCategory.name"), "categoryName"], // Doğru alias burada
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN is_correct = true THEN 1 ELSE 0 END")
          ),
          "correctCount",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN is_correct = false THEN 1 ELSE 0 END")
          ),
          "incorrectCount",
        ],
      ],
      include: [
        {
          model: PoolImg,
          attributes: [],
          include: [
            {
              model: QuestionCategory,
              attributes: [],
            },
          ],
        },
      ],
      group: [
        "poolImg.questionCategoryId",
        "poolImg->questionCategory.id",
        "poolImg->questionCategory.name",
      ],
      raw: true,
    });

    // Sayısal dönüşüm
    const questionCategoryResult = results.map((r) => ({
      questionCategoryId: r.questionCategoryId,
      categoryName: r.categoryName,
      correctCount: Number(r.correctCount),
      incorrectCount: Number(r.incorrectCount),
    }));

    res.status(200).json({
      message: "Soru kategorisi sonuçları başarıyla getirildi.",
      data: questionCategoryResult,
    });
  } catch (error) {
    console.error("Soru kategorisi sonuçlarını alırken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.getImgQuestionResult = async (req, res) => {
  try {
    const { examId, userId } = req.params;
    console.log("examId:", examId);
    console.log("userId:", userId);
    const userImgAnswers = await UserImgAnswers.findAll({
      where: {
        user_id: userId,
        exam_id: examId,
      },
      include: [
        {
          model: PoolImg,
          include: [
            {
              model: QuestionCategory,
            },
          ],
        },
        {
          model: User,
        },
        {
          model: Exam,
        },
      ],
    });
    const userExams = await ExamUser.findAll({
      where: {
        examId,
        userId,
      },
    });

    res.status(200).json({
      message: "Soru sonuçları başarıyla getirildi.",
      data: {
        userImgAnswers,
        userExams,
      },
    });
  } catch (error) {
    console.error("Soru sonuçlarını alırken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.getTeoQuestionResult = async (req, res) => {
  try {
    const { examId, userId } = req.params;

    console.log("examId:", examId);
    console.log("userId:", userId);
    const userTeoAnswers = await UserTeoAnswers.findAll({
      where: {
        user_id: userId,
        exam_id: examId,
      },
      include: [
        {
          model: PoolTeo,
        },
        {
          model: User,
        },
        {
          model: Exam,
        },
      ],
    });
    const userExams = await ExamUser.findAll({
      where: {
        examId,
        userId,
      },
    });

    res.status(200).json({
      message: "Soru sonuçları başarıyla getirildi.",
      data: {
        userTeoAnswers,
        userExams,
      },
    });
  } catch (error) {
    console.error("Soru sonuçlarını alırken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.getTeoResultByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userExams = await ExamUser.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Exam,
          where: {
            exam_type: "teo",
          },
        },
      ],
    });
    res.json(userExams);
  } catch (error) {
    console.error("Teorik sınav sonuçlarını alırken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.getImgResultByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userExams = await ExamUser.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Exam,
          where: {
            exam_type: "img",
          },
        },
      ],
    });
    res.json(userExams);
  } catch (error) {
    console.error("Görsel sınav sonuçlarını alırken hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

exports.getAssignExams = async (req, res) => {
  try {
    const exams = await Exam.findAll();
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};
exports.deleteAssignExam = async (req, res) => {
  try {
    const { examId } = req.params;

    // 1. İlgili kayıtları sil
    await ExamUser.destroy({ where: { examId } });
    await ExamQuestions.destroy({ where: { examId } });
    const deletedExamsCount = await Exam.destroy({ where: { id: examId } });

    if (deletedExamsCount > 0) {
      // 2. Güncel sınav listesini getir (örn: sadece img sınavları)
      const updatedExams = await Exam.findAll(); // veya filtreli: { where: { exam_type: "img" } }

      // 3. Yeni listeyi geri gönder
      return res.json({
        message: "Sınav ataması ve ilgili kayıtlar başarıyla silindi.",
        exams: updatedExams,
      });
    } else {
      return res.status(404).json({
        message: "Belirtilen sınav bulunamadı veya daha önce silinmiş.",
      });
    }
  } catch (error) {
    console.error("Sınav ataması silinirken hata oluştu:", error);
    return res
      .status(500)
      .json({ message: "Sunucu hatası", error: error.message });
  }
};

exports.getAssignEducationSets = async (req, res) => {
  try {
    const educationSets = await EducationSetUser.findAll({
      include: [
        {
          model: User,
        },
        {
          model: EducationSet,
        },
      ],
    });
    res.json(educationSets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};
exports.deleteAssignEducationSet = async (req, res) => {
  try {
    const { userId, educationSetId } = req.params;
    console.log(userId, educationSetId);
    const educationSets = await EducationSetUser.findAll({
      where: { userId, educationSetId },
    });
    await EducationSetUser.destroy({
      where: { userId, educationSetId },
    });
    return res.json({
      message: "Eğitim seti ataması ve ilgili kayıtlar başarıyla silindi.",
      educationSets,
    });
  } catch (error) {
    // Hata durumunda konsola detaylı loglama yap ve 500 hatası dön
    console.error("Eğitim seti ataması silinirken hata oluştu:", error);
    return res
      .status(500)
      .json({ message: "Sunucu hatası", error: error.message });
  }
};

exports.userTeoResultsToExcel = async (req, res) => {
  try {
    const teoExams = await Exam.findAll({ where: { exam_type: "teo" } });
    const teoExamIds = teoExams.map((exam) => exam.id);

    const userTeoExams = await ExamUser.findAll({
      where: { examId: teoExamIds },
      include: [
        { model: User },
        {
          model: Exam,
          include: [{ model: Booklet }],
        },
      ],
      raw: true,
      nest: true,
    });

    // Veriyi olduğu gibi Excel'e aktar (hiçbir alan sadeleştirilmeden)
    const worksheet = XLSX.utils.json_to_sheet(userTeoExams);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teorik Sonuçlar");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=teo-sonuclar.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Excel'e aktarım hatası:", error);
    res
      .status(500)
      .json({ message: "Excel dışa aktarma başarısız oldu.", error });
  }
};

exports.userImgResultsToExcel = async (req, res) => {
  try {
    const imgExams = await Exam.findAll({ where: { exam_type: "img" } });
    const imgExamIds = imgExams.map((exam) => exam.id);

    const userImgExams = await ExamUser.findAll({
      where: { examId: imgExamIds },
      include: [
        { model: User },
        {
          model: Exam,
          include: [{ model: Booklet }],
        },
      ],
      raw: true,
      nest: true,
    });

    // Veriyi olduğu gibi Excel'e aktar (hiçbir alan sadeleştirilmeden)
    const worksheet = XLSX.utils.json_to_sheet(userImgExams);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Uygulamalı Sonuçlar");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=uyg-sonuclar.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Excel'e aktarım hatası:", error);
    res
      .status(500)
      .json({ message: "Excel dışa aktarma başarısız oldu.", error });
  }
};

exports.assignTeoExamsToExcel = async (req, res) => {
  try {
    const teoExams = await Exam.findAll({
      where: { exam_type: "teo" },
      raw: true,
      nest: true,
    });

    // Veriyi olduğu gibi Excel'e aktar (hiçbir alan sadeleştirilmeden)
    const worksheet = XLSX.utils.json_to_sheet(teoExams);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Atanan Teorik Sınavlar");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=teo-sinavlar.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Excel'e aktarım hatası:", error);
    res
      .status(500)
      .json({ message: "Excel dışa aktarma başarısız oldu.", error });
  }
};

exports.assignImgExamsToExcel = async (req, res) => {
  try {
    const imgExams = await Exam.findAll({
      where: { exam_type: "img" },
      raw: true,
      nest: true,
    });

    // Veriyi olduğu gibi Excel'e aktar (hiçbir alan sadeleştirilmeden)
    const worksheet = XLSX.utils.json_to_sheet(imgExams);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Atanan Uygulamalı Sınavlar"
    );

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=uyg-sinavlar.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Excel'e aktarım hatası:", error);
    res
      .status(500)
      .json({ message: "Excel dışa aktarma başarısız oldu.", error });
  }
};

exports.assignEducationSetsToExcel = async (req, res) => {
  try {
    const eduSets = await EducationSetUser.findAll({ raw: true, nest: true });
    // Veriyi olduğu gibi Excel'e aktar (hiçbir alan sadeleştirilmeden)
    const worksheet = XLSX.utils.json_to_sheet(eduSets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Atanan Eğitim Setleri");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=egitim-setleri.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Excel'e aktarım hatası:", error);
    res
      .status(500)
      .json({ message: "Excel dışa aktarma başarısız oldu.", error });
  }
};
