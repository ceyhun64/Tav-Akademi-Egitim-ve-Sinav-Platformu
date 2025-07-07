const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const UploadFileUser = sequelize.define("uploadfileusers", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_downloaded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = UploadFileUser;
