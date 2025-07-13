// models/Category.js
const { DataTypes } = require("sequelize");
const sequelize = require("../data/db"); // Veritabanı bağlantısı

const ImageGaleryCat = sequelize.define(
  "ImageGaleryCat", // Model adı tekil ve basit
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "imageGaleryCategories", // burada tablo adını ver, küçük harflerle
    timestamps: false,
  }
);

module.exports = ImageGaleryCat;
