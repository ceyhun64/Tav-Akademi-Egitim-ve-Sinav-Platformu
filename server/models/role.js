const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Role = sequelize.define("roles", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roleLevelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  level:{
    type:DataTypes.INTEGER,
    allowNull:true
  }
});

module.exports = Role;
