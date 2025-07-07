// exam.js
const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Exam = sequelize.define("exams", {
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
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  sure: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  attemp_limit: {
    type: DataTypes.INTEGER,
    allowNull: true,
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

module.exports = Exam;
