const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const UserTeoAnswers = sequelize.define("user_teo_answers", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "exams",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "poolTeos",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = UserTeoAnswers;
