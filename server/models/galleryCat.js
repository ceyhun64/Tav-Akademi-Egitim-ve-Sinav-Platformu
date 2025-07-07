// models/Category.js
const { DataTypes } = require("sequelize");
const sequelize = require("../data/db"); // Veritabanı bağlantısı

const ImageGaleryCat = sequelize.define(
  "ImageGaleryCategories",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Zaman damgası istemiyorsak

  }
);

module.exports = ImageGaleryCat;
