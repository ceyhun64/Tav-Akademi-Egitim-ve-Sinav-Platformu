const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const PracticeExamUser = sequelize.define("practice_exam_users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  practiceExamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = PracticeExamUser;
