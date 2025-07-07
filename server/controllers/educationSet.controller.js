const {
  sequelize,
  EduAndEduSet,
  EducationSet,
  EducationSetUser,
  Education,
  EducationUser,
  Exam,
  Booklet,
  User,
  ExamQuestions,
  ExamUser,
  PoolImg,
  PoolTeo,
} = require("../models/index");

const sendMail = require("../helpers/sendMail");
const logActivity = require("../helpers/logActivity");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

// eğitim seti oluştur
exports.createEducationSet = async (req, res) => {
  try {
    const {
      name,
      educationIds = [],
      exam_name,
      sure_teo,
      sure_img,

      passing_score_teo,
      passing_score_img,
      bookletId_teo,
      bookletId_img,
      method,
    } = req.body;

    // Eğitim seti oluştur
    const educationSet = await EducationSet.create({
      name,
      exam_name,
      sure_teo,
      sure_img,
      passing_score_teo,
      passing_score_img,
      bookletId_teo,
      bookletId_img,
      method,
      educationExam: 1,
    });

    const educationSetId = educationSet.id;

    // Eğitim ve eğitim seti eşlemesi
    await Promise.all(
      educationIds.map((educationId) =>
        EduAndEduSet.create({ educationId, educationSetId })
      )
    );

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından ${educationSet.name} adlı eğitim seti oluşturuldu.`,
      category: "EducationSet",
    });

    res
      .status(201)
      .json({ message: "Eğitim seti başarıyla oluşturuldu.", educationSet });
  } catch (error) {
    console.error("Eğitim seti oluşturma hatası:", error);
    res.status(500).json({ error: "Eğitim seti oluşturulurken hata oluştu." });
  }
};

//eğitim seti ata
exports.assignEducationSet = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      educationSetId,
      userIds = [],
      start_date,
      end_date,
      start_time,
      end_time,
      mail,
    } = req.body;

    const educationSet = await EducationSet.findByPk(educationSetId, {
      include: [
        {
          model: EduAndEduSet,
          as: "eduAndEduSetsForSet",
          include: [
            {
              model: Education,
              as: "education",
            },
          ],
        },
      ],
    });

    if (!educationSet) {
      return res.status(404).json({ error: "Eğitim seti bulunamadı." });
    }

    // EducationSetUser atamaları (duplicate kontrolü ile)
    await Promise.all(
      userIds.map(async (userId) => {
        const existing = await EducationSetUser.findOne({
          where: { educationSetId, userId },
          transaction: t,
        });

        if (!existing) {
          await EducationSetUser.create(
            {
              educationSetId,
              userId,
              start_date,
              end_date,
              start_time,
              end_time,
              completed: false,
            },
            { transaction: t }
          );
        }
      })
    );

    // EducationUser eşlemesi için
    const eduAndEduSetList = await EduAndEduSet.findAll({
      where: { educationSetId },
      include: [
        {
          model: Education,
          as: "education",
        },
      ],
      transaction: t,
    });

    const educationIds = eduAndEduSetList.map((entry) => entry.educationId);

    const educationUserEntries = [];
    for (const educationId of educationIds) {
      for (const userId of userIds) {
        educationUserEntries.push({ educationId, userId, completed: false });
      }
    }

    // Var olan EducationUser kayıtlarını çek
    const existingEducationUsers = await EducationUser.findAll({
      where: {
        [Op.or]: educationUserEntries.map(({ educationId, userId }) => ({
          educationId,
          userId,
        })),
      },
      transaction: t,
    });

    const existingSet = new Set(
      existingEducationUsers.map((eu) => `${eu.educationId}-${eu.userId}`)
    );

    // Sadece olmayanları bulk insert yap
    const newEducationUserEntries = educationUserEntries.filter(
      ({ educationId, userId }) => !existingSet.has(`${educationId}-${userId}`)
    );

    if (newEducationUserEntries.length > 0) {
      await EducationUser.bulkCreate(newEducationUserEntries, {
        transaction: t,
      });
    }

    // ===============================
    // === Sınav Atama Başlangıç ====
    // ===============================
    const {
      exam_name,
      sure_teo,
      sure_img,
      passing_score_teo,
      passing_score_img,
      bookletId_teo,
      bookletId_img,
      method,
      educationExam,
    } = educationSet;

    const unifiedId = uuidv4();
    let examTeo = null;
    let examImg = null;

    if (bookletId_teo) {
      const bookletTeo = await Booklet.findByPk(bookletId_teo, {
        transaction: t,
      });

      if (!bookletTeo) throw new Error("Teorik booklet bulunamadı");

      const question_count_teo = bookletTeo.question_count;

      examTeo = await Exam.create(
        {
          name: exam_name,
          unifiedId,
          exam_type: "teo",
          start_date: start_date,
          end_date: end_date,
          start_time: start_time,
          end_time: end_time,
          sure: sure_teo,
          passing_score: passing_score_teo,
          bookletId: bookletId_teo,
          question_count: question_count_teo,
          educationExam,
        },
        { transaction: t }
      );

      const teoQs = await PoolTeo.findAll({
        where: { bookletId: bookletId_teo },
        order: method === "random" ? sequelize.random() : [["id", "ASC"]],
        transaction: t,
      });

      await ExamQuestions.bulkCreate(
        teoQs.map((q, i) => ({
          examId: examTeo.id,
          questionId: q.id,
          questionType: "teo",
          order: i + 1,
        })),
        { transaction: t }
      );

      const examUserTeoRelations = userIds.map((userId) => ({
        examId: examTeo.id,
        userId,
        completed: false,
      }));
      await ExamUser.bulkCreate(examUserTeoRelations, { transaction: t });
    }

    if (bookletId_img) {
      const bookletImg = await Booklet.findByPk(bookletId_img, {
        transaction: t,
      });

      if (!bookletImg) throw new Error("Görüntü booklet bulunamadı");

      const question_count_img = bookletImg.question_count;

      examImg = await Exam.create(
        {
          name: exam_name,
          unifiedId,
          exam_type: "img",
          start_date: start_date,
          end_date: end_date,
          start_time: start_time,
          end_time: end_time,
          sure: sure_img,
          passing_score: passing_score_img,
          bookletId: bookletId_img,
          question_count: question_count_img,
          educationExam,
        },
        { transaction: t }
      );

      const imgQs = await PoolImg.findAll({
        where: { bookletId: bookletId_img },
        order: method === "random" ? sequelize.random() : [["id", "ASC"]],
        limit: question_count_img,
        transaction: t,
      });

      await ExamQuestions.bulkCreate(
        imgQs.map((q, i) => ({
          examId: examImg.id,
          questionId: q.id,
          questionType: "img",
          order: i + 1,
        })),
        { transaction: t }
      );

      const examUserImgRelations = userIds.map((userId) => ({
        examId: examImg.id,
        userId,
        completed: false,
      }));
      await ExamUser.bulkCreate(examUserImgRelations, { transaction: t });
    }

    // =============================
    // === Sınav Atama Bitti =======
    // =============================
    await educationSet.update(
      {
        imgExamId: examImg?.id || null,
        teoExamId: examTeo?.id || null,
      },
      { transaction: t }
    );

    if (mail === true) {
      const users = await User.findAll({
        where: { id: userIds },
        transaction: t,
      });

      const currentDate = new Date().toLocaleDateString("tr-TR");

      for (const user of users) {
        const mailOptions = {
          to: user.email,
          subject: "Tav Akademi",
          text: `Sayın ${user.ad}, ${currentDate} tarihinde Tav Akademi tarafından tarafınıza "${educationSet.name}" isimli bir eğitim ve sınav ataması yapılmıştır. Bu eğitimi ve sınavı en geç ${educationSet.end_date} tarihine kadar tamamlamanız gerekmektedir.\n\nSınav linki: http://localhost:3000`,
        };

        await sendMail(mailOptions);
      }
    }

    await t.commit();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı ${educationSet.name} isimli eğitim setini atadı.`,
      category: "EducationSet",
    });

    res.status(200).json({
      message: "Eğitim seti ve sınav başarıyla atandı.",
      educationSetId,
    });
  } catch (error) {
    await t.rollback();
    console.error("Eğitim seti atama hatası:", error);
    res.status(500).json({ error: "Atama işlemi sırasında hata oluştu." });
  }
};

//tüm eğiitm setlerini getir
exports.getAllEducationSets = async (req, res) => {
  try {
    const educationSets = await EducationSet.findAll();
    res.status(200).json(educationSets);
  } catch (error) {
    console.error("Eğitim setleri getirme hatası:", error);
    res.status(500).json({ error: "Eğitim setleri getirilirken hata oluştu." });
  }
};

//eğitim seti detayı getirme
exports.getEducationSetById = async (req, res) => {
  try {
    const userId = req.user.id;
    const educationSetUser = await EducationSetUser.findOne({
      where: { userId, educationSetId: req.params.id },
    });

    // Eğitim seti ve ilişkili verileri getir
    const { id } = req.params;
    const educationSet = await EducationSet.findByPk(id);
    if (!educationSet) {
      return res.status(404).json({ error: "Eğitim seti bulunamadı." });
    }
    const imgExamId = educationSet.imgExamId;
    const teoExamId = educationSet.teoExamId;
    const imgExams = await Exam.findAll({
      where: { id: imgExamId },
    });
    const teoExams = await Exam.findAll({
      where: { id: teoExamId },
    });
    const seteducations = await EduAndEduSet.findAll({
      where: { educationSetId: id },
    });
    const educationIds = seteducations.map((edu) => edu.educationId);
    const educations = await Education.findAll({
      where: { id: { [Op.in]: educationIds } },
    });

    const educationSetUsers = await EducationSetUser.findAll({
      where: { educationSetId: id },
    });
    const userIds = educationSetUsers.map((user) => user.userId);
    const users = await User.findAll({
      where: { id: { [Op.in]: userIds } },
    });

    res
      .status(200)
      .json({
        imgExams,
        teoExams,
        educations,
        users,
        educationSet,
        educationSetUser,
      });
  } catch (error) {
    console.error("Eğitim seti detayı getirme hatası:", error);
    res
      .status(500)
      .json({ error: "Eğitim seti detayı getirilirken hata oluştu." });
  }
};

// eğitim seti getirme
exports.getEducationSetsUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const educationSetUser = await EducationSetUser.findAll({
      where: { userId },
    });
    const educationSetIds = educationSetUser.map((set) => set.educationSetId);

    if (educationSetIds.length === 0) {
      return res.status(200).json([]);
    }

    const educationSets = await EducationSet.findAll({
      where: { id: { [Op.in]: educationSetIds } },
    });

    res.status(200).json({ educationSets, educationSetUser });
  } catch (error) {
    console.error("Eğitim seti getirme hatası:", error);
    res.status(500).json({ error: "Eğitim seti getirilirken hata oluştu." });
  }
};

//eğitim seti silme
exports.deleteEducationSet = async (req, res) => {
  try {
    const { id } = req.params;

    // Önce set var mı kontrolü
    const educationSet = await EducationSet.findByPk(id);
    if (!educationSet) {
      return res.status(404).json({ message: "Eğitim seti bulunamadı." });
    }

    // İlişkili verileri sil
    await EducationSetUser.destroy({ where: { educationSetId: id } });
    await EduAndEduSet.destroy({ where: { educationSetId: id } });

    // Ana kaydı sil
    await educationSet.destroy();

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı ${educationSet.name} isimli eğitim setini sildi.`,
      category: "EducationSet",
    });
    res.status(200).json({ message: "Eğitim seti başarıyla silindi." });
  } catch (error) {
    console.error("Eğitim seti silme hatası:", error);
    res.status(500).json({ error: "Eğitim seti silinirken hata oluştu." });
  }
};

//eğitim seti güncelleme
exports.updateEducationSet = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      start_date,
      end_date,
      start_time,
      end_time,
      educationIds,
      userIds,
      mail,
      teoExamId,
      imgExamId,
    } = req.body;

    const educationSet = await EducationSet.findByPk(id);
    if (!educationSet) {
      return res.status(404).json({ message: "Eğitim seti bulunamadı." });
    }

    // Eğitim setini güncelle
    await educationSet.update({
      name,
      start_date,
      end_date,
      start_time,
      end_time,
      teoExamId,
      imgExamId,
    });

    // Eski ilişkileri temizle
    await EducationSetUser.destroy({ where: { educationSetId: id } });
    await EduAndEduSet.destroy({ where: { educationSetId: id } });

    // Yeni eğitimleri ekle
    await Promise.all(
      educationIds.map((educationId) =>
        EduAndEduSet.create({ educationSetId: id, educationId })
      )
    );

    // Yeni kullanıcıları ekle
    await Promise.all(
      userIds.map((userId) =>
        EducationSetUser.create({
          educationSetId: id,
          userId,
          completed: false,
        })
      )
    );

    // Mail gönder
    if (mail === true) {
      const users = await User.findAll({
        where: { id: { [Op.in]: userIds } },
      });

      const currentDate = new Date().toLocaleDateString("tr-TR");

      await Promise.all(
        users.map((user) => {
          const mailOptions = {
            to: user.email,
            subject: "Tav Akademi - Eğitim Güncellemesi",
            text: `Sayın ${user.ad}, ${currentDate} tarihinde ${educationSet.name} adlı eğitim seti güncellenmiştir. Yeni bitiş tarihi: ${educationSet.end_date}. \nSınav linki: http://localhost:3000`,
          };
          return sendMail(mailOptions);
        })
      );
    }
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı ${educationSet.name} isimli eğitim setini güncelledi.`,
      category: "EducationSet",
    });

    res.status(200).json({ message: "Eğitim seti başarıyla güncellendi." });
  } catch (error) {
    console.error("Eğitim seti güncelleme hatası:", error);
    res.status(500).json({ error: "Eğitim seti güncellenirken hata oluştu." });
  }
};

//educationSetUser güncelleme
exports.updateEducationSetUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { completed, entry_date, entry_time, exit_date, exit_time } =
      req.body;

    const educationSetUser = await EducationSetUser.findOne({
      where: { educationSetId: id, userId },
    });
    if (!educationSetUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    await educationSetUser.update({
      completed,
      entry_date,
      entry_time,
      exit_date,
      exit_time,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı eğitim setini tamamladı.`,
      category: "EducationSet",
    });
    res.status(200).json({ message: "Kullanıcı başarıyla güncellendi." });
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    res.status(500).json({ error: "Kullanıcı güncellenirken hata oluştu." });
  }
};

exports.getCompletedEducationSet = async (req, res) => {
  try {
    const userId = req.user.id;
    const educationSetUsers = await EducationSetUser.findAll({
      where: { userId, completed: true },
    });
    const educationSetIds = educationSetUsers.map(
      (educationSetUser) => educationSetUser.educationSetId
    );
    const educationSets = await EducationSet.findAll({
      where: { id: { [Op.in]: educationSetIds } },
    });

    res.status(200).json(educationSets);
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    res.status(500).json({ error: "Kullanıcı güncellenirken hata oluştu." });
  }
};
// Not: Zeynep Sude ve Ceyhun Türkmen birbirine aşık ❤️
