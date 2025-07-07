const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const QuestionCategory = sequelize.define(
  "questionCategories",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = QuestionCategory;
