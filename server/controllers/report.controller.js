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
  EduAndEduSet,
  Education,
  EducationUser,
  EducationSetUser,
  UserImgAnswers,
  QuestionCategory,
} = require("../models/index");
const logActivity = require("../helpers/logActivity");
const { Op, where } = require("sequelize");

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

exports.getAssignImgExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      where: {
        exam_type: "img",
      },
    });
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};
exports.deleteAssignExam = async (req, res) => {
  try {
    const { examId } = req.params; // examId'yi req.params'tan alıyoruz
    const deletedExamUsersCount = await ExamUser.destroy({
      where: {
        examId: examId,
      },
    });

    const deletedExamQuestionsCount = await ExamQuestions.destroy({
      where: {
        examId: examId,
      },
    });

    const deletedExamsCount = await Exam.destroy({
      where: {
        id: examId,
      },
    });

    if (deletedExamsCount > 0) {
      res.json({
        message: "Sınav ataması ve ilgili kayıtlar başarıyla silindi.",
        examId: examId,
      });
    } else {
      res.status(404).json({
        message: "Belirtilen sınav bulunamadı veya daha önce silinmiş.",
      });
    }
  } catch (error) {
    console.error("Sınav ataması silinirken hata oluştu:", error); // Daha detaylı hata loglaması
    res.status(500).json({ message: "Sunucu hatası", error: error.message }); // Hata mesajını istemciye gönderin
  }
};

exports.getAssignTeoExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      where: {
        exam_type: "teo",
      },
    });
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};
exports.getAssignEducationSets = async (req, res) => {
  try {
    const educationSets = await EducationSet.findAll();
    res.json(educationSets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};
exports.deleteAssignEducationSet = async (req, res) => {
  try {
    const { educationSetId } = req.params;
    const deletedEducationSetUsersCount = await EducationSetUser.destroy({
      where: {
        educationSetId: educationSetId,
      },
    });
    const deletedEducationSetCount = await EducationSet.destroy({
      where: {
        id: educationSetId,
      },
    });
    if (deletedEducationSetCount > 0) {
      res.json({
        message: "Eğitim seti ataması ve ilgili kayıtlar başarıyla silindi.",
        educationSetId: educationSetId,
      });
    } else {
      res.status(404).json({
        message: "Belirtilen eğitim seti bulunamadı veya daha önce silinmiş.",
      });
    }
  } catch (error) {
    console.error("Eğitim seti ataması silinirken hata oluştu:", error); // Daha detaylı hata loglaması
    res.status(500).json({ message: "Sunucu hatası", error: error.message }); // Hata mesajını istemciye gönderin
  }
};
