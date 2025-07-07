const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const BanSub = sequelize.define("bansubs", {
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

module.exports = BanSub;
