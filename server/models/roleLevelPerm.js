const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const RoleLevelPerm = sequelize.define("rolelevelperms", {
  roleLevelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "rolelevels",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    primaryKey: true, // burada primary key olarak işaretlendi
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "permissions",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    primaryKey: true, // burada da
  },
});

module.exports = RoleLevelPerm;
