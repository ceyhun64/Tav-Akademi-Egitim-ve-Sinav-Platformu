const { where } = require("sequelize");
const {
  PracticeExam,
  PracticeExamQuestions,
  PracticeExamUser,
  PoolImg,
  User,
  sequelize,
} = require("../models/index");

exports.createPracticeExam = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    const lokasyon = user.lokasyonId;
    const grup = user.grupId;
    const { duration, question_count } = req.body;

    // 1. Pratik sınav kaydı oluştur
  
    const practiceExam = await PracticeExam.create({
      duration,
      question_count,
    });

    // 2. Aynı lokasyon ve gruptaki kullanıcıları bul
    const users = await User.findAll({
      where: {
        lokasyonId: lokasyon,
        grupId: grup,
      },
    });

    const userIds = users.map((user) => user.id);

    // 3. Kullanıcıları practice_exam_users tablosuna ekle
    const practiceExamUsers = userIds.map((userId) => ({
      userId,
      practiceExamId: practiceExam.id,
    }));

    await PracticeExamUser.bulkCreate(practiceExamUsers);

    // 4. PoolImg'den soruları çek (rastgele, tamamını buradan alıyoruz)
    const imgQuestions = await PoolImg.findAll({
      limit: question_count,
      order: sequelize.random(),
    });

    // 5. PracticeExamQuestions tablosuna ekle
    const practiceExamQuestions = imgQuestions.map((question) => ({
      practiceExamId: practiceExam.id,
      questionId: question.id,
    }));

    await PracticeExamQuestions.bulkCreate(practiceExamQuestions);

    // 6. Yanıtla
    res.json(practiceExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Practice exam creation failed" });
  }
};

exports.deletePracticeExam = async (req, res) => {
  try {
    const { id } = req.params;

    // Önce ilişkili kayıtları sil
    await PracticeExamQuestions.destroy({ where: { practiceExamId: id } });
    await PracticeExamUser.destroy({ where: { practiceExamId: id } });

    // Sonra practice exam kaydını sil
    const practiceExam = await PracticeExam.findByPk(id);
    await practiceExam.destroy;

    res.json(practiceExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Practice exam deletion failed" });
  }
};

exports.updatePracticeExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration, question_count } = req.body;
    const practiceExam = await PracticeExam.findByPk(id);
    if (!practiceExam) {
      return res.status(404).json({ error: "Practice exam not found" });
    }
    practiceExam.duration = duration;
    practiceExam.question_count = question_count;
    await practiceExam.save();
    res.json(practiceExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Practice exam update failed" });
  }
};

exports.getPracticeExam = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    const lokasyon = user.lokasyonId;
    const grup = user.grupId;
    const users = await User.findAll({
      where: {
        lokasyonId: lokasyon,
        grupId: grup,
      },
    });
    const userIds = users.map((user) => user.id);
    const practiceExamUsers = await PracticeExamUser.findAll({
      where: {
        userId: userIds,
      },
    });
    const practiceExamIds = practiceExamUsers.map(
      (practiceExamUser) => practiceExamUser.practiceExamId
    );
    const practiceExams = await PracticeExam.findAll({
      where: {
        id: practiceExamIds,
      },
    });

    if (!practiceExams) {
      return res.status(404).json({ error: "Practice exam not found" });
    }
    res.json(practiceExams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Practice exam retrieval failed" });
  }
};

exports.getQuestionsPracticeExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const questions = await PracticeExamQuestions.findAll({
      where: { practiceExamId: examId },
      include: [
        {
          model: PoolImg,
          as: "poolImgQuestion",
        },
      ],
    });
    const exam = await PracticeExam.findOne({ where: { id: examId } });
    const duration = exam.duration;
    res.status(200).json({ questions, duration });
  } catch (error) {
    console.error(error);
    res.error(error);
  }
};
