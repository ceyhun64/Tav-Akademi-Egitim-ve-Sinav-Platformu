const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const RoleLevel = sequelize.define("rolelevels", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
  }
});
module.exports = RoleLevel;
