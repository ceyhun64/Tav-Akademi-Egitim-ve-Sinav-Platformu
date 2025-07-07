// models/Egitim.js
const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Education = sequelize.define("educations", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // saniye cinsinden eğitim süresi
    allowNull: true,
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  num_pages: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Education;
