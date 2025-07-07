const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const UserImgAnswers = sequelize.define("user_img_answers", {
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
      model: "poolImgs",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coordinate: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = UserImgAnswers;
