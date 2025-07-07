const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const UploadFile = sequelize.define("uploadfiles", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = UploadFile;
