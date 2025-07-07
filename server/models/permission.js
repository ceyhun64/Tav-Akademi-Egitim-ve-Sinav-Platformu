const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Permission = sequelize.define("permissions", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Permission;
