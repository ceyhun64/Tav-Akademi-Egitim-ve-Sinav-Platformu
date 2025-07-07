const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const EducationSet = sequelize.define("EducationSets", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teoExamId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  imgExamId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  exam_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sure_teo: {
    type: DataTypes.INTEGER, // dakika cinsindeyse INTEGER doğru olur
    allowNull: true,
  },
  sure_img: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  passing_score_teo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  passing_score_img: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  bookletId_teo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  bookletId_img: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  method: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  educationExam: {
    type: DataTypes.STRING, // Eğer bu bir tanımlayıcı veya JSON-string ise STRING uygundur
    allowNull: true,
  },
});

module.exports = EducationSet;
