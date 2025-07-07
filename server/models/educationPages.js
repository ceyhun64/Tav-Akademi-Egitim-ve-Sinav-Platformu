// server\models\educationPages.js
const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const EducationPages = sequelize.define("EducationPages", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  educationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  page: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = EducationPages;
