const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const ExamUser = sequelize.define(
  "examUsers",
  {
    examId: {
      type: DataTypes.INTEGER,
      references: {
        model: "exams",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    true_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    false_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN, //bitirmiş mi bitirmemiş mi
      defaultValue: false,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pass: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    entry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    entry_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    exit_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    exit_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ExamUser;
