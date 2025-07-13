const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

// LibraryCategory ve LibrarySubCategory modellerini dahil etmeniz gerekecek
const ImageGaleryCat = require("./galleryCat");
const ImageGalerySubCat = require("./gallerySubCat");

const ImageGalery = sequelize.define(
  "ImageGaleries",
  {
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageCatId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ImageGaleryCat,
        key: "id",
      },
    },
    imageSubCatId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ImageGalerySubCat,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true, // tablo adı "ImageGaleries" olarak kalır
  }
);

module.exports = ImageGalery;
