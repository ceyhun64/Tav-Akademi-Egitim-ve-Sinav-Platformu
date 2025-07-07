const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Institution = sequelize.define("institutions", {
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

module.exports = Institution;
