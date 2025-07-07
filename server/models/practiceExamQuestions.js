const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const PracticeExamQuestions = sequelize.define("practice_exam_questions", {
  practiceExamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = PracticeExamQuestions;
