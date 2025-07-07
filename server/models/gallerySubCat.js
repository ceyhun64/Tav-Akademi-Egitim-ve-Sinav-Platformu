// models/SubCategory.js
const { DataTypes } = require("sequelize");
const sequelize = require("../data/db"); // Veritabanı bağlantısı

const ImageGalerySubCat = sequelize.define(
  "imageGalerySubCategories",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageCatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "imageGaleryCategories",
        key: "id",
      },
    },
  },
  {
    timestamps: false, // Zaman damgası istemiyorsak
  }
);


module.exports = ImageGalerySubCat;
