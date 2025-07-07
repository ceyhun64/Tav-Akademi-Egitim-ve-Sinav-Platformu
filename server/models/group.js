const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Group = sequelize.define("groups", {
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

module.exports = Group;
