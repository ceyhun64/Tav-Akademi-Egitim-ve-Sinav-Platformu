const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const EducationUser = sequelize.define("educationUsers", {
  educationId: {
    type: DataTypes.INTEGER,
    references: {
      model: "educations",
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
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
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
  lastSection: {
    type: DataTypes.STRING,
    allowNull: true, // örn: "video-3", "slide-5"
  },
  lastTime: {
    type: DataTypes.FLOAT,
    allowNull: true, // örn: 128.4 saniye (video)
  },
});

module.exports = EducationUser;
