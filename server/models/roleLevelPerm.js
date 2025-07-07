const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const RoleLevelPerm = sequelize.define("rolelevelperms", {
  roleLevelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "rolelevels", // Tablo adı veya Model referansı olabilir
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "permissions", // Tablo adı veya Model referansı olabilir
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

module.exports = RoleLevelPerm;
