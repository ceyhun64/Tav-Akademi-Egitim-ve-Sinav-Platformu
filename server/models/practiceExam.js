const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const PracticeExam = sequelize.define("practice_exam", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  question_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = PracticeExam;
