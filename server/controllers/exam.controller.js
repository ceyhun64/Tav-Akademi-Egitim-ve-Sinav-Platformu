const sendMail = require("../helpers/sendMail");
const {
  Exam,
  Booklet,
  User,
  ExamQuestions,
  ExamUser,
  PoolImg,
  PoolTeo,
  sequelize,
  QuestionCategory,
  DifLevel,
} = require("../models/index");
const { Op, where } = require("sequelize");
const { v4: uuidv4 } = require("uuid"); // en başta import
const logActivity = require("../helpers/logActivity");

//teorik sınav oluşturma
exports.create_teo_exam = async (req, res) => {
  try {
    const {
      name,
      start_date,
      end_date,
      start_time,
      end_time,
      sure,
      attemp_limit,
      passing_score,
      mail, //true veya false
      timed,
      sonucu_gizle,
      bookletId,
      method, // "random" veya "sequential"
      userIds, // kullanıcı ID listesi
    } = req.body;
    const booklet = await Booklet.findOne({
      where: {
        id: bookletId,
      },
    });
    const question_count = booklet.question_count;

    // 1. Sınavı oluştur
    const exam = await Exam.create({
      name,
      exam_type: "teo",
      start_date,
      end_date,
      start_time,
      end_time,
      sure,
      attemp_limit,
      passing_score,
      timed,
      sonucu_gizle,
      bookletId,
      question_count,
    });

    // 2. Soruları havuzdan getir
    let questions;
    if (method === "random") {
      questions = await PoolTeo.findAll({
        where: { bookletId },
        order: sequelize.random(),
      });
    } else {
      questions = await PoolTeo.findAll({
        where: { bookletId },
        order: [["id", "ASC"]],
      });
    }

    // 3. Soruları ExamQuestions tablosuna ekle
    const examQuestions = questions.map((q, index) => ({
      examId: exam.id,
      questionId: q.id,
      questionType: "teo",
      order: index + 1,
    }));

    await ExamQuestions.bulkCreate(examQuestions);

    // 4. Kullanıcılara sınavı ata (exam_user pivot tablosuna)
    const examUserRelations = userIds.map((userId) => ({
      examId: exam.id,
      userId,
      completed: false,
    }));

    await ExamUser.bulkCreate(examUserRelations);
    if (mail === true) {
      const users = await User.findAll({
        where: { id: userIds },
      });
      const currentDate = new Date().toLocaleDateString("tr-TR");

      for (const user of users) {
        const mailOptions = {
          to: user.email,
          subject: "Tav Akademi",
          text: `Sayın ${user.ad}, ${currentDate} tarihinde tav akademi tarafından, tarafınıza ${exam.name} isimli sınav ataması yapılmıştır. Bu sınavı en geç ${exam.end_date} tarihine kadar tamamlamanız gerekmektedir.
          Sınav linki: http://localhost:3000
          `,
        };

        await sendMail(mailOptions);
      }
    }
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından ${exam.name} isimli teorik sınav oluşturuldu.`,
      category: "Exam",
    });

    res.status(201).json({ message: "Sınav oluşturuldu", examId: exam.id });
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//görüntü sınav oluşturma
exports.create_img_exam = async (req, res) => {
  try {
    const {
      name,
      start_date,
      end_date,
      start_time,
      end_time,
      sure,
      attemp_limit,
      passing_score,
      mail,
      timed,
      sonucu_gizle,
      bookletId,
      method, // "random" veya "sequential"
      userIds,
      orana_gore_ata,
      zorluk_seviyesi, // burada aslında difLevelId geliyor
      toplam_soru,
      category_percentages, // { "1": 20, "2": 30, ... }
    } = req.body;
    console.log("req.body:", req.body);

    const booklet = await Booklet.findOne({ where: { id: bookletId } });

    const question_count =
      orana_gore_ata === true ? toplam_soru : booklet.question_count;

    // 1. Sınav oluştur
    const exam = await Exam.create({
      name,
      exam_type: "img",
      start_date,
      end_date,
      start_time,
      end_time,
      sure,
      attemp_limit,
      passing_score,
      timed,
      sonucu_gizle,
      bookletId,
      question_count,
    });

    let selectedQuestions = [];

    // 2. Soru Seçimi - Yüzdelere göre
    if (orana_gore_ata === true) {
      const totalPercent = Object.values(category_percentages).reduce(
        (sum, p) => sum + Number(p),
        0
      );

      if (totalPercent !== 100) {
        return res
          .status(400)
          .json({ message: "Kategori yüzdelerinin toplamı 100 olmalıdır." });
      }

      for (const [categoryId, percentage] of Object.entries(
        category_percentages
      )) {
        const adet = Math.round((toplam_soru * percentage) / 100);

        if (adet > 0) {
          const questions = await PoolImg.findAll({
            where: {
              bookletId,
              difLevelId: zorluk_seviyesi,
              questionCategoryId: categoryId,
            },
            order: method === "random" ? sequelize.random() : [["id", "ASC"]],
            limit: adet,
          });

          selectedQuestions.push(...questions);
        }
      }
    } else {
      // 3. Tüm sorular direkt seçilir (oranlama yok)
      selectedQuestions = await PoolImg.findAll({
        where: { bookletId },
        order: method === "random" ? sequelize.random() : [["id", "ASC"]],
      });
    }

    // 4. ExamQuestions kaydı
    const examQuestions = selectedQuestions.map((q, index) => ({
      examId: exam.id,
      questionId: q.id,
      questionType: "img",
      order: index + 1,
    }));

    await ExamQuestions.bulkCreate(examQuestions);

    // 5. Kullanıcılara sınav atama
    const examUserRelations = userIds.map((userId) => ({
      examId: exam.id,
      userId,
      completed: false,
    }));

    await ExamUser.bulkCreate(examUserRelations);

    // 6. Mail gönder
    if (mail === true) {
      const users = await User.findAll({ where: { id: userIds } });
      const currentDate = new Date().toLocaleDateString("tr-TR");

      for (const user of users) {
        const mailOptions = {
          to: user.email,
          subject: "Tav Akademi",
          text: `Sayın ${user.ad}, ${currentDate} tarihinde tarafınıza "${exam.name}" isimli sınav ataması yapılmıştır. Bu sınavı en geç ${exam.end_date} tarihine kadar tamamlamanız gerekmektedir.
           Sınav linki: http://localhost:3000`,
        };
        await sendMail(mailOptions);
      }
    }

    // 7. Log
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından "${exam.name}" isimli görsel sınav oluşturuldu.`,
      category: "Exam",
    });

    res.status(201).json({ message: "Sınav oluşturuldu", examId: exam.id });
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

///sınavları getirme
exports.get_all_exam = async (req, res) => {
  try {
    const exams = await Exam.findAll();
    res.status(200).json(exams);
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//sınavları getirme(user id ile, kendi sınavlarını getirme)
exports.get_exam_by_userid = async (req, res) => {
  try {
    const userId = req.user.id;
    const exams = await Exam.findAll({
      where: {
        educationExam: false,
      },
      include: [
        {
          model: ExamUser,
          where: { userId },
        },
      ],
    });
    res.status(200).json(exams);
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//sınav detayını getirme
exports.get_exam_by_id = async (req, res) => {
  try {
    const examId = req.params.examId;
    const exam = await Exam.findByPk(examId, {
      include: [
        {
          model: ExamUser,
          include: [
            {
              model: User,
            },
          ],
        },
        {
          model: ExamQuestions,
          include: [
            {
              model: PoolImg,
              as: "imgQuestion", // alias burada belirtilmeli
            },
            {
              model: PoolTeo,
              as: "teoQuestion", // alias burada belirtilmeli
            },
          ],
        },
      ],
    });

    res.status(200).json(exam);
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//sınavı silme
exports.delete_exam = async (req, res) => {
  try {
    const examId = req.params.examId;

    // Önce sınava bağlı soruları sil
    await ExamQuestions.destroy({ where: { examId } });

    // Sonra sınava bağlı kullanıcı ilişkilerini sil
    await ExamUser.destroy({ where: { examId } });

    // Son olarak sınavı sil
    const deletedCount = await Exam.destroy({ where: { id: examId } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Sınav bulunamadı." });
    }

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından ${examId} id'li sınav silindi.`,
      category: "Exam",
    });
    res.status(200).json({ message: "Sınav ve ilişkili kayıtlar silindi." });
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//birleşik sınav oluşturma
exports.create_unified_exam = async (req, res, next) => {
  const t = await sequelize.transaction();
  const unifiedId = uuidv4();
  try {
    const {
      name,
      start_date,
      end_date,
      start_time_teo,
      end_time_teo,
      start_time_img,
      end_time_img,
      sure_teo,
      sure_img,
      attemp_limit,
      passing_score,
      mail,
      timed,
      sonucu_gizle,
      bookletId_teo,
      bookletId_img,
      method,
      userIds,
      orana_gore_ata,
      zorluk_seviyesi,
      toplam_soru,
      temiz_bagaj_oran,
      tanimsiz_bagaj_oran,
      patlayicilar_oran,
      atesli_silahlar_oran,
      kesici_aletler_oran,
      tehlikeli_maddeler_oran,
      educationExam,
    } = req.body;

    let examTeo = null;
    let examImg = null;

    // TEORİK SINAV VARSA OLUŞTUR
    if (bookletId_teo) {
      const bookletTeo = await Booklet.findOne({
        where: { id: bookletId_teo },
      });
      if (!bookletTeo) throw new Error("Teorik booklet bulunamadı");
      const question_count_teo = bookletTeo.question_count;

      examTeo = await Exam.create(
        {
          name,
          unifiedId,
          exam_type: "teo",
          start_date,
          end_date,
          start_time: start_time_teo,
          end_time: end_time_teo,
          sure: sure_teo,
          attemp_limit,
          passing_score,
          timed,
          sonucu_gizle,
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
    }

    // GÖRÜNTÜ SINAV VARSA OLUŞTUR
    if (bookletId_img) {
      const bookletImg = await Booklet.findOne({
        where: { id: bookletId_img },
      });
      if (!bookletImg) throw new Error("Görüntü booklet bulunamadı");

      const question_count_img =
        orana_gore_ata === true ? toplam_soru : bookletImg.question_count;

      examImg = await Exam.create(
        {
          name,
          unifiedId,
          exam_type: "img",
          start_date,
          end_date,
          start_time: start_time_img,
          end_time: end_time_img,
          sure: sure_img,
          attemp_limit,
          passing_score,
          timed,
          sonucu_gizle,
          bookletId: bookletId_img,
          question_count: question_count_img,
          educationExam,
        },
        { transaction: t }
      );

      let imgQs = [];
      if (orana_gore_ata) {
        const cats = [
          { k: "Temiz Bagaj", o: temiz_bagaj_oran },
          { k: "Tanımsız Bagaj", o: tanimsiz_bagaj_oran },
          { k: "Patlayıcılar ve El Bombaları", o: patlayicilar_oran },
          { k: "Ateşli Silahlar ve Parçaları", o: atesli_silahlar_oran },
          { k: "Kesici Aletler ve El Aletleri", o: kesici_aletler_oran },
          { k: "Tehlikeli Maddeler ve Sıvılar", o: tehlikeli_maddeler_oran },
        ];
        for (const { k, o } of cats) {
          const count = Math.round((toplam_soru * o) / 100);
          if (!count) continue;
          const qbatch = await PoolImg.findAll({
            where: {
              bookletId: bookletId_img,
              difLevel: zorluk_seviyesi,
              imageCategory: k,
            },
            limit: count,
            order: method === "random" ? sequelize.random() : [["id", "ASC"]],
            transaction: t,
          });
          imgQs.push(...qbatch);
        }
      } else {
        imgQs = await PoolImg.findAll({
          where: { bookletId: bookletId_img },
          order: method === "random" ? sequelize.random() : [["id", "ASC"]],
          transaction: t,
        });
      }

      await ExamQuestions.bulkCreate(
        imgQs.map((q, i) => ({
          examId: examImg.id,
          questionId: q.id,
          questionType: "img",
          order: i + 1,
        })),
        { transaction: t }
      );
    }

    // Kullanıcı ilişkilerini sınav varsa oluştur
    if (examImg && userIds?.length) {
      const examUserImgRelations = userIds.map((userId) => ({
        examId: examImg.id,
        userId,
        completed: false,
      }));
      await ExamUser.bulkCreate(examUserImgRelations, { transaction: t });
    }

    if (examTeo && userIds?.length) {
      const examUserTeoRelations = userIds.map((userId) => ({
        examId: examTeo.id,
        userId,
        completed: false,
      }));
      await ExamUser.bulkCreate(examUserTeoRelations, { transaction: t });
    }

    // Mail atma işlemi
    if (mail && userIds?.length) {
      const users = await User.findAll({
        where: { id: userIds },
        transaction: t,
      });
      const dateStr = new Date().toLocaleDateString("tr-TR");
      for (const u of users) {
        await sendMail({
          to: u.email,
          subject: "Tav Akademi – Yeni Sınav Ataması",
          text: `Sayın ${u.ad},\n\n${dateStr} tarihinde size "${name}" adlı birleşik sınav ataması yapılmıştır. Sınavı en geç ${end_date} tarihine kadar tamamlayınız.\n\nSınav linki: http://localhost:3000\n`,
        });
      }
    }

    await t.commit();

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından ${name} adlı birleşik sınav oluşturuldu`,
      category: "Exam",
    });

    res.status(201).json({
      message: "Sınav oluşturuldu",
      unified: {
        teoId: examTeo?.id || null,
        imgId: examImg?.id || null,
        teo: examTeo,
        img: examImg,
      },
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    next(err);
  }
};

//kullanıcı kendi sınavlarını görme(teorik)
exports.get_user_teo_exams = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const examUsers = await ExamUser.findAll({
      where: {
        userId,
      },
    });
    const examIds = examUsers.map((exam) => exam.examId);
    const exams = await Exam.findAll({
      where: {
        id: examIds,
        exam_type: "teo",
        unifiedId: null,
        educationExam: false,
      },
      include: {
        model: ExamUser,
        where: {
          userId,
        },
      },
      attributes: {
        exclude: ["attemp_limit", "timed", "sonucu_gizle", "bookletId"],
      },
    });
    res.status(200).json(exams);
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

///kullanıcı kendi sınavlarını görme(görsel)
exports.get_user_img_exams = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const examUsers = await ExamUser.findAll({
      where: {
        userId,
      },
    });
    const examIds = examUsers.map((exam) => exam.examId);
    const exams = await Exam.findAll({
      where: {
        id: examIds,
        exam_type: "img",
        unifiedId: null,
        educationExam: false,
      },
      include: {
        model: ExamUser,
        where: {
          userId,
        },
      },
      attributes: {
        exclude: ["attemp_limit", "timed", "sonucu_gizle", "bookletId"],
      },
    });

    res.status(200).json(exams);
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

//kullanıcı kendi sınavlarını görme(birleşik)
exports.get_user_unified_exams = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const examUsers = await ExamUser.findAll({
      where: { userId },
    });

    const examIds = examUsers.map((exam) => exam.examId);

    if (examIds.length === 0) {
      return res.status(200).json([]); // Sınav yoksa boş dizi dön
    }

    // unifiedId null olmayan yani birleşik sınavları çek
    const exams = await Exam.findAll({
      where: {
        id: examIds,
        unifiedId: { [Op.ne]: null },
        educationExam: false,
      },
      include: {
        model: ExamUser,
        where: {
          userId,
        },
      },
      attributes: {
        exclude: ["attemp_limit", "timed", "sonucu_gizle", "bookletId"],
      },
    });

    const groupedExams = exams.reduce((acc, exam) => {
      if (!exam.unifiedId) return acc;

      if (!acc[exam.unifiedId]) {
        acc[exam.unifiedId] = {
          unifiedId: exam.unifiedId,
          teo: null,
          img: null,
        };
      }
      if (exam.exam_type === "teo") {
        acc[exam.unifiedId].teo = exam;
      } else if (exam.exam_type === "img") {
        acc[exam.unifiedId].img = exam;
      }
      return acc;
    }, {});

    res.status(200).json(Object.values(groupedExams));
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
