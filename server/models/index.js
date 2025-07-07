// models/index.js
const sequelize = require("../data/db");

// Modelleri içe aktar
const User = require("./user");
const Exam = require("./exam");
const Booklet = require("./booklet");
const ExamUser = require("./examUser");
const ExamQuestions = require("./examQuestions");
const PoolImg = require("./poolImg");
const PoolTeo = require("./poolTeo");
const QuestionCategory = require("./questionCategory");
const DifLevel = require("./difLevel");

const EducationSet = require("./educationSet");
const EducationSetUser = require("./educationSetUser");
const Education = require("./education");
const EduAndEduSet = require("./eduAndEduSets");
const EducationUser = require("./educationUser");
const EducationPages = require("./educationPages");

const ImageGaleryCat = require("./galleryCat");
const ImageGalerySubCat = require("./gallerySubCat");
const ImageGalery = require("./gallery");

const UserTeoAnswers = require("./userTeoAnswers");
const UserImgAnswers = require("./userImgAnswers");

const EducationExam = require("./educationExam");

const BanSubs = require("./banSubs");
const Group = require("./group");
const Institution = require("./institution");
const Session = require("./session");
const Announcement = require("./announcement");

const Role = require("./role");
const RoleLevel = require("./roleLevel");
const RoleLevelPerm = require("./roleLevelPerm");
const Permission = require("./permission");
const ActivityLog = require("./activityLog");
const UploadFile = require("./uploadFile");
const UploadFileUser = require("./uploadFileUser");
const Certificate = require("./certificate");

const PracticeExamQuestions = require("./practiceExamQuestions");
const PracticeExam = require("./practiceExam");
const PracticeExamUser = require("./practiceExamUser");

// İlişkiler

// --- User - Exam Many-to-Many via ExamUser ---
Exam.belongsToMany(User, {
  through: ExamUser,
  foreignKey: "examId",
  otherKey: "userId",
});
User.belongsToMany(Exam, {
  through: ExamUser,
  foreignKey: "userId",
  otherKey: "examId",
});

ExamUser.belongsTo(Exam, { foreignKey: "examId" });
ExamUser.belongsTo(User, { foreignKey: "userId" });
Exam.hasMany(ExamUser, { foreignKey: "examId" });
User.hasMany(ExamUser, { foreignKey: "userId" });

// --- Exam - Booklet One-to-Many ---
Exam.belongsTo(Booklet, { foreignKey: "bookletId" });
Booklet.hasMany(Exam, { foreignKey: "bookletId" });

// --- Exam - ExamQuestions One-to-Many ---
Exam.hasMany(ExamQuestions, { foreignKey: "examId" });
ExamQuestions.belongsTo(Exam, { foreignKey: "examId" });

// --- PoolImg - Booklet One-to-Many ---
PoolImg.belongsTo(Booklet, { foreignKey: "bookletId" });
Booklet.hasMany(PoolImg, { foreignKey: "bookletId" });

// --- PoolTeo - Booklet One-to-Many ---
PoolTeo.belongsTo(Booklet, { foreignKey: "bookletId" });
Booklet.hasMany(PoolTeo, { foreignKey: "bookletId" });

// ExamQuestions ile PoolImg ilişkisi
ExamQuestions.belongsTo(PoolImg, {
  foreignKey: "questionId",
  constraints: false,
  as: "imgQuestion",
});

// ExamQuestions ile PoolTeo ilişkisi
ExamQuestions.belongsTo(PoolTeo, {
  foreignKey: "questionId",
  constraints: false,
  as: "teoQuestion",
});

// --- ImageGaleryCat - ImageGalerySubCat One-to-Many ---
ImageGaleryCat.hasMany(ImageGalerySubCat, {
  foreignKey: "imageCatId",
  as: "subcategories",
});
ImageGalerySubCat.belongsTo(ImageGaleryCat, {
  foreignKey: "imageCatId",
  as: "category",
});

// --- ImageGaleryCat - ImageGalery One-to-Many ---
ImageGaleryCat.hasMany(ImageGalery, {
  foreignKey: "imageCatId",
  as: "imageGalerys",
});
ImageGalery.belongsTo(ImageGaleryCat, {
  foreignKey: "imageCatId",
  as: "category",
});

// --- ImageGalerySubCat - ImageGalery One-to-Many ---
ImageGalerySubCat.hasMany(ImageGalery, {
  foreignKey: "imageSubCatId",
  as: "imageGalerySubCats",
});
ImageGalery.belongsTo(ImageGalerySubCat, {
  foreignKey: "imageSubCatId",
  as: "subcategory",
});

User.hasMany(UserTeoAnswers, { foreignKey: "user_id" });
UserTeoAnswers.belongsTo(User, { foreignKey: "user_id" });

Exam.hasMany(UserTeoAnswers, { foreignKey: "exam_id" });
UserTeoAnswers.belongsTo(Exam, { foreignKey: "exam_id" });

PoolTeo.hasMany(UserTeoAnswers, { foreignKey: "question_id" });
UserTeoAnswers.belongsTo(PoolTeo, { foreignKey: "question_id" });

User.hasMany(UserImgAnswers, { foreignKey: "user_id" });
UserImgAnswers.belongsTo(User, { foreignKey: "user_id" });

Exam.hasMany(UserImgAnswers, { foreignKey: "exam_id" });
UserImgAnswers.belongsTo(Exam, { foreignKey: "exam_id" });

PoolImg.hasMany(UserImgAnswers, { foreignKey: "question_id" });
UserImgAnswers.belongsTo(PoolImg, { foreignKey: "question_id" });

Education.belongsToMany(EducationSet, {
  through: EduAndEduSet,
  foreignKey: "educationId",
  otherKey: "educationSetId",
});

EducationSet.belongsToMany(Education, {
  through: EduAndEduSet,
  foreignKey: "educationSetId",
  otherKey: "educationId",
});

EducationSet.belongsToMany(User, {
  through: EducationSetUser,
  foreignKey: "educationSetId",
  otherKey: "userId",
});
User.belongsToMany(EducationSet, {
  through: EducationSetUser,
  foreignKey: "userId",
  otherKey: "educationSetId",
});

EducationSetUser.belongsTo(User, { foreignKey: "userId" });
EducationSetUser.belongsTo(EducationSet, { foreignKey: "educationSetId" });

User.hasMany(EducationSetUser, { foreignKey: "userId" });
EducationSet.hasMany(EducationSetUser, { foreignKey: "educationSetId" });

Education.belongsToMany(User, {
  through: EducationUser,
  foreignKey: "educationId",
  otherKey: "userId",
});
User.belongsToMany(Education, {
  through: EducationUser,
  foreignKey: "userId",
  otherKey: "educationId",
});

EducationUser.belongsTo(User, { foreignKey: "userId" });
EducationUser.belongsTo(Education, { foreignKey: "educationId" });

User.hasMany(EducationUser, { foreignKey: "userId" });
Education.hasMany(EducationUser, { foreignKey: "educationId" });

Education.hasMany(EducationPages, { foreignKey: "educationId" });
EducationPages.belongsTo(Education, { foreignKey: "educationId" });

// EduAndEduSet - Education ilişkisi
EduAndEduSet.belongsTo(Education, {
  foreignKey: "educationId",
  as: "education", // küçük harf, alias farkı önemli
});
Education.hasMany(EduAndEduSet, {
  foreignKey: "educationId",
  as: "eduAndEduSetsForEducation", // farklı alias
});

// EduAndEduSet - EducationSet ilişkisi
EducationSet.hasMany(EduAndEduSet, {
  foreignKey: "educationSetId",
  as: "eduAndEduSetsForSet", // farklı alias
});
EduAndEduSet.belongsTo(EducationSet, {
  foreignKey: "educationSetId",
  as: "educationSet", // küçük harf alias farkı önemli
});

QuestionCategory.hasMany(PoolImg, {
  foreignKey: "questionCategoryId",
  sourceKey: "id",
});

PoolImg.belongsTo(QuestionCategory, {
  foreignKey: "questionCategoryId",
  targetKey: "id",
});

DifLevel.hasMany(PoolImg, {
  foreignKey: "difLevelId",
  sourceKey: "id",
});

PoolImg.belongsTo(DifLevel, {
  foreignKey: "difLevelId",
  targetKey: "id",
});

DifLevel.hasMany(PoolTeo, {
  foreignKey: "difLevelId",
  sourceKey: "id",
});

PoolTeo.belongsTo(DifLevel, {
  foreignKey: "difLevelId",
  targetKey: "id",
});

UserImgAnswers.belongsTo(User, { foreignKey: "user_id" });
UserImgAnswers.belongsTo(Exam, { foreignKey: "exam_id" });
UserImgAnswers.belongsTo(PoolImg, { foreignKey: "question_id" });

UserTeoAnswers.belongsTo(User, { foreignKey: "user_id" });
UserTeoAnswers.belongsTo(Exam, { foreignKey: "exam_id" });
UserTeoAnswers.belongsTo(PoolTeo, { foreignKey: "question_id" });

Session.belongsTo(User, { foreignKey: "userId" });
User.belongsTo(Institution, { foreignKey: "lokasyonId", as: "lokasyon" });
User.belongsTo(Group, { foreignKey: "grupId", as: "grup" });

Institution.hasMany(Announcement, { foreignKey: "institutionId" });
Announcement.belongsTo(Institution, { foreignKey: "institutionId" });

Group.hasMany(Announcement, { foreignKey: "groupId" });
Announcement.belongsTo(Group, { foreignKey: "groupId" });

RoleLevel.belongsToMany(Permission, {
  through: "rolelevelperms", // model adın neyse onu yaz
  foreignKey: "roleLevelId",
});

Permission.belongsToMany(RoleLevel, {
  through: "rolelevelperms",
  foreignKey: "permissionId",
});
// models/index.js veya Permission modelinde bir yerde
RoleLevelPerm.belongsTo(Permission, {
  foreignKey: "permissionId",
  as: "permission",
});

Permission.hasMany(RoleLevelPerm, {
  foreignKey: "permissionId",
  as: "roleLevelPerms",
});

Role.belongsTo(RoleLevel, {
  foreignKey: "roleLevelId",
  as: "roleLevel", // <-- alias ekliyoruz
});
RoleLevel.hasMany(Role, {
  foreignKey: "roleLevelId",
  as: "roles", // <-- ters ilişki için alias (opsiyonel ama iyi olur)
});

User.belongsToMany(UploadFile, {
  through: "uploadfileusers", // model adın neyse onu yaz
  foreignKey: "user_id",
});

UploadFile.belongsToMany(User, {
  through: "uploadfileusers",
  foreignKey: "file_id",
});

// uploadFileUser.js (model tanımı)
UploadFileUser.belongsTo(UploadFile, { foreignKey: "file_id", as: "file" });

// uploadFile.js
UploadFile.hasMany(UploadFileUser, {
  foreignKey: "file_id",
  as: "uploadFileUsers",
});

UploadFileUser.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(UploadFileUser, { foreignKey: "user_id", as: "uploadFileUsers" });

EducationSet.belongsTo(Exam, { as: "teoExam", foreignKey: "teoExamId" });
EducationSet.belongsTo(Exam, { as: "imgExam", foreignKey: "imgExamId" });

User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});

Role.hasMany(User, {
  foreignKey: "roleId",
  as: "users",
});

PracticeExam.associate = (models) => {
  PracticeExam.belongsToMany(models.PoolImg, {
    through: models.PracticeExamQuestions,
    foreignKey: "practiceExamId",
    otherKey: "questionId",
  });

  PracticeExam.belongsToMany(models.User, {
    through: models.PracticeExamUser,
    foreignKey: "practiceExamId",
    otherKey: "userId",
  });
};

PracticeExamQuestions.associate = (models) => {
  PracticeExamQuestions.belongsTo(models.PracticeExam, {
    foreignKey: "practiceExamId",
  });

  PracticeExamQuestions.belongsTo(models.PoolImg, {
    foreignKey: "questionId",
  });
};
PracticeExamUser.associate = (models) => {
  PracticeExamUser.belongsTo(models.PracticeExam, {
    foreignKey: "practiceExamId",
  });

  PracticeExamUser.belongsTo(models.User, {
    foreignKey: "userId",
  });
};

PracticeExamQuestions.belongsTo(PoolImg, {
  foreignKey: "questionId", // questionId PoolImg.id'yi işaret ediyor
  as: "poolImgQuestion", // alias opsiyonel ama tavsiye edilir
});
// practiceExam.model.js
PracticeExam.hasMany(PracticeExamQuestions, {
  foreignKey: "practiceExamId", // uygun foreign key
  as: "questions",
});

// practiceExamQuestions.model.js
PracticeExamQuestions.belongsTo(PracticeExam, {
  foreignKey: "practiceExamId",
  as: "practiceExam",
});

module.exports = {
  sequelize,
  User,
  Exam,
  Booklet,
  ExamUser,
  ExamQuestions,
  PoolImg,
  PoolTeo,
  Education,
  EducationUser,
  EducationPages,
  EducationSet,
  EduAndEduSet,
  EducationSetUser,
  ImageGaleryCat,
  ImageGalerySubCat,
  ImageGalery,
  UserTeoAnswers,
  UserImgAnswers,
  QuestionCategory,
  DifLevel,
  BanSubs,
  Group,
  Institution,
  Session,
  Announcement,
  Role,
  RoleLevel,
  Permission,
  RoleLevelPerm,
  ActivityLog,
  UploadFile,
  UploadFileUser,
  Certificate,
  PracticeExam,
  PracticeExamQuestions,
  PracticeExamUser,
};
