const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const IllegalMove = sequelize.define("illegalmoves", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  move: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = IllegalMove;
