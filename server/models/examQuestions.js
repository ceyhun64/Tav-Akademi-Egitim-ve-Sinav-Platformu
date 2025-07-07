// examQuestions.js
const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");
const Exam = require("./exam");

const ExamQuestions = sequelize.define("exam_questions", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  examId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Exam,
      key: "id",
    },
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionType: {
    type: DataTypes.ENUM("teo", "img"),
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = ExamQuestions;
