const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

// LibraryCategory ve LibrarySubCategory modellerini dahil etmeniz gerekecek
const ImageGaleryCat = require("./galleryCat");
const ImageGalerySubCat = require("./gallerySubCat");

const ImageGalery = sequelize.define("ImageGaleries", {
  image: {
    type: DataTypes.STRING,
    allowNull: true, // Resmin URL'si veya dosya yolu burada tutulacak
  },
  imageCatId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: ImageGaleryCat,  // Yabancı anahtar olarak ImageGaleryCat modelini referans alıyoruz
      key: "id",  // İlişkili modelin id'si ile bağlanacak
    },
  },
  imageSubCatId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: ImageGalerySubCat,  // Yabancı anahtar olarak ImageGalerySubCat modelini referans alıyoruz
      key: "id",  // İlişkili modelin id'si ile bağlanacak
    },
  },
});


module.exports = ImageGalery;
