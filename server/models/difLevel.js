const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const DifLevel = sequelize.define(
  "difLevels",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);
module.exports = DifLevel;
