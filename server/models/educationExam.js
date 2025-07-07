// exam.js
const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const EducationExam = sequelize.define("educationExams", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  exam_type: {
    type: DataTypes.ENUM("teo", "img"), // bu daha kontrollü olur
    allowNull: false,
  },
  sure: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  attemp_limit: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  passing_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timed: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  sonucu_gizle: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  bookletId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  question_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unifiedId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  educationExam: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
});

module.exports = EducationExam;
